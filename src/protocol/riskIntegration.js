/**
 * VOXEN — RISK INTEGRATION
 * ═══════════════════════════════════════════════════════════
 * Orchestratorul central al sistemului de criză.
 *
 * RESPONSABILITATE: conectează toate modulele și decide
 * ce se întâmplă când e detectată o criză.
 *
 * FLUXUL COMPLET:
 *   audioService → STT → text
 *   audioService → prosody → { energy, pitch, pauseRatio }
 *             ↓
 *   riskIntegration.analyze(text, prosody)
 *             ↓
 *   detectCrisis(text, prosody) → { level, matched, source }
 *             ↓
 *   riskEngine.update(detection) → { score, trend, shouldEscalate }
 *             ↓
 *   buildCrisisCard(level, ...) → card gata de afișat
 *             ↓
 *   eventBus.emit('CRISIS_DETECTED', { detection, risk, card })
 *
 * DE CE SINGLETON?
 * RiskEngine trebuie să acumuleze stare pe toată sesiunea.
 * Un nou obiect la fiecare înregistrare ar reseta totul.
 * Sesiunea se resetează explicit la SESSION_END.
 *
 * REGULĂ DE AUR: dacă ești în dubiu, escaladează.
 * O alarmă falsă e un inconvenient.
 * O criză ratată e o tragedie.
 * ═══════════════════════════════════════════════════════════
 */

import { detectCrisis, isSuicideLineOpen, CRISIS_RESOURCES } from './crisisDetection.js';
import { buildCrisisCard } from './crisisResponse.js';
import { RiskEngine } from './riskEngine.js';
import { eventBus, EVENTS } from '../core/eventBus.js';

class RiskIntegration {
  constructor() {
    this._engine = new RiskEngine();

    // true după detectarea unui nivel 'imminent'.
    // Blochează procesarea ulterioară — nu vrem să suprascriem
    // overlay-ul de urgență cu un răspuns emoțional normal.
    this._sessionLocked = false;

    // Ultimul nivel detectat — pentru logging și debugging
    this._lastLevel = 'none';

    // Scutim de spam: nu emitem CRISIS_DETECTED mai des de o dată la 5s
    // pentru același nivel. Oprește loop-uri accidentale.
    this._lastEmitTimestamp = 0;
    this._lastEmitLevel = 'none';
    this._EMIT_THROTTLE_MS = 5_000;

    // Resetăm engine-ul la sfârșitul sesiunii
    eventBus.on(EVENTS.SESSION_END, () => {
      if (!this._sessionLocked) {
        this._engine.reset();
      }
    });
  }

  /**
   * Entry point principal. Apelat din audioService după
   * fiecare înregistrare completă.
   *
   * @param {string} transcribedText - textul din STT (poate fi '' dacă STT a eșuat)
   * @param {object} prosodyData - { energy: number, pitch: number, pauseRatio: number }
   * @returns {object|null} { detection, risk, card } sau null dacă nu e criză
   */
  analyze(transcribedText, prosodyData = null) {
    // Dacă sesiunea e lockată (imminent activ), nu procesăm nimic.
    // UI-ul va rămâne în starea de urgență până la unlock explicit.
    if (this._sessionLocked) {
      return null;
    }

    // Pas 1: Detectează criza în textul curent + prozodie
    const detection = detectCrisis(transcribedText || '', prosodyData);

    // Pas 2: Actualizează riskEngine cu noul eveniment
    const risk = this._engine.update(detection);

    // Pas 3: Escaladare din trend, chiar dacă textul curent e 'none'
    // (utilizatorul poate fi în distress fără să verbalizeze explicit)
    if (risk.shouldEscalate && detection.level === 'none') {
      detection.level = 'distress';
      detection.source = 'risk_engine_escalation';
      detection.matched = [];
    }

    // Dacă nivelul e 'none' și nu există escaladare, nu facem nimic
    if (detection.level === 'none') {
      this._lastLevel = 'none';
      return null;
    }

    // Pas 4: Throttle — evităm spam de evenimente pentru același nivel
    const now = Date.now();
    const isSameLevel = detection.level === this._lastEmitLevel;
    const isRecent = (now - this._lastEmitTimestamp) < this._EMIT_THROTTLE_MS;

    // Excepție: 'imminent' NU e throttled niciodată — e prea important
    if (isSameLevel && isRecent && detection.level !== 'imminent') {
      return null;
    }

    // Pas 5: Construiește cardul de criză cu resurse reale
    const card = buildCrisisCard(
      detection.level,
      isSuicideLineOpen,
      CRISIS_RESOURCES.ro
    );

    if (!card) {
      console.error('[RiskIntegration] buildCrisisCard returned null for level:', detection.level);
      return null;
    }

    // Pas 6: Emite pe eventBus — UI-ul ascultă, nu e apelat direct
    const payload = { detection, risk, card };
    eventBus.emit(EVENTS.CRISIS_DETECTED, payload);

    // Pas 7: Dacă e iminent, lockăm sesiunea și emitem eveniment separat
    if (detection.level === 'imminent') {
      this._sessionLocked = true;
      eventBus.emit(EVENTS.CRISIS_IMMINENT, { card });

      // Log minimal pentru audit trail (fără date personale)
      this._logCrisisEvent('imminent', risk);
    }

    // Actualizăm starea internă
    this._lastLevel = detection.level;
    this._lastEmitTimestamp = now;
    this._lastEmitLevel = detection.level;

    return payload;
  }

  /**
   * Deblochează sesiunea după intervenție umană sau la timeout.
   * În producție, aceasta trebuie apelată doar de un operator
   * sau după un flow de confirmare explicit.
   */
  unlockSession() {
    this._sessionLocked = false;
    this._engine.reset();
    this._lastLevel = 'none';
    this._lastEmitLevel = 'none';
    eventBus.emit(EVENTS.CRISIS_RESOLVED, null);
  }

  /**
   * Returnează starea curentă — util pentru debugging și monitoring.
   */
  getStatus() {
    return {
      locked: this._sessionLocked,
      lastLevel: this._lastLevel,
      riskScore: this._engine.currentScore(),
      engineHistory: this._engine.exportHistory(),
    };
  }

  // ── Private ─────────────────────────────────────────────

  /**
   * Log minimal pentru audit trail de criză.
   * NU include textul transcris sau alte date personale.
   * Include doar: nivel, scor, timestamp, și hash anonim de sesiune.
   */
  _logCrisisEvent(level, risk) {
    try {
      const entry = {
        type: 'crisis_event',
        level,
        score: risk.score,
        trend: risk.trend,
        timestamp: Date.now(),
        // Hash anonim — nu e legat de user ID
        sessionHash: this._getSessionHash(),
      };

      // Acum: console.warn pentru vizibilitate în devtools
      // În producție: trimis la un endpoint de logging server-side
      console.warn('[VOXEN CRISIS LOG]', JSON.stringify(entry));

      // TODO (producție): fetch('/api/crisis-log', { method: 'POST', body: JSON.stringify(entry) })
      // endpoint-ul acceptă doar metadata, niciodată textul transcris
    } catch (err) {
      // Logging-ul nu trebuie să spargă fluxul de criză
      console.error('[RiskIntegration] Logging error:', err);
    }
  }

  _getSessionHash() {
    // Hash simplu bazat pe timestamp-ul sesiunii, nu pe date personale
    if (!this._sessionId) {
      this._sessionId = Math.random().toString(36).slice(2, 10);
    }
    return this._sessionId;
  }
}

// Singleton — exportat ca instanță, nu ca clasă
export const riskIntegration = new RiskIntegration();
