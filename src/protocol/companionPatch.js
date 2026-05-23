/**
 * VOXEN COMPANION — INTEGRATION PATCH
 * ═══════════════════════════════════════════════════════════
 * Acest fișier conține EXACT ce trebuie adăugat/modificat
 * în voxen-companion.html pentru a integra sistemul de criză.
 *
 * INSTRUCȚIUNI DE APLICARE:
 *
 * 1. Adaugă IMEDIAT DUPĂ <body> (primul lucru în body):
 *    → Blocul: CRISIS OVERLAY HTML
 *
 * 2. La SFÂRȘITUL blocului <script> existent, ÎNAINTEA </script>:
 *    → Blocul: CRISIS INTEGRATION SCRIPT
 *
 * 3. MODIFICĂ funcția analyzeRecording():
 *    → Înlocuiește ultimele două linii cu versiunea din patch
 *
 * 4. MODIFICĂ funcția startListening():
 *    → Înlocuiește blocul mediaRecorder.onstop cu versiunea din patch
 *
 * IMPORTANT: Nu șterge codul existent — adaugă și modifică.
 * EMOS_DATA, detectPitch, triggerResponse etc. rămân pentru demo mode.
 * ═══════════════════════════════════════════════════════════
 */


// ════════════════════════════════════════════════════════════
// PASUL 1: CRISIS OVERLAY HTML
// Adaugă IMEDIAT DUPĂ <body> în companion.html
// ════════════════════════════════════════════════════════════

/*
<!-- CRISIS OVERLAY — injectată de riskIntegration, ascunsă implicit -->
<div id="crisisOverlay" class="crisis-overlay" aria-live="assertive" aria-atomic="true" role="alert" style="display:none">
  <div class="crisis-panel" id="crisisPanel">
    <div class="crisis-icon" id="crisisIcon">🔴</div>
    <h2 class="crisis-title" id="crisisTitle"></h2>
    <div class="crisis-body" id="crisisBody"></div>
    <div class="crisis-actions" id="crisisActions"></div>
    <button class="crisis-dismiss" id="crisisDismiss" style="display:none" onclick="dismissCrisis()">
      Continuă să vorbești cu Voxen
    </button>
  </div>
</div>
*/


// ════════════════════════════════════════════════════════════
// PASUL 1b: CSS PENTRU CRISIS OVERLAY
// Adaugă în blocul <style> existent
// ════════════════════════════════════════════════════════════

/*
.crisis-overlay {
  position: fixed;
  inset: 0;
  background: rgba(13, 11, 26, 0.92);
  backdrop-filter: blur(8px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  animation: crisisIn 0.3s ease;
}

@keyframes crisisIn {
  from { opacity: 0; transform: scale(0.96); }
  to   { opacity: 1; transform: scale(1); }
}

.crisis-panel {
  background: var(--surface);
  border-radius: 24px;
  padding: 32px 28px;
  max-width: 440px;
  width: 100%;
  border: 1px solid rgba(212, 83, 126, 0.4);
  box-shadow: 0 0 60px rgba(212, 83, 126, 0.15);
}

.crisis-panel.imminent {
  border-color: rgba(212, 83, 126, 0.8);
  box-shadow: 0 0 80px rgba(212, 83, 126, 0.3);
}

.crisis-icon {
  font-size: 40px;
  margin-bottom: 16px;
  animation: crisisPulse 1.5s ease-in-out infinite;
}

@keyframes crisisPulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

.crisis-title {
  font-family: 'Instrument Serif', Georgia, serif;
  font-size: 24px;
  font-weight: 400;
  color: var(--white);
  margin-bottom: 16px;
  line-height: 1.3;
}

.crisis-body {
  font-size: 15px;
  color: var(--soft);
  line-height: 1.7;
  margin-bottom: 24px;
}

.crisis-body p {
  margin-bottom: 10px;
}

.crisis-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 16px;
}

.crisis-action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 14px 20px;
  border-radius: 14px;
  font-family: 'Syne', sans-serif;
  font-size: 15px;
  font-weight: 700;
  text-decoration: none;
  transition: all 0.2s;
  border: none;
  cursor: pointer;
}

.crisis-action-btn.primary {
  background: var(--warm);
  color: #fff;
}

.crisis-action-btn.primary:hover {
  background: #c03d6a;
  transform: scale(1.02);
}

.crisis-action-btn.secondary {
  background: rgba(255, 255, 255, 0.06);
  color: var(--soft);
  border: 0.5px solid var(--border);
}

.crisis-action-btn.secondary:hover {
  background: rgba(255, 255, 255, 0.1);
}

.crisis-dismiss {
  width: 100%;
  background: transparent;
  border: none;
  color: var(--text2);
  font-family: 'Syne', sans-serif;
  font-size: 13px;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: color 0.2s;
}

.crisis-dismiss:hover {
  color: var(--soft);
}
*/


