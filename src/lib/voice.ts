// AEGIS · Lightweight voice wrapper (browser SpeechSynthesis).
// Swap implementation to ElevenLabs by replacing `speak()` with a fetch-based
// player; the public API (speak, stop, available) stays stable.

let currentUtter: SpeechSynthesisUtterance | null = null;

export function voiceAvailable(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

function pickVoice(): SpeechSynthesisVoice | null {
  if (!voiceAvailable()) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;
  // Prefer a clear English neural-ish voice if available.
  const pref = voices.find((v) =>
    /Google|Microsoft|Samantha|Daniel|Karen|Serena/i.test(v.name) && /en/i.test(v.lang),
  );
  return pref ?? voices.find((v) => /en/i.test(v.lang)) ?? voices[0];
}

export function speak(text: string, opts?: { rate?: number; pitch?: number }) {
  if (!voiceAvailable()) return;
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    const v = pickVoice();
    if (v) u.voice = v;
    u.rate = opts?.rate ?? 1.02;
    u.pitch = opts?.pitch ?? 1.0;
    u.volume = 1;
    currentUtter = u;
    window.speechSynthesis.speak(u);
  } catch { /* noop */ }
}

export function stopSpeaking() {
  if (!voiceAvailable()) return;
  try { window.speechSynthesis.cancel(); } catch { /* noop */ }
  currentUtter = null;
}

export function isSpeaking(): boolean {
  return voiceAvailable() && window.speechSynthesis.speaking;
}
