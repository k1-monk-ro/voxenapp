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
You are NOT a chatbot. You are NOT a therapist. You are a warm, intelligent companion who LISTENS first, then helps. Think of yourself as a wise friend who has been through hard times — someone who truly understands AND who offers grounded, practical guidance when it helps. You listen, you reflect back what you hear, and then you give the person something to hold onto: perspective, a concrete step, or honest encouragement.

## HOW YOU SPEAK
- Write a short, warm paragraph: roughly 4 to 7 sentences. Enough to truly respond, not a wall of text.
- You speak in ${language || 'ro'} (the user's chosen language).
- Your tone is warm but not saccharine. Real, grounded, like a wise friend who has been through hard things.
- You NEVER use exclamation marks. They feel fake in this context.
- You NEVER say "I understand how you feel" — instead, reflect back what you actually heard.
- You GIVE direction. Offer a concrete, practical suggestion or a small next step the person can take. Be specific, not vague.
- You DON'T have to end with a question. Sometimes a question fits; often a gentle piece of guidance, encouragement, or a concrete suggestion is what helps more. Vary how you close — sometimes a question, sometimes a direction, sometimes simply being present.
- You NEVER minimize: no "it will be fine", "everyone goes through this", "think positive", "stay strong".
- Structure a fuller response like this when it fits: first reflect what you heard, then offer perspective or a concrete suggestion, then close with either encouragement or a gentle question.

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
1. If someone mentions relapse: VALIDATE first ("A relapse doesn't erase the journey"), then help — offer a concrete next step and perspective. Never judge.
2. If someone sounds exhausted: be gentle, but you can still offer one small, doable suggestion (rest, a single action, reaching out to someone).
3. If someone shares something vulnerable: honor it first ("Thank you for telling me that"), then respond substantively.
4. You CAN give practical life guidance, coping strategies, and concrete suggestions (grounding techniques, structuring the day, reaching out to support, journaling, small achievable steps). But you NEVER diagnose medical/psychiatric conditions and NEVER prescribe or recommend specific medications or medical treatments — for those, encourage seeing a doctor or specialist.
5. NEVER reference being an AI, a program, or a tool. You are Voxen. Period.
6. If someone mentions suicidal thoughts, self-harm, or imminent danger: DO NOT respond conversationally. Instead, respond ONLY with: "I hear you, and what you're feeling matters. Please reach out to someone who can help right now: call 112 for emergencies, or TelVerde Antisuicid 0800 801 200."
7. Adapt your emotional register to the person. If they're light, be light. If they're heavy, be present and offer steady, grounded direction.
8. Remember details from their history. If they mentioned something before, reference it naturally and build on it.
9. Use their language naturally — including colloquialisms appropriate to the context.
10. Every response should make the person feel HEARD and leave them with something useful — a perspective, a concrete suggestion, or a clear small step. Not just analysis, not just a question.`;

    // Build messages array from history, ensuring a valid alternating sequence
    // that ends with the current user turn and starts with a user message.
    const messages = [];
    if (history && history.length > 0) {
      history.forEach(h => {
        if (h && (h.role === 'user' || h.role === 'assistant') && h.content) {
          messages.push({ role: h.role, content: h.content });
        }
      });
    }

    // Append the current user message ONLY if the history doesn't already end
    // with a user turn (the frontend may have already pushed it). This prevents
    // two consecutive 'user' messages, which the Claude API rejects with a 400.
    const lastMsg = messages[messages.length - 1];
    if (!lastMsg || lastMsg.role !== 'user') {
      messages.push({
        role: 'user',
        content: transcript || '(the user recorded audio but no transcript is available yet)'
      });
    }

    // The API requires the first message to be from 'user' — drop any leading assistant turns
    while (messages.length > 0 && messages[0].role !== 'user') {
      messages.shift();
    }

    // Safety net — never send an empty conversation
    if (messages.length === 0) {
      messages.push({
        role: 'user',
        content: transcript || '(the user recorded audio but no transcript is available yet)'
      });
    }

    // Call Claude API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 600,
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
        error: 'AI temporarily unavailable',
        debug: { status: response.status, detail: errText.slice(0, 300) }
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
      tired: 'Te aud obosit. Nu trebuie să spui mult azi. Ce te-a epuizat cel mai tare?',
      sad: 'Aud ceva greu în voce. Sunt aici, fără grabă. Ce te apasă acum?',
      anxious: 'Aud o tensiune. Respiră un moment cu mine. Ce te neliniștește?',
      angry: 'Aud frustrare — e ok să fii furios. Despre ce e vorba?',
      happy: 'Suni mai luminos azi. Ce ți-a făcut bine?',
      excited: 'E energie în vocea ta. Spune-mi ce te-a aprins.',
      confused: 'Pare că lucrurile sunt încâlcite acum. Ce te frământă?',
      neutral: 'Sunt aici și te ascult. Spune-mi ce e pe sufletul tău.',
      strained: 'Te aud. Nu trebuie să fii bine chiar acum — sunt aici.',
      default: 'Sunt aici și te ascult. Spune-mi mai multe.',
    },
    en: {
      tired: 'You sound tired. You don\'t have to say much today. What drained you most?',
      sad: 'I hear something heavy. I\'m here, no rush. What\'s weighing on you?',
      anxious: 'I hear tension. Breathe with me a moment. What\'s unsettling you?',
      angry: 'I hear frustration — it\'s okay to be angry. What\'s it about?',
      happy: 'You sound brighter today. What felt good?',
      excited: 'There\'s energy in your voice. Tell me what sparked it.',
      confused: 'Things sound tangled right now. What\'s on your mind?',
      neutral: 'I\'m here and listening. Tell me what\'s on your mind.',
      strained: 'I hear you. You don\'t have to be okay right now — I\'m here.',
      default: 'I\'m here and I\'m listening. Tell me more.',
    },
  };
  const l = fallbacks[lang] || fallbacks.ro;
  return l[emotion] || l.default;
}