// ════════════════════════════════════════════════════════════
// PASUL 2: CRISIS INTEGRATION SCRIPT
// Adaugă la SFÂRȘITUL blocului <script> din companion.html
// ÎNAINTEA ultimului tag </script>
// ════════════════════════════════════════════════════════════

// ──────────────────────────────────────────────────────────
// CRISIS DETECTION INTEGRATION
// Integrarea crisisDetection + crisisResponse + riskEngine
// direct în pagină, fără ES Modules (compatibil cu HTML static)
// ──────────────────────────────────────────────────────────

// ── Copiem modulele inline (până la migrarea la ES Modules) ──
// În producție, acestea vor fi importate din /src/protocol/

// ── CRISIS LEXICON (din crisisDetection.js) ──
const CRISIS_LEXICON = {
  imminent: {
    ro: [
      'vreau să mor', 'vreau sa mor',
      'o să mă sinucid', 'o sa ma sinucid', 'mă sinucid', 'ma sinucid',
      'o să mă omor', 'o sa ma omor', 'mă omor', 'ma omor',
      'îmi pun capăt', 'imi pun capat', 'să-mi pun capăt', 'sa-mi pun capat',
      'mi-am luat pastilele', 'am luat pastile',
      'am un plan', 'știu cum o fac', 'stiu cum o fac',
      'asta e ultima', 'la noapte o fac', 'azi o fac',
      'mi-am scris biletul', 'mi-am luat rămas bun', 'mi-am luat ramas bun',
      'nu mai apuc', 'e ultima oară când', 'e ultima oara cand',
    ],
  },
  ideation: {
    ro: [
      'nu mai vreau să trăiesc', 'nu mai vreau sa traiesc',
      'mai bine aș muri', 'mai bine as muri', 'mai bine muream',
      'aș vrea să dispar', 'as vrea sa dispar', 'vreau să dispar', 'vreau sa dispar',
      'nu mai are rost', 'nimic nu mai are rost',
      'lumea ar fi mai bună fără mine', 'lumea ar fi mai buna fara mine',
      'toți ar fi mai bine fără mine', 'toti ar fi mai bine fara mine',
      'sunt o povară', 'sunt o povara',
      'nu mai pot continua', 'nu mai pot să continui', 'nu mai pot sa continui',
      'mă gândesc la moarte', 'ma gandesc la moarte',
      'gânduri negre', 'ganduri negre',
      'nu mai văd nicio ieșire', 'nu mai vad nicio iesire',
      'aș vrea să nu mă mai trezesc', 'as vrea sa nu ma mai trezesc',
      'mi-e silă de viață', 'mi-e sila de viata',
      'nu merită', 'nu mai merita nimic',
    ],
  },
  distress: {
    ro: [
      'nu mai suport', 'nu mai pot',
      'sunt la capătul puterilor', 'sunt la capatul puterilor',
      'm-am săturat de tot', 'm-am saturat de tot',
      'nimănui nu-i pasă', 'nimanui nu-i pasa',
      'sunt complet singur', 'sunt complet singura',
      'mă simt fără speranță', 'ma simt fara speranta',
      'nu mai am putere', 'sunt epuizat de tot',
      'mă prăbușesc', 'ma prabusesc',
      'totul e negru', 'nu văd nicio lumină', 'nu vad nicio lumina',
      'am cedat', 'nu mai rezist',
      'am recăzut', 'am recazut', 'am băut iar', 'am baut iar',
      'am consumat din nou', 'am pierdut tot progresul',
    ],
  },
};

const CRISIS_RESOURCES_RO = {
  emergency: { number: '112', label: 'Numărul unic de urgență' },
  suicide_line: {
    number: '0800 801 200',
    label: 'TelVerde Antisuicid',
    email: 'sos@antisuicid.ro',
    schedule: { days: [5, 6, 0], startHour: 19, endHour: 7 },
  },
};

