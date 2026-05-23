/**
 * VOXEN — AUDIO SERVICE
 * ═══════════════════════════════════════════════════════════
 * Gestionează tot ce ține de audio: înregistrare, analiză
 * prozodică în timp real, și transcriere speech-to-text.
 *
 * RESPONSABILITATE UNICĂ: audio input → text + prosody.
 * Nu știe nimic despre criză, UI, sau state.
 *
 * DOUĂ FLUXURI PARALELE:
 *   1. Web Audio API → prosody metrics (RMS, pitch, pauseRatio)
 *      — rulează în timp real la fiecare 100ms
 *   2. Web Speech API (SpeechRecognition) → text transcris
 *      — result final la oprirea înregistrării
 *
 * CLEANUP:
 *   Toate intervalele, stream-urile și referințele sunt
 *   curățate la stop() sau destroy(). Fără memory leaks.
 *
 * DEGRADARE GRAȚIOASĂ:
 *   Dacă STT nu e disponibil (browser vechi), continuăm
 *   cu analiză prozodică only. crisisDetection va primi
 *   string gol — va folosi doar semnalele prozodice.
 *
 * NOTA DESPRE STT ȘI CONFIDENȚIALITATE:
 *   Web Speech API trimite audio la serverele Google/Apple
 *   pentru procesare. Informăm utilizatorul despre asta la
 *   primul acces. În producție, vom migra la Whisper self-hosted
 *   sau Whisper via API propriu pentru a evita data sharing.
 * ═══════════════════════════════════════════════════════════
 */

import { eventBus, EVENTS } from '../core/eventBus.js';

// Praguri pentru detecția vocii (Voice Activity Detection)
const VAD = {
  SILENCE_THRESHOLD: 0.01,     // RMS sub care considerăm tăcere
  PITCH_MIN: 50,               // Hz — sub 50 Hz nu e voce umană
  PITCH_MAX: 500,              // Hz — peste 500 Hz nu e voce umană normală
};

// Interval de sampling pentru analiză prozodică (ms)
const PROSODY_INTERVAL_MS = 100;

class AudioService {
  constructor() {
    // Web Audio API
    this._audioContext = null;
    this._analyser = null;
    this._mediaStream = null;
    this._mediaRecorder = null;
    this._recordingChunks = [];
    this._analysisInterval = null;
    this._recTimerInterval = null;
    this._animFrameId = null;

    // Datele prozodice acumulate pe sesiune
    this._prosody = this._freshProsody();

    // Web Speech API
    this._recognition = null;
    this._lastTranscript = '';
    this._recognitionActive = false;

    // Flags de stare
    this._isRecording = false;
    this._recordingStartTime = null;

    // AbortController pentru fetch-uri async (retry logic)
    this._sttAbortController = null;
  }

  // ── Public API ───────────────────────────────────────────

