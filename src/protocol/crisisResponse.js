/**
 * VOXEN — RĂSPUNSURI DE CRIZĂ (Stratul 2)
 * ═══════════════════════════════════════════════════════════
 * Ce spune Voxen exact în momentul de criză.
 *
 * PRINCIPII DE REDACTARE — fiecare mesaj respectă:
 *  1. Validează emoția, nu o minimaliza ("o să treacă" = INTERZIS)
 *  2. Nu da sfaturi ("ai încercat să..." = INTERZIS)
 *  3. Nu face pe terapeutul — Voxen nu vindecă, conectează
 *  4. Nu promite confidențialitate absolută în iminență
 *  5. Predă ștafeta unui OM real cât mai repede
 *  6. Limbaj cald, scurt, fără jargon, fără exclamații
 *  7. Nu întreabă "ai un plan?" — asta e treaba unui profesionist
 *
 * Aceste texte TREBUIE validate de un psiholog clinician.
 * ═══════════════════════════════════════════════════════════
 */

const CRISIS_RESPONSES = {
  ro: {

    // ── NIVEL 3 — IMINENȚĂ ──────────────────────────────────
    // Plan/intenție/mijloace. Voxen oprește orice altceva.
    imminent: {
      title: 'Vreau să te ajut chiar acum.',
      body: [
        'Ceea ce simți e foarte greu și mă bucur că ai spus-o cu voce tare.',
        'Acum e momentul să vorbești cu un om, nu cu o aplicație.',
        'Te rog sună la 112 — acolo sunt oameni pregătiți care pot ajunge la tine.',
        'Dacă poți, rămâi lângă cineva de încredere până vorbești cu ei.',
      ],
      primaryAction: { type: 'call', number: '112', label: 'Sună la 112 acum' },
      secondaryAction: { type: 'call', number: '0800 801 200', label: 'TelVerde Antisuicid' },
      // Voxen NU continuă conversația normal după acest mesaj.
      lockConversation: true,
    },

    // ── NIVEL 2 — IDEAȚIE ───────────────────────────────────
    // Gânduri de moarte fără plan. Grijă + resurse + om real.
    ideation: {
      title: 'Te aud. Și nu te las singur cu asta.',
      body: [
        'Gândurile astea sunt grele și nu trebuie să le duci de unul singur.',
        'Nu sunt terapeut și nu pot ține locul unui om real — dar pot să te conectez cu unul.',
        'Există oameni care ascultă exact ce simți acum, fără să te judece.',
      ],
      // Acțiunile se completează dinamic în funcție de orar (vezi buildCrisisCard)
      primaryAction: 'dynamic_suicide_line',
      secondaryAction: { type: 'call', number: '112', label: 'Urgență 112' },
      lockConversation: false,
    },

    // ── NIVEL 1 — SUFERINȚĂ ACUTĂ ───────────────────────────
    // Disperare fără referire la moarte. Verificare blândă.
    distress: {
      title: 'Pare că treci prin ceva foarte greu acum.',
      body: [
        'Îmi pare rău că e atât de apăsător. Ce simți contează.',
        'Dacă vrei, poți vorbi cu cineva care te poate sprijini mai mult decât pot eu.',
        'Nu trebuie să fii bine chiar acum. E în regulă să ceri ajutor.',
      ],
      primaryAction: 'dynamic_suicide_line',
      secondaryAction: { type: 'dismiss', label: 'Continuă să vorbești cu Voxen' },
      lockConversation: false,
    },

    // ── RECĂDERE ÎN DEPENDENȚĂ (caz special) ────────────────
    // Detectat din lexicon distress: "am recăzut", "am băut iar"
    relapse: {
      title: 'O recădere nu șterge tot drumul tău.',
      body: [
        'Recăderea face parte din recuperare pentru mulți oameni — nu e un eșec final.',
        'Important e ce faci în următoarea oră, nu ce s-a întâmplat.',
        'Dacă ai un terapeut sau un grup, acum e momentul să-i contactezi.',
      ],
      primaryAction: { type: 'navigate', target: 'recovery', label: 'Deschide instrumentele de recuperare' },
      secondaryAction: { type: 'navigate', target: 'groups', label: 'Vorbește cu grupul tău' },
      lockConversation: false,
    },
  },
};

// ───────────────────────────────────────────────────────────
// CONSTRUIEȘTE CARDUL DE CRIZĂ
// Combină răspunsul cu resursele, ținând cont de orar.
// ───────────────────────────────────────────────────────────

/**
 * @param {string} level - 'imminent' | 'ideation' | 'distress' | 'relapse'
 * @param {function} isLineOpen - funcția isSuicideLineOpen din crisisDetection
 * @param {object} resources - CRISIS_RESOURCES.ro
 * @returns {object} card complet gata de afișat
 */
function buildCrisisCard(level, isLineOpen, resources) {
  const tpl = CRISIS_RESPONSES.ro[level];
  if (!tpl) return null;

  const card = {
    level,
    title: tpl.title,
    body: [...tpl.body],
    actions: [],
    lockConversation: tpl.lockConversation,
  };

  // Acțiune primară
  if (tpl.primaryAction === 'dynamic_suicide_line') {
    const line = resources.suicide_line;
    if (isLineOpen()) {
      card.actions.push({
        type: 'call', number: line.number,
        label: 'Sună la TelVerde Antisuicid',
        note: line.note,
        primary: true,
      });
    } else {
      // În afara programului — email + mesaj de însoțire
      card.actions.push({
        type: 'email', address: line.email,
        label: 'Scrie la TelVerde Antisuicid',
        note: 'Linia telefonică e deschisă Vi–Du, 19:00–07:00. Acum poți scrie un email — primești răspuns în maximum 24h.',
        primary: true,
      });
      // Adăugăm o frază de însoțire în body
      card.body.push('Linia telefonică e deschisă în weekend seara. Până atunci, poți scrie un email sau, dacă e urgent, suna la 112.');
    }
  } else if (typeof tpl.primaryAction === 'object') {
    card.actions.push({ ...tpl.primaryAction, primary: true });
  }

  // Acțiune secundară
  if (typeof tpl.secondaryAction === 'object') {
    card.actions.push({ ...tpl.secondaryAction, primary: false });
  }

  // 112 este ÎNTOTDEAUNA disponibil ca opțiune de urgență,
  // dacă nu e deja în listă
  const has112 = card.actions.some(a => a.number === '112');
  if (!has112 && level !== 'relapse') {
    card.actions.push({
      type: 'call', number: '112',
      label: 'Urgență 112', primary: false,
    });
  }

  return card;
}

// ───────────────────────────────────────────────────────────
// EXPORT
// ───────────────────────────────────────────────────────────

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CRISIS_RESPONSES, buildCrisisCard };
}