// ── FUNCȚII DIN crisisDetection.js ──
function vxDetectCrisis(text, prosody) {
  if (!text || typeof text !== 'string') {
    // Fallback pe prozodie
    if (prosody && prosody.energy < 0.015 && prosody.pauseRatio > 0.65) {
      return { level: 'distress', matched: [], source: 'prosody' };
    }
    return { level: 'none', matched: [], source: 'empty' };
  }

  const normalized = text.toLowerCase().trim();

  for (const level of ['imminent', 'ideation', 'distress']) {
    const phrases = CRISIS_LEXICON[level].ro;
    const matched = phrases.filter(p => normalized.includes(p));
    if (matched.length > 0) {
      return { level, matched, source: 'text' };
    }
  }

  if (prosody && prosody.energy < 0.015 && prosody.pauseRatio > 0.65) {
    return { level: 'distress', matched: [], source: 'prosody' };
  }

  return { level: 'none', matched: [], source: 'none' };
}

function vxIsSuicideLineOpen() {
  const now = new Date();
  const day = now.getDay();
  const hour = now.getHours();
  const sched = CRISIS_RESOURCES_RO.suicide_line.schedule;
  const isEveningDay = sched.days.includes(day) && hour >= sched.startHour;
  const prevDay = (day + 6) % 7;
  const isMorningAfter = sched.days.includes(prevDay) && hour < sched.endHour;
  return isEveningDay || isMorningAfter;
}

// ── RISK ENGINE (inline simplificat) ──
const VxRiskEngine = {
  _events: [],
  _weights: { imminent: 100, ideation: 60, distress: 25, none: 0 },
  _decay: 0.85,

  update(detection) {
    const weight = this._weights[detection.level] || 0;
    this._events.push({ weight, timestamp: Date.now(), level: detection.level });
    return this._score();
  },

  _score() {
    const now = Date.now();
    let total = 0;
    for (const ev of this._events) {
      const ageMin = (now - ev.timestamp) / 60_000;
      total += ev.weight * Math.pow(this._decay, ageMin);
    }
    total = Math.round(total);

    const n = this._events.length;
    let trend = 'stable';
    if (n >= 4) {
      const mid = Math.floor(n / 2);
      const avgF = this._events.slice(0, mid).reduce((s, e) => s + e.weight, 0) / mid;
      const avgS = this._events.slice(mid).reduce((s, e) => s + e.weight, 0) / (n - mid);
      if (avgS > avgF * 1.1) trend = 'escalating';
      else if (avgS < avgF * 0.9) trend = 'improving';
    }

    let consecutive = 0;
    for (let i = this._events.length - 1; i >= 0; i--) {
      if (this._events[i].level !== 'none') consecutive++;
      else break;
    }

    const shouldEscalate =
      total >= 80 ||
      (trend === 'escalating' && total >= 40) ||
      consecutive >= 3;

    return { score: total, trend, shouldEscalate, consecutive };
  },

  reset() { this._events = []; },
};

// ── CRISIS OVERLAY CONTROLLER ──
let _crisisLocked = false;
let _lastCrisisEmit = 0;
let _sttTranscript = '';

// Speech Recognition setup
function vxInitSTT() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) {
    console.info('[Voxen] STT not available — prosody-only mode');
    return null;
  }

  const rec = new SR();
  rec.continuous = true;
  rec.interimResults = true;

  const langMap = { ro:'ro-RO', en:'en-US', fr:'fr-FR', de:'de-DE', zh:'zh-CN', ja:'ja-JP', ru:'ru-RU' };
  rec.lang = langMap[window.voxenLang ? window.voxenLang() : 'ro'] || 'ro-RO';

  let finalText = '';
  rec.onresult = (event) => {
    let interim = '';
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const r = event.results[i];
      if (r.isFinal) finalText += r[0].transcript + ' ';
      else interim += r[0].transcript;
    }
    _sttTranscript = (finalText + interim).trim();

    // Analiză în timp real pe text parțial (nu așteptăm sfârșitul)
    vxAnalyzeCrisis(_sttTranscript, null);
  };

  rec.onerror = (e) => {
    if (e.error !== 'no-speech') console.warn('[Voxen STT]', e.error);
  };

  // Auto-restart dacă se oprește (browser timeout)
  rec.onend = () => {
    if (window._vxRecording && !_crisisLocked) {
      try { rec.start(); } catch(e) {}
    }
  };

  return rec;
}

