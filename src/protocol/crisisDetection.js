/**
 * VOXEN — PROTOCOL DE CRIZĂ
 * ═══════════════════════════════════════════════════════════
 * Modul de siguranță. Componenta #1 a aplicației.
 *
 * Acest modul detectează semnale de criză din transcrierea
 * vocală a utilizatorului și din semnalele prozodice, apoi
 * declanșează răspunsul corespunzător.
 *
 * REGULĂ FUNDAMENTALĂ: în caz de dubiu, escaladează.
 * O alarmă falsă e un inconvenient. O criză ratată e o tragedie.
 *
 * Versiune: 1.0 — România
 * IMPORTANT: acest protocol trebuie validat de un psiholog
 * clinician înainte de lansare. Vezi PROTOCOL_VALIDARE.md
 * ═══════════════════════════════════════════════════════════
 */

// ───────────────────────────────────────────────────────────
// STRATUL 1 — DETECȚIE
// 3 niveluri de gravitate, fiecare cu liste separate.
// ───────────────────────────────────────────────────────────

const CRISIS_LEXICON = {

  // NIVEL 3 — IMINENȚĂ. Plan, intenție, mijloace, timp concret.
  // Acesta declanșează răspunsul maxim + îndemn la 112.
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

  // NIVEL 2 — IDEAȚIE. Gânduri de moarte fără plan concret.
  // Declanșează răspuns de criză + resurse, fără urgență 112 forțată.
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

  // NIVEL 1 — SUFERINȚĂ ACUTĂ. Disperare profundă, fără referire la moarte.
  // Declanșează grijă sporită + verificare blândă + resurse soft.
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

// ───────────────────────────────────────────────────────────
// DETECTOR
// ───────────────────────────────────────────────────────────

/**
 * Analizează textul transcris și returnează nivelul de criză.
 * @param {string} text - transcrierea vocii utilizatorului
 * @param {object} prosody - semnale prozodice opționale {energy, pitch, pauseRatio}
 * @returns {object} {level, matched, source}
 *   level: 'imminent' | 'ideation' | 'distress' | 'none'
 */
function detectCrisis(text, prosody = null) {
  if (!text || typeof text !== 'string') {
    return { level: 'none', matched: [], source: 'empty' };
  }

  // Normalizare: lowercase, eliminăm diacritice duble, păstrăm structura
  const normalized = text.toLowerCase().trim();

  // Verificăm în ordinea gravității — imminent întâi
  for (const level of ['imminent', 'ideation', 'distress']) {
    const phrases = CRISIS_LEXICON[level].ro;
    const matched = phrases.filter(p => normalized.includes(p));
    if (matched.length > 0) {
      return { level, matched, source: 'text' };
    }
  }

  // Semnal prozodic extrem fără text declanșator:
  // energie foarte scăzută + pauze foarte lungi susținute = posibil distress
  // NU declanșăm criză doar din prozodie — doar ridicăm un flag soft.
  if (prosody) {
    if (prosody.energy < 0.015 && prosody.pauseRatio > 0.65) {
      return { level: 'distress', matched: [], source: 'prosody' };
    }
  }

  return { level: 'none', matched: [], source: 'none' };
}

// ───────────────────────────────────────────────────────────
// STRATUL 3 — RESURSE REALE, VERIFICATE (România, 2026)
// Sursă: antisuicid.ro (oficial), confirmate multi-sursă.
// ───────────────────────────────────────────────────────────

const CRISIS_RESOURCES = {
  ro: {
    emergency: {
      number: '112',
      label: 'Numărul unic de urgență',
      note: 'Singurul serviciu abilitat legal să se deplaseze și să intervină. Disponibil non-stop.',
      always: true,
    },
    suicide_line: {
      number: '0800 801 200',
      label: 'TelVerde Antisuicid — Alianța Română de Prevenție a Suicidului',
      note: 'Gratuit, anonim, confidențial. Vineri, Sâmbătă, Duminică, 19:00–07:00.',
      schedule: { days: [5, 6, 0], startHour: 19, endHour: 7 }, // 5=Vi, 6=Sâ, 0=Du
      email: 'sos@antisuicid.ro',
      emailNote: 'Email disponibil 24/7, răspuns în maximum 24 de ore.',
    },
    child_line: {
      number: '119',
      label: 'Linia pentru copil — urgențe psihoemoționale și sociale',
      note: 'Pentru minori în situații de criză, abuz sau neglijență. Non-stop.',
    },
  },
};

/**
 * Verifică dacă linia antisuicid este în program acum.
 * @returns {boolean}
 */
function isSuicideLineOpen() {
  const now = new Date();
  const day = now.getDay();       // 0=Du ... 6=Sâ
  const hour = now.getHours();
  const sched = CRISIS_RESOURCES.ro.suicide_line.schedule;

  // Fereastra: Vi 19:00 → Sâ 07:00, Sâ 19:00 → Du 07:00, Du 19:00 → Lu 07:00
  // Simplificat: ziua e în lista de zile ȘI ora >= 19,
  //   SAU ziua următoare după o zi-program ȘI ora < 7
  const isEveningDay = sched.days.includes(day) && hour >= sched.startHour;
  const prevDay = (day + 6) % 7;
  const isMorningAfter = sched.days.includes(prevDay) && hour < sched.endHour;

  return isEveningDay || isMorningAfter;
}

// ───────────────────────────────────────────────────────────
// EXPORT
// ───────────────────────────────────────────────────────────

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    detectCrisis,
    isSuicideLineOpen,
    CRISIS_RESOURCES,
    CRISIS_LEXICON,
  };
}
