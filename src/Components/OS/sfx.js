/* ── Chiptune SFX (Web Audio API — zéro dépendance) ── */
let _ctx = null
function ctx() {
  if (!_ctx) _ctx = new (window.AudioContext || window.webkitAudioContext)()
  return _ctx
}

function tone(freq, dur, type = 'square', vol = 0.12) {
  try {
    const ac = ctx()
    if (ac.state === 'suspended') ac.resume()
    const osc = ac.createOscillator()
    const g   = ac.createGain()
    osc.connect(g)
    g.connect(ac.destination)
    osc.type = type
    osc.frequency.setValueAtTime(freq, ac.currentTime)
    g.gain.setValueAtTime(vol, ac.currentTime)
    g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + dur)
    osc.start()
    osc.stop(ac.currentTime + dur)
  } catch {}
}

const at = (ms, fn) => setTimeout(fn, ms)

export const sfx = {
  step:    () => tone(130, 0.05, 'square',   0.032),
  hit:     () => { tone(110, 0.07, 'sawtooth', 0.09); at(70, () => tone(80, 0.1, 'square', 0.07)) },
  win:     () => [440, 554, 659, 880].forEach((f, i) => at(i * 80, () => tone(f, 0.09, 'square', 0.1))),
  lose:    () => [440, 350, 260, 200].forEach((f, i) => at(i * 90, () => tone(f, 0.1,  'square', 0.08))),
  levelUp: () => [523, 587, 659, 784, 1047].forEach((f, i) => at(i * 65, () => tone(f, 0.1, 'square', 0.1))),
  collect: () => { tone(880, 0.06, 'square', 0.09); at(65, () => tone(1108, 0.1, 'square', 0.1)) },
  enter:   () => tone(392, 0.1, 'triangle', 0.09),
  npc:     () => tone(660, 0.06, 'triangle', 0.07),
  quest:   () => [523, 659, 784, 659, 880].forEach((f, i) => at(i * 60, () => tone(f, 0.08, 'square', 0.09))),
}