// ── ANALIZA CRIZĂ — apelată după fiecare chunk de text STT ──
function vxAnalyzeCrisis(text, prosodyOverride) {
  if (_crisisLocked) return;

  const prosody = prosodyOverride || {
    energy: prosodyData ? (prosodyData.energySamples.slice(-5).reduce((a,b)=>a+b,0)/5 || 0) : 0,
    pauseRatio: prosodyData ? (prosodyData.silenceSamples / Math.max(1, prosodyData.totalSamples)) : 0,
  };

  const detection = vxDetectCrisis(text, prosody);

  // Risk engine update
  const risk = VxRiskEngine.update(detection);

  // Escaladare din trend fără trigger textual explicit
  if (risk.shouldEscalate && detection.level === 'none') {
    detection.level = 'distress';
    detection.source = 'risk_engine';
  }

  if (detection.level === 'none') return;

  // Throttle: același nivel nu mai des de 5s (excepție: imminent)
  const now = Date.now();
  if (detection.level !== 'imminent' && (now - _lastCrisisEmit) < 5000) return;
  _lastCrisisEmit = now;

  // Afișează overlay
  vxShowCrisisOverlay(detection.level, risk);

  // Lock dacă iminent
  if (detection.level === 'imminent') {
    _crisisLocked = true;
    vxLockCompanionUI();
    vxLogCrisisEvent(detection.level, risk);
  }
}

// ── AFIȘARE OVERLAY ──
function vxShowCrisisOverlay(level, risk) {
  const overlay = document.getElementById('crisisOverlay');
  if (!overlay) return;

  const panel = document.getElementById('crisisPanel');
  const icon = document.getElementById('crisisIcon');
  const title = document.getElementById('crisisTitle');
  const body = document.getElementById('crisisBody');
  const actions = document.getElementById('crisisActions');
  const dismiss = document.getElementById('crisisDismiss');

  // Configurare per nivel
  const configs = {
    imminent: {
      icon: '🆘',
      title: 'Vreau să te ajut chiar acum.',
      body: [
        'Ceea ce simți e foarte greu și mă bucur că ai spus-o cu voce tare.',
        'Acum e momentul să vorbești cu un om, nu cu o aplicație.',
        'Te rog sună la 112 — acolo sunt oameni pregătiți care pot ajunge la tine.',
        'Dacă poți, rămâi lângă cineva de încredere până vorbești cu ei.',
      ],
      actions: [
        { type: 'call', number: '112', label: '🆘 Sună la 112 acum', primary: true },
        { type: 'call', number: '0800 801 200', label: 'TelVerde Antisuicid', primary: false },
      ],
      showDismiss: false,
      panelClass: 'imminent',
    },
    ideation: {
      icon: '💜',
      title: 'Te aud. Și nu te las singur cu asta.',
      body: [
        'Gândurile astea sunt grele și nu trebuie să le duci de unul singur.',
        'Nu sunt terapeut și nu pot ține locul unui om real — dar pot să te conectez cu unul.',
        'Există oameni care ascultă exact ce simți acum, fără să te judece.',
      ],
      actions: vxIsSuicideLineOpen()
        ? [
            { type: 'call', number: '0800 801 200', label: 'Sună la TelVerde Antisuicid', primary: true },
            { type: 'call', number: '112', label: 'Urgență 112', primary: false },
          ]
        : [
            { type: 'email', address: 'sos@antisuicid.ro', label: 'Scrie la TelVerde Antisuicid', primary: true, note: 'Răspuns în max. 24h' },
            { type: 'call', number: '112', label: 'Urgență 112', primary: false },
          ],
      showDismiss: true,
      panelClass: '',
    },
    distress: {
      icon: '🤍',
      title: 'Pare că treci prin ceva foarte greu acum.',
      body: [
        'Îmi pare rău că e atât de apăsător. Ce simți contează.',
        'Dacă vrei, poți vorbi cu cineva care te poate sprijini mai mult decât pot eu.',
        'Nu trebuie să fii bine chiar acum. E în regulă să ceri ajutor.',
      ],
      actions: vxIsSuicideLineOpen()
        ? [{ type: 'call', number: '0800 801 200', label: 'Vorbește cu cineva acum', primary: true }]
        : [{ type: 'email', address: 'sos@antisuicid.ro', label: 'Scrie la TelVerde', primary: true }],
      showDismiss: true,
      panelClass: '',
    },
  };

  const cfg = configs[level];
  if (!cfg) return;

  // Setăm conținutul
  panel.className = 'crisis-panel' + (cfg.panelClass ? ' ' + cfg.panelClass : '');
  icon.textContent = cfg.icon;
  title.textContent = cfg.title;
  body.innerHTML = cfg.body.map(p => `<p>${p}</p>`).join('');

  // Butoanele de acțiune
  actions.innerHTML = '';
  cfg.actions.forEach(action => {
    let href, label;
    if (action.type === 'call') {
      href = `tel:${action.number}`;
      label = action.label;
    } else if (action.type === 'email') {
      href = `mailto:${action.address}`;
      label = action.label + (action.note ? ` <span style="font-size:11px;opacity:.7">(${action.note})</span>` : '');
    }

    const btn = document.createElement('a');
    btn.href = href;
    btn.className = `crisis-action-btn ${action.primary ? 'primary' : 'secondary'}`;
    btn.innerHTML = label;
    actions.appendChild(btn);
  });

  // Dismiss button
  dismiss.style.display = cfg.showDismiss ? 'block' : 'none';

  // Afișăm overlay-ul
  overlay.style.display = 'flex';

  // Focus trap — accesibilitate
  overlay.setAttribute('tabindex', '-1');
  setTimeout(() => overlay.focus(), 50);
}

