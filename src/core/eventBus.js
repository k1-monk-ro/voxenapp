/**
 * VOXEN — EVENT BUS
 * ═══════════════════════════════════════════════════════════
 * Pub/sub simplu pentru comunicare între module fără coupling direct.
 *
 * DE CE EVENT BUS și nu apeluri directe?
 * crisisService nu trebuie să știe că există un UI.
 * companion.js nu trebuie să știe că există un riskEngine.
 * Fiecare modul emite și ascultă — nu depinde de altul.
 *
 * Rezultat: poți testa crisisService izolat, fără să montezi UI.
 * Poți adăuga analytics fără să modifici companion.js.
 * Poți scoate un modul fără să spargi altul.
 *
 * EVENIMENTELE DEFINITE:
 *   CRISIS_DETECTED  — orice nivel de criză detectat
 *   CRISIS_IMMINENT  — iminență: UI se lockează, 112 e afișat
 *   CRISIS_RESOLVED  — sesiunea a fost deblocată manual
 *   SESSION_START    — utilizatorul a apăsat record
 *   SESSION_END      — înregistrarea s-a oprit
 *   EMOTION_DETECTED — emoție normală (non-criză) detectată
 *   STT_RESULT       — text transcris disponibil
 *   STT_ERROR        — eroare transcripție
 *   PROSODY_UPDATE   — metrici prozodice live (fiecare 100ms)
 * ═══════════════════════════════════════════════════════════
 */

class EventBus {
  constructor() {
    // Map<eventName, Set<handler>>
    this._listeners = new Map();
    // Istoric recent pentru debugging (ultimele 50 de evenimente)
    this._history = [];
    this._maxHistory = 50;
  }

  /**
   * Abonează un handler la un eveniment.
   * Returnează funcția de dezabonare (apeleaz-o pentru cleanup).
   *
   * @param {string} event - numele evenimentului
   * @param {function} handler - funcția apelată la emit
   * @returns {function} unsubscribe
   */
  on(event, handler) {
    if (!this._listeners.has(event)) {
      this._listeners.set(event, new Set());
    }
    this._listeners.get(event).add(handler);

    // Returnează funcția de cleanup — esențial pentru a evita memory leaks
    return () => this.off(event, handler);
  }

  /**
   * Dezabonează un handler.
   */
  off(event, handler) {
    const handlers = this._listeners.get(event);
    if (handlers) handlers.delete(handler);
  }

  /**
   * Emite un eveniment cu un payload.
   * Toți listenerii sunt apelați sincron, în ordinea abonării.
   * Erorile dintr-un listener nu blochează ceilalți.
   *
   * @param {string} event
   * @param {any} payload
   */
  emit(event, payload = null) {
    // Log în history pentru debugging
    this._history.push({ event, payload, timestamp: Date.now() });
    if (this._history.length > this._maxHistory) {
      this._history.shift();
    }

    const handlers = this._listeners.get(event);
    if (!handlers || handlers.size === 0) return;

    handlers.forEach(handler => {
      try {
        handler(payload);
      } catch (err) {
        // Un handler spart nu oprește ceilalți
        console.error(`[EventBus] Handler error for "${event}":`, err);
      }
    });
  }

  /**
   * Abonare one-shot: se dezabonează automat după primul emit.
   */
  once(event, handler) {
    const wrapper = (payload) => {
      handler(payload);
      this.off(event, wrapper);
    };
    return this.on(event, wrapper);
  }

  /**
   * Șterge toți listenerii pentru un eveniment.
   * Util la navigarea între pagini.
   */
  clear(event) {
    if (event) {
      this._listeners.delete(event);
    } else {
      this._listeners.clear();
    }
  }

  /**
   * Returnează istoricul recent — util în DevTools sau pentru crash reports.
   */
  getHistory() {
    return [...this._history];
  }
}

// Singleton — un singur bus pentru toată aplicația
export const eventBus = new EventBus();

// Definim constantele de evenimente pentru a evita typo-uri
export const EVENTS = {
  CRISIS_DETECTED: 'CRISIS_DETECTED',
  CRISIS_IMMINENT: 'CRISIS_IMMINENT',
  CRISIS_RESOLVED: 'CRISIS_RESOLVED',
  SESSION_START: 'SESSION_START',
  SESSION_END: 'SESSION_END',
  EMOTION_DETECTED: 'EMOTION_DETECTED',
  STT_RESULT: 'STT_RESULT',
  STT_ERROR: 'STT_ERROR',
  PROSODY_UPDATE: 'PROSODY_UPDATE',
};
