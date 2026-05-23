/**
 * VOXEN — RISK ENGINE
 * ═══════════════════════════════════════════════════════════
 * Calculează scorul de risc cumulativ pe sesiune.
 *
 * RESPONSABILITATE UNICĂ: primește rezultate individuale de
 * detecție și returnează trendul agregat. Nu detectează nimic
 * singur — detectCrisis() face asta. Nu afișează nimic —
 * riskIntegration.js face asta.
 *
 * De ce decay temporal?
 * Un utilizator care a spus "nu mai pot" acum 25 de minute
 * și apoi a vorbit normal timp de 20 de minute se află
 * în alt pattern față de unul care escaladează constant.
 * Decay-ul diferențiază aceste două scenarii.
 *
 * REGULĂ: o singură instanță per sesiune (gestionat de
 * riskIntegration.js ca singleton).
 * ═══════════════════════════════════════════════════════════
 */

// Ponderile per nivel de severitate
const LEVEL_WEIGHTS = {
  imminent: 100,
  ideation: 60,
  distress: 25,
  none: 0,
};

// Praguri pentru escaladare automată din trend
const THRESHOLDS = {
  // Scor brut care forțează escaladare indiferent de trend
  ABSOLUTE_ESCALATION: 80,
  // Scor moderat + trend prost = escaladare
  TREND_ESCALATION_SCORE: 40,
  // Câte evenimente consecutive de non-none sunt "îngrijorătoare"
  CONSECUTIVE_CONCERN: 3,
};

// Factor de decay per minut (0.85 = un eveniment pierde 15% din greutate pe minut)
const DECAY_PER_MINUTE = 0.85;

export class RiskEngine {
  constructor() {
    // Fiecare eveniment: { weight, timestamp, level, source }
    this._events = [];
    // Cache pentru ultimul score calculat (evităm recalcul dacă nu s-a adăugat nimic)
    this._lastScore = null;
    this._dirty = false;
  }

  /**
   * Înregistrează un nou rezultat de detecție și returnează scorul curent.
   *
   * @param {object} detectionResult - { level, matched, source } din detectCrisis()
   * @param {number} timestamp - ms epoch (default: Date.now())
   * @returns {object} { score, trend, shouldEscalate, consecutiveConcern }
   */
  update(detectionResult, timestamp = Date.now()) {
    const weight = LEVEL_WEIGHTS[detectionResult.level] ?? 0;

    this._events.push({
      weight,
      timestamp,
      level: detectionResult.level,
      source: detectionResult.source,
    });

    this._dirty = true;
    return this.currentScore();
  }

  /**
   * Calculează și returnează scorul curent fără adăuga un eveniment nou.
   * Folosit pentru polling sau debugging.
   *
   * @returns {object} { score, trend, shouldEscalate, consecutiveConcern, eventCount }
   */
  currentScore() {
    // Short-circuit dacă nimic nu s-a schimbat și nu e nevoie de recalcul temporal
    // (în practică, decay-ul e temporal deci trebuie recalculat mereu, dar costul e mic)

    if (this._events.length === 0) {
      return this._emptyScore();
    }

    const now = Date.now();
    let totalScore = 0;

    for (const ev of this._events) {
      const ageMinutes = (now - ev.timestamp) / 60_000;
      // Decay exponențial: weight * factor^age_minutes
      const decayed = ev.weight * Math.pow(DECAY_PER_MINUTE, ageMinutes);
      totalScore += decayed;
    }

    totalScore = Math.round(totalScore);

    // Trend: compară media primei jumătăți cu media celei de-a doua
    const trend = this._computeTrend();

    // Evenimente consecutive îngrijorătoare (ultimele N care nu sunt 'none')
    const consecutiveConcern = this._consecutiveConcern();

    // Logica de escaladare
    const shouldEscalate =
      totalScore >= THRESHOLDS.ABSOLUTE_ESCALATION ||
      (trend === 'escalating' && totalScore >= THRESHOLDS.TREND_ESCALATION_SCORE) ||
      consecutiveConcern >= THRESHOLDS.CONSECUTIVE_CONCERN;

    return {
      score: totalScore,
      trend,
      shouldEscalate,
      consecutiveConcern,
      eventCount: this._events.length,
    };
  }

  /**
   * Resetează toate evenimentele (la sfârșitul sesiunii sau după un unlock manual).
   */
  reset() {
    this._events = [];
    this._lastScore = null;
    this._dirty = false;
  }

  /**
   * Returnează istoricul evenimentelor pentru debugging și logging.
   * Nu include date personale — doar niveluri și timestamps.
   */
  exportHistory() {
    return this._events.map(ev => ({
      level: ev.level,
      source: ev.source,
      timestamp: ev.timestamp,
    }));
  }

  // ── Private ─────────────────────────────────────────────

  _emptyScore() {
    return {
      score: 0,
      trend: 'stable',
      shouldEscalate: false,
      consecutiveConcern: 0,
      eventCount: 0,
    };
  }

  _computeTrend() {
    const n = this._events.length;
    if (n < 4) return 'stable'; // Prea puține date pentru trend

    const mid = Math.floor(n / 2);
    const first = this._events.slice(0, mid);
    const second = this._events.slice(mid);

    const avg = arr => arr.reduce((s, e) => s + e.weight, 0) / arr.length;
    const avgFirst = avg(first);
    const avgSecond = avg(second);

    // Threshold de 10% pentru a evita noise
    if (avgSecond > avgFirst * 1.1) return 'escalating';
    if (avgSecond < avgFirst * 0.9) return 'improving';
    return 'stable';
  }

  _consecutiveConcern() {
    let count = 0;
    // Numărăm de la sfârșit spre început
    for (let i = this._events.length - 1; i >= 0; i--) {
      if (this._events[i].level !== 'none') {
        count++;
      } else {
        break; // Întrerupem la primul 'none'
      }
    }
    return count;
  }
}
