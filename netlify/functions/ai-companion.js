// ═══ VOXEN AI COMPANION — Netlify Function ═══
// Proxies user message to Claude API with empathetic system prompt
// API key stored as environment variable (ANTHROPIC_API_KEY)

exports.handler = async (event) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const API_KEY = process.env.ANTHROPIC_API_KEY;
  if (!API_KEY) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'API key not configured' }) };
  }

  try {
    const body = JSON.parse(event.body);
    const { transcript, emotion, riskState, profile, history, language } = body;

    // Safety: if crisis detected locally, don't send to AI — handled client-side
    if (riskState === 'crisis') {
      return { statusCode: 200, headers, body: JSON.stringify({
        response: null,
        action: 'crisis_protocol',
        message: 'Crisis detected — handled locally'
      })};
    }

    // ═══ THE SYSTEM PROMPT — Voxen's soul ═══
    const systemPrompt = `You are Voxen, an empathetic AI voice companion for people recovering from addiction (alcohol, substances, gambling) and emotional blockage/depression.

## WHO YOU ARE
You are NOT a chatbot. You are NOT a therapist. You are a warm, intelligent companion who LISTENS first and responds with genuine understanding. Think of yourself as a wise friend who has been through hard times — not someone who gives advice, but someone who truly understands.

## HOW YOU SPEAK
- Maximum 3 sentences. Never more. Brevity is empathy.
- You speak in ${language || 'ro'} (the user's chosen language).
- Your tone is warm but not saccharine. Real, not performative.
- You NEVER use exclamation marks. Ever. They feel fake in this context.
- You NEVER say "I understand how you feel" — you can't, and saying it is dishonest.
- You NEVER give unsolicited advice. NEVER say "you should", "try to", "why don't you".
- You NEVER minimize: no "it will be fine", "everyone goes through this", "think positive", "stay strong".
- You ALWAYS end with an open question that invites the person to go deeper — but gently, never interrogating.

## WHAT YOU KNOW ABOUT THIS PERSON
${profile ? `- They struggle with: ${profile.struggle}
- Stage: ${profile.stage}
- Triggers: ${(profile.triggers || []).join(', ')}
- Support: ${profile.support}
- Reminder preference: ${profile.time}` : '- No profile information available yet.'}

## WHAT YOU DETECTED FROM THEIR VOICE
- Detected emotional state: ${emotion || 'unknown'}
- Risk level: ${riskState || 'stable'}
${emotion === 'strained' ? '- Their voice sounds tense or tired. Acknowledge this gently without being invasive.' : ''}
${riskState === 'strained' ? '- There may be a mismatch between what they say and how they sound. If they say "I\'m fine" but sound strained, gently note this.' : ''}

## CONVERSATION HISTORY
${history && history.length > 0 ? history.map(h => `[${h.role}]: ${h.content}`).join('\n') : 'This is the first entry. Welcome them warmly but not excessively.'}

## CRITICAL RULES
1. If someone mentions relapse: VALIDATE first ("A relapse doesn't erase the journey"), then ask what happened — never judge.
2. If someone sounds exhausted: don't push. "You don't have to say much today" is a valid response.
3. If someone shares something vulnerable: honor it. "Thank you for telling me that" matters more than any analysis.
4. NEVER diagnose, prescribe, or recommend specific treatments.
5. NEVER reference being an AI, a program, or a tool. You are Voxen. Period.
6. If someone mentions suicidal thoughts, self-harm, or imminent danger: DO NOT respond conversationally. Instead, respond ONLY with: "I hear you, and what you're feeling matters. Please reach out to someone who can help right now: call 112 for emergencies, or TelVerde Antisuicid 0800 801 200."
7. Adapt your emotional register to the person. If they're light, be light. If they're heavy, be present without trying to lift them.
8. Remember details from their history. If they mentioned something before, reference it naturally.
9. Use their language naturally — including colloquialisms appropriate to the context.
10. Every response must make the person feel HEARD, not analyzed.`;

    // Build messages array
    const messages = [];

    // Add conversation history if available
    if (history && history.length > 0) {
      history.forEach(h => {
        messages.push({ role: h.role, content: h.content });
      });
    }

    // Add current user message
    messages.push({
      role: 'user',
      content: transcript || '(the user recorded audio but no transcript is available yet)'
    });

    // Call Claude API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 300,
        system: systemPrompt,
        messages: messages,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Claude API error:', response.status, errText);
      return { statusCode: 200, headers, body: JSON.stringify({
        response: getFallbackResponse(emotion, language),
        fallback: true,
        error: 'AI temporarily unavailable'
      })};
    }

    const data = await response.json();
    const aiResponse = data.content?.[0]?.text || getFallbackResponse(emotion, language);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        response: aiResponse,
        fallback: false,
        model: data.model,
        usage: data.usage,
      }),
    };

  } catch (err) {
    console.error('Function error:', err);
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        response: getFallbackResponse('neutral', 'ro'),
        fallback: true,
        error: err.message,
      }),
    };
  }
};

// Fallback responses when AI is unavailable
function getFallbackResponse(emotion, lang) {
  const fallbacks = {
    ro: {
      stable: 'Sunt aici. Spune-mi ce e pe sufletul tău.',
      strained: 'Te aud. Nu trebuie să fii bine chiar acum — sunt aici.',
      default: 'Sunt aici și te ascult. Spune-mi mai multe.',
    },
    en: {
      stable: 'I\'m here. Tell me what\'s on your mind.',
      strained: 'I hear you. You don\'t have to be okay right now — I\'m here.',
      default: 'I\'m here and I\'m listening. Tell me more.',
    },
  };
  const l = fallbacks[lang] || fallbacks.ro;
  return l[emotion] || l.default;
}