function dismissCrisis() {
  const overlay = document.getElementById('crisisOverlay');
  if (overlay) overlay.style.display = 'none';
}

function vxLockCompanionUI() {
  // Dezactivăm orbul de înregistrare
  const orb = document.getElementById('orbCore');
  if (orb) {
    orb.style.opacity = '0.3';
    orb.style.pointerEvents = 'none';
    orb.textContent = '🔒';
  }

  // Actualizăm starea afișată
  const stateEl = document.getElementById('voiceState');
  if (stateEl) {
    stateEl.textContent = 'Sesiunea e pausată. Voxen e îngrijorat pentru tine.';
    stateEl.style.color = 'var(--warm)';
  }
}

function vxLogCrisisEvent(level, risk) {
  // Log minimal fără date personale
  try {
    console.warn('[VOXEN CRISIS]', JSON.stringify({
      type: 'crisis_event',
      level,
      score: risk.score,
      trend: risk.trend,
      timestamp: Date.now(),
    }));
    // TODO producție: POST la /api/crisis-log (metadata only, fără text)
  } catch(e) {}
}

// ── INTEGRARE ÎN FLUXUL EXISTENT ──
// Variabilă globală pentru a semnala STT că înregistrarea rulează
window._vxRecording = false;
window._vxSpeechRec = null;

// Patch-ul pentru startListening():
// ÎNLOCUIEȘTE blocul:
//   mediaRecorder.onstop = () => {
//     stream.getTracks().forEach(t => t.stop());
//     analyzeRecording();
//   };
// CU:
//   mediaRecorder.onstop = () => {
//     stream.getTracks().forEach(t => t.stop());
//     if (window._vxSpeechRec) { try { window._vxSpeechRec.stop(); } catch(e) {} }
//     window._vxRecording = false;
//     analyzeRecording();
//   };
//
// Și ADAUGĂ după mediaRecorder.start():
//   window._vxRecording = true;
//   window._vxSpeechRec = vxInitSTT();
//   if (window._vxSpeechRec) window._vxSpeechRec.start();

// Patch-ul pentru analyzeRecording():
// ÎNLOCUIEȘTE ultimele două linii:
//   currentEmo = detectedEmotion;
//   triggerResponse();
// CU:
//   currentEmo = detectedEmotion;
//   const prosodyForCrisis = { energy: avgEnergy, pauseRatio };
//   vxAnalyzeCrisis(_sttTranscript, prosodyForCrisis);
//   if (!_crisisLocked) triggerResponse();

// ── INIȚIALIZARE ──
document.addEventListener('DOMContentLoaded', () => {
  // Verificăm că overlay-ul HTML există
  if (!document.getElementById('crisisOverlay')) {
    console.warn('[Voxen] Crisis overlay HTML missing. Add it after <body>.');
  }

  // Resetăm riskEngine la fiecare vizită pe pagină
  VxRiskEngine.reset();
  _crisisLocked = false;
  _sttTranscript = '';
});

// Keyboard: Escape închide overlay-ul dacă nu e locked
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !_crisisLocked) {
    dismissCrisis();
  }
});