  /**
   * Începe înregistrarea. Pornește simultan:
   * - MediaRecorder pentru captura audio
   * - Web Audio pentru analiză prozodică în timp real
   * - SpeechRecognition pentru transcripție live
   *
   * @param {object} options
   * @param {number} options.durationSec - durata maximă (default: 60)
   * @param {function} options.onLiveMetrics - callback(rms, pitch) la fiecare 100ms
   * @returns {Promise<void>}
   * @throws {Error} dacă microfonul e refuzat
   */
  async start({ durationSec = 60, onLiveMetrics = null } = {}) {
    if (this._isRecording) {
      this.stop();
      return;
    }

    // Resetăm datele prozodice
    this._prosody = this._freshProsody();
    this._lastTranscript = '';
    this._recordingStartTime = Date.now();

    // 1. Obținem stream-ul audio
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
    this._mediaStream = stream;

    // 2. Setăm Web Audio API pentru prosody
    this._audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const source = this._audioContext.createMediaStreamSource(stream);
    this._analyser = this._audioContext.createAnalyser();
    this._analyser.fftSize = 2048;
    source.connect(this._analyser);

    // 3. Setăm MediaRecorder
    this._recordingChunks = [];
    this._mediaRecorder = new MediaRecorder(stream);
    this._mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) this._recordingChunks.push(e.data);
    };
    this._mediaRecorder.onstop = () => {
      stream.getTracks().forEach(t => t.stop());
      this._onRecordingComplete();
    };
    this._mediaRecorder.start();

    // 4. Pornim analiza prozodică în timp real
    const buffer = new Float32Array(this._analyser.fftSize);
    const sampleRate = this._audioContext.sampleRate;

    this._analysisInterval = setInterval(() => {
      if (!this._analyser) return;
      this._analyser.getFloatTimeDomainData(buffer);

      // RMS energy
      let sum = 0;
      for (let i = 0; i < buffer.length; i++) sum += buffer[i] * buffer[i];
      const rms = Math.sqrt(sum / buffer.length);

      this._prosody.energySamples.push(rms);
      this._prosody.totalSamples++;

      if (rms < VAD.SILENCE_THRESHOLD) {
        this._prosody.silenceSamples++;
      } else {
        const pitch = this._detectPitch(buffer, sampleRate);
        if (pitch > VAD.PITCH_MIN && pitch < VAD.PITCH_MAX) {
          this._prosody.pitchSamples.push(pitch);
        }
      }

      // Emitem metrici live pe eventBus
      const livePitch = this._prosody.pitchSamples.slice(-1)[0] || 0;
      eventBus.emit(EVENTS.PROSODY_UPDATE, { rms, pitch: livePitch });

      // Callback direct pentru UI-ul care vrea actualizări rapide (grafice)
      if (onLiveMetrics) onLiveMetrics(rms, livePitch);
    }, PROSODY_INTERVAL_MS);

    // 5. Pornim Speech Recognition
    this._startSpeechRecognition();

    // 6. Auto-stop după durata selectată
    setTimeout(() => {
      if (this._isRecording) this.stop();
    }, durationSec * 1_000);

    this._isRecording = true;
    eventBus.emit(EVENTS.SESSION_START, { durationSec });
  }

  /**
   * Oprește înregistrarea. Declanșează analiza și emiterea rezultatelor.
   */
  stop() {
    if (!this._isRecording && !this._mediaRecorder) return;

    // Oprește analiza prozodică
    if (this._analysisInterval) {
      clearInterval(this._analysisInterval);
      this._analysisInterval = null;
    }

    // Oprește MediaRecorder — va declanșa onstop → _onRecordingComplete
    if (this._mediaRecorder && this._mediaRecorder.state === 'recording') {
      this._mediaRecorder.stop();
    }

    // Oprește Speech Recognition
    this._stopSpeechRecognition();

    this._isRecording = false;
  }

  /**
   * Cleanup complet — apelat la navigarea între pagini.
   * Eliberează AudioContext, stream-uri, și listeners.
   */
  destroy() {
    this.stop();

    if (this._audioContext && this._audioContext.state !== 'closed') {
      this._audioContext.close().catch(() => {});
    }

    if (this._animFrameId) {
      cancelAnimationFrame(this._animFrameId);
      this._animFrameId = null;
    }

    if (this._sttAbortController) {
      this._sttAbortController.abort();
    }

    this._audioContext = null;
    this._analyser = null;
    this._mediaStream = null;
    this._mediaRecorder = null;
    this._recognition = null;
  }

  /**
   * Returnează metricile prozodice calculate după stop().
   * Apelat de riskIntegration după _onRecordingComplete.
   */
  getProsodyMetrics() {
    const { pitchSamples, energySamples, silenceSamples, totalSamples } = this._prosody;

    const avgPitch = pitchSamples.length
      ? pitchSamples.reduce((a, b) => a + b, 0) / pitchSamples.length
      : 0;

    const avgEnergy = energySamples.length
      ? energySamples.reduce((a, b) => a + b, 0) / energySamples.length
      : 0;

    const pauseRatio = silenceSamples / Math.max(1, totalSamples);

    let pitchVar = 0;
    if (pitchSamples.length > 1) {
      const variance = pitchSamples.reduce((acc, p) => acc + (p - avgPitch) ** 2, 0) / pitchSamples.length;
      pitchVar = Math.sqrt(variance);
    }

    return { avgPitch, avgEnergy, pauseRatio, pitchVar };
  }

  get isRecording() {
    return this._isRecording;
  }

  get lastTranscript() {
    return this._lastTranscript;
  }

  // ── Private ─────────────────────────────────────────────

  _onRecordingComplete() {
    const prosody = this.getProsodyMetrics();
    const transcript = this._lastTranscript;

    eventBus.emit(EVENTS.SESSION_END, {
      prosody,
      transcript,
      duration: (Date.now() - this._recordingStartTime) / 1_000,
    });
  }

  _startSpeechRecognition() {
    // Feature detection — degradare grațioasă dacă browserul nu suportă
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      // STT nu e disponibil — continuăm cu prosody only
      // crisisDetection va primi string gol și va folosi doar semnalele prozodice
      console.info('[AudioService] SpeechRecognition not available. Prosody-only mode.');
      return;
    }

    this._recognition = new SpeechRecognition();
    this._recognition.continuous = true;      // Nu se oprește după o pauză
    this._recognition.interimResults = true;  // Rezultate parțiale în timp real
    this._recognition.lang = this._detectLang(); // Limba curentă din voxenLang()

    // Acumulăm transcrierea finală (nu cea parțială)
    let finalTranscript = '';

    this._recognition.onresult = (event) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript + ' ';
        } else {
          interim += result[0].transcript;
        }
      }
      this._lastTranscript = (finalTranscript + interim).trim();

      // Emitem textul curent pentru analiză în timp real
      // (riskIntegration poate face analiză parțială fără să aștepte end)
      eventBus.emit(EVENTS.STT_RESULT, {
        text: this._lastTranscript,
        isFinal: false,
      });
    };

    this._recognition.onerror = (event) => {
      // 'no-speech' e normal și așteptat
      if (event.error !== 'no-speech') {
        console.warn('[AudioService] STT error:', event.error);
        eventBus.emit(EVENTS.STT_ERROR, { error: event.error });
      }
    };

    this._recognition.onend = () => {
      // SpeechRecognition se poate opri automat (timeout browser)
      // Dacă înregistrarea încă rulează, o repornim
      if (this._isRecording && this._recognition) {
        try {
          this._recognition.start();
        } catch (e) {
          // Ignorăm — poate fi deja pornită
        }
      }
    };

    try {
      this._recognition.start();
      this._recognitionActive = true;
    } catch (e) {
      console.warn('[AudioService] Could not start STT:', e);
    }
  }

  _stopSpeechRecognition() {
    if (this._recognition) {
      try {
        this._recognition.stop();
      } catch (e) { /* ignorăm */ }
      this._recognition = null;
      this._recognitionActive = false;
    }

    // Emitem transcrierea finală
    eventBus.emit(EVENTS.STT_RESULT, {
      text: this._lastTranscript,
      isFinal: true,
    });
  }

  _detectLang() {
    // Preia limba din sistemul de i18n existent
    if (window.voxenLang) {
      const langMap = {
        ro: 'ro-RO', en: 'en-US', fr: 'fr-FR',
        de: 'de-DE', zh: 'zh-CN', ja: 'ja-JP', ru: 'ru-RU',
      };
      return langMap[window.voxenLang()] || 'ro-RO';
    }
    return 'ro-RO';
  }

  _freshProsody() {
    return {
      pitchSamples: [],
      energySamples: [],
      silenceSamples: 0,
      totalSamples: 0,
    };
  }

  /**
   * Detecție pitch prin autocorrelation (Wiener-Khinchin).
   * Același algoritm din companion.html — nu duplicăm logica,
   * ci o centralizam AICI și o scoatem din HTML.
   */
  _detectPitch(buf, sampleRate) {
    const SIZE = buf.length;
    let rms = 0;
    for (let i = 0; i < SIZE; i++) rms += buf[i] * buf[i];
    rms = Math.sqrt(rms / SIZE);
    if (rms < 0.01) return -1;

    let r1 = 0, r2 = SIZE - 1;
    const thres = 0.2;
    for (let i = 0; i < SIZE / 2; i++) if (Math.abs(buf[i]) < thres) { r1 = i; break; }
    for (let i = 1; i < SIZE / 2; i++) if (Math.abs(buf[SIZE - i]) < thres) { r2 = SIZE - i; break; }

    const buf2 = buf.slice(r1, r2);
    const SIZE2 = buf2.length;
    if (SIZE2 < 2) return -1;

    const c = new Array(SIZE2).fill(0);
    for (let i = 0; i < SIZE2; i++)
      for (let j = 0; j < SIZE2 - i; j++)
        c[i] = c[i] + buf2[j] * buf2[j + i];

    let d = 0;
    while (d < SIZE2 - 1 && c[d] > c[d + 1]) d++;

    let maxval = -1, maxpos = -1;
    for (let i = d; i < SIZE2; i++) {
      if (c[i] > maxval) { maxval = c[i]; maxpos = i; }
    }

    let T0 = maxpos;
    if (T0 <= 0) return -1;

    const x1 = c[T0 - 1] || 0, x2 = c[T0], x3 = c[T0 + 1] || 0;
    const a = (x1 + x3 - 2 * x2) / 2;
    const b = (x3 - x1) / 2;
    if (a) T0 = T0 - b / (2 * a);

    return sampleRate / T0;
  }
}

// Singleton
export const audioService = new AudioService();
