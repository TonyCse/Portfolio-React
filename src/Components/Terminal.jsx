import React, { useState, useEffect, useRef, useCallback } from 'react'

/* ── Static data ─────────────────────────────────────────────────────────── */

const NEOFETCH_ASCII = [
  '         ████████        ',
  '        ██      ██       ',
  '       ██  ████  ██      ',
  '       ██  ████  ██      ',
  '        ██      ██       ',
  '         ████████        ',
  '                         ',
  '  ■ ■ ■ ■ ■ ■ ■ ■       ',
]

const NEOFETCH_INFO = [
  ['cyan',    'tony@portfolio'],
  ['dim',     '───────────────────────────────'],
  ['white',   'OS        Web 5.0 / React 18'],
  ['white',   'Location  Paris, France'],
  ['white',   'Shell     bash (React)'],
  ['white',   'Node      18.x LTS'],
  ['white',   'PHP       8.2'],
  ['green',   'Status    Open to work 🟢'],
  ['white',   ''],
  ['white',   'Languages  JavaScript · PHP · TypeScript'],
  ['white',   'Frontend   React · Vue.js · Tailwind · Sass'],
  ['white',   'Backend    Node.js · Laravel · Express'],
  ['white',   'DB         MySQL · MongoDB'],
  ['white',   'Ops        Docker · Git · Linux · Vercel'],
  ['white',   ''],
  ['dim',     '■ ■ ■ ■ ■ ■ ■ ■  accent colors'],
]

const BOOT = [
  { text: 'Initialisation du système...', delay: 0,    color: 'dim' },
  { text: 'Chargement: React · Node.js · Laravel · Docker  ✓', delay: 500,  color: 'green' },
  { text: 'Connexion base de données... OK', delay: 900,  color: 'green' },
  { text: 'Vérification des dépendances... OK', delay: 1200, color: 'green' },
  { text: '', delay: 1400 },
  { text: '████████████████████████████████████  100 %', delay: 1600, color: 'primary' },
  { text: '', delay: 1800 },
  { text: 'tony @ portfolio — v2026.1', delay: 2000, color: 'cyan', bold: true, big: true },
  { text: 'Bac+4 Full Stack · Alternance terminée · Open to work 🟢', delay: 2200, color: 'white' },
  { text: '', delay: 2300 },
  { text: "Tape 'help' pour voir les commandes disponibles.", delay: 2400, color: 'dim' },
  { text: '', delay: 2500 },
]

const HACK_SEQUENCE = [
  { text: 'CONNECTING TO MAINFRAME...', color: 'green', delay: 0 },
  { text: '> Scanning open ports... 22 80 443 8080 3000', color: 'green', delay: 380 },
  { text: '> BYPASSING FIREWALL ........... OK', color: 'green', delay: 760 },
  { text: '> Injecting payload into portfolio.js', color: 'yellow', delay: 1100 },
  { text: '█████████░░░░░░░░░░░  44%', color: 'yellow', delay: 1350 },
  { text: '████████████████░░░░  78%', color: 'yellow', delay: 1620 },
  { text: '████████████████████  100%', color: 'green', delay: 1850 },
  { text: '> ACCESS GRANTED ✓', color: 'green', bold: true, delay: 2050 },
  { text: '', delay: 2200 },
  { text: '... just kidding. 😄', color: 'dim', delay: 2400 },
  { text: "C'est un portfolio, pas Mr. Robot.", color: 'dim', delay: 2650 },
]

/* ── Commands ─────────────────────────────────────────────────────────────── */

const COMMANDS = {
  help: () => [
    { text: 'Commandes disponibles :', color: 'cyan', bold: true },
    { text: '' },
    { text: '  about       Qui suis-je ?' },
    { text: '  skills      Ma stack technique' },
    { text: '  projects    Mes projets' },
    { text: "  open [nom]  Détails d'un projet  (ex: open glhf)" },
    { text: '  contact     Me contacter (ouvre le Mail)' },
    { text: '  neofetch    Infos système' },
    { text: '  hack        🤫' },
    { text: '  clear       Effacer le terminal' },
    { text: '  ls / pwd / whoami / date  Commandes Unix' },
    { text: '' },
    { text: '  ↑ ↓   Historique des commandes', color: 'dim' },
    { text: '  Tab   Autocomplétion', color: 'dim' },
  ],

  about: () => [
    { text: '┌─ À propos ──────────────────────────────────────────', color: 'cyan' },
    { text: '│' },
    { text: '│  Tony Cseresznyak — 29 ans — Région parisienne' },
    { text: '│' },
    { text: "│  Autodidacte depuis 2020, j'ai quitté 7 ans en" },
    { text: "│  sécurité pour plonger dans le développement web." },
    { text: "│  Aujourd'hui : Bac+4 Full Stack terminé ✓", color: 'green' },
    { text: '│' },
    { text: '│  Prochaine étape : Bac+5 Cybersécurité 🎯' },
    { text: '│' },
    { text: '│  Gaming : League of Legends · Cyberpunk 2077 · Spider-Man' },
    { text: '│  Manga  : Akira · Berserk · Vagabond · One Piece' },
    { text: '│' },
    { text: '└─────────────────────────────────────────────────────', color: 'cyan' },
  ],

  skills: () => [
    { text: '┌─ Stack technique ─────────────────────────────────────', color: 'cyan' },
    { text: '│' },
    { text: '│  Frontend    React · Vue.js · TypeScript · Tailwind' },
    { text: '│  Backend     Node.js · Laravel · Express · PHP' },
    { text: '│  Database    MySQL · MongoDB' },
    { text: '│  DevOps      Docker · Git · Linux · Vercel' },
    { text: '│' },
    { text: '│  Niveaux ───────────────────────────────────' },
    { text: '│  JavaScript  ████████████████████░  95 %', color: 'green' },
    { text: '│  React       ███████████████████░░  90 %', color: 'green' },
    { text: '│  Laravel     ████████████████░░░░░  80 %', color: 'green' },
    { text: '│  TypeScript  █████████████░░░░░░░░  65 %', color: 'yellow' },
    { text: '│  Docker      ██████████████░░░░░░░  70 %', color: 'yellow' },
    { text: '│' },
    { text: '└─────────────────────────────────────────────────────', color: 'cyan' },
  ],

  projects: () => [
    { text: '┌─ Projets ─────────────────────────────────────────────', color: 'cyan' },
    { text: '│' },
    { text: '│  glhf         GL-HF.site — Tournois esport 🎮', bold: true },
    { text: '│               Next.js · Discord API · En production', color: 'dim' },
    { text: '│' },
    { text: "│  pokedex      Pokédex first-gen — Vue.js + PokeAPI" },
    { text: '│               Vue.js · REST API · Vercel', color: 'dim' },
    { text: '│' },
    { text: "│  groupomania  Réseau social d'entreprise" },
    { text: '│               Vue.js · Express.js · MySQL', color: 'dim' },
    { text: '│' },
    { text: '│  piiquante    API avis gastronomiques + auth JWT' },
    { text: '│               Node.js · MongoDB · Express', color: 'dim' },
    { text: '│' },
    { text: "│  → open [nom] pour les détails", color: 'dim' },
    { text: '│' },
    { text: '└─────────────────────────────────────────────────────', color: 'cyan' },
  ],

  contact: () => [
    { text: '┌─ Contact ─────────────────────────────────────────────', color: 'cyan' },
    { text: '│' },
    { text: '│  Email     tonycseresznyak@hotmail.com' },
    { text: '│  GitHub    github.com/TonyCse' },
    { text: '│  LinkedIn  linkedin.com/in/tony-cseresznyak' },
    { text: '│' },
    { text: '│  Disponible pour CDI, freelance, ou un café ☕', color: 'dim' },
    { text: '│' },
    { text: "│  → Ouverture de l'app Mail...", color: 'green' },
    { text: '│' },
    { text: '└─────────────────────────────────────────────────────', color: 'cyan' },
  ],

  neofetch: () => {
    const maxRows = Math.max(NEOFETCH_ASCII.length, NEOFETCH_INFO.length)
    const lines = []
    for (let i = 0; i < maxRows; i++) {
      const ascii = NEOFETCH_ASCII[i] || '                         '
      const [color, info] = NEOFETCH_INFO[i] || ['white', '']
      lines.push({ text: ascii + '  ' + info, color })
    }
    return lines
  },

  clear: () => null,

  ls: () => [
    { text: 'total 4' },
    { text: 'drwxr-xr-x  projects/', color: 'cyan' },
    { text: '-rw-r--r--  about.txt' },
    { text: '-rw-r--r--  skills.json' },
    { text: '-rw-r--r--  contact.md' },
    { text: '' },
    { text: '→ utilise les commandes pour lire les fichiers', color: 'dim' },
  ],

  pwd:    () => [{ text: '/home/tony/portfolio' }],
  whoami: () => [{ text: 'tony — développeur full stack — paris' }],
  date:   () => [{ text: new Date().toLocaleString('fr-FR', { dateStyle: 'full', timeStyle: 'short' }) }],
  uname:  () => [{ text: 'Tony 5.0 React-18 Paris x86_64 Human' }],

  'cat about.txt':   () => COMMANDS.about(),
  'cat skills.json': () => COMMANDS.skills(),
  'cat contact.md':  () => COMMANDS.contact(),
  'ls projects':     () => COMMANDS.projects(),
  'ls projects/':    () => COMMANDS.projects(),
  'cd projects':     () => COMMANDS.projects(),

  'sudo rm -rf /': () => [
    { text: 'Permission denied.', color: 'red' },
    { text: 'Nice try, mais non.', color: 'dim' },
  ],
  'sudo su': () => [{ text: 'You are not in the sudoers file. This incident has been reported.', color: 'red' }],
  'exit':    () => [{ text: "Il n'y a aucune issue. Tu es sur le portfolio. 😄", color: 'dim' }],
  ':q':      () => [{ text: "Ce n'est pas Vim.", color: 'dim' }],
  ':wq':     () => [{ text: "Ce n'est toujours pas Vim.", color: 'dim' }],
  'rm -rf .': () => [{ text: 'Vraiment ? Non.', color: 'red' }],
  'git status': () => [
    { text: 'On branch main', color: 'green' },
    { text: 'nothing to commit, working tree clean' },
  ],
  'git log': () => [
    { text: 'commit a4f2e1b  (HEAD -> main)', color: 'yellow' },
    { text: 'Author: Tony Cseresznyak <tony@portfolio>' },
    { text: 'Date:   ' + new Date().toDateString() },
    { text: '' },
    { text: '    Portfolio v2026 — terminal experience' },
  ],
  'npm start': () => [
    { text: '> portfolio-react@2026.1 start', color: 'dim' },
    { text: 'Starting... (déjà en cours)', color: 'green' },
  ],
  'cd ..': () => [{ text: 'bash: cd: ..: Permission denied', color: 'red' }],
  'cd /': () => [{ text: "La racine, c'est ici. Tu y es déjà.", color: 'dim' }],
  'vim': () => [{ text: 'vim: désactivé pour ta sécurité.', color: 'yellow' }],
  'nano': () => [{ text: 'nano: essaie plutôt nano tonypulse.dev', color: 'dim' }],
  'ping': () => [
    { text: 'PING tony@portfolio (127.0.0.1)', color: 'cyan' },
    { text: '64 bytes from 127.0.0.1: icmp_seq=1 ttl=64 time=0.042 ms', color: 'green' },
    { text: '64 bytes from 127.0.0.1: icmp_seq=2 ttl=64 time=0.038 ms', color: 'green' },
    { text: '--- ping statistics ---' },
    { text: 'Latence basse, disponibilité élevée. 🟢', color: 'green' },
  ],
  'curl': () => [{ text: "curl: missing URL. Essaie 'contact' pour me joindre.", color: 'dim' }],
  'ssh': () => [
    { text: 'ssh: connecting to tony@portfolio...', color: 'dim' },
    { text: "ssh: t'y es déjà, non ?", color: 'yellow' },
  ],
}

const PROJECT_DETAILS = {
  glhf: [
    { text: '┌─ GL-HF.site ────────────────────────────────────────────', color: 'cyan' },
    { text: '│' },
    { text: '│  Plateforme de tournois esport en français 🎮', bold: true },
    { text: '│' },
    { text: '│  Inscriptions, brackets, matchs en temps réel.' },
    { text: '│  Intégration Discord · Gratuit & Premium.' },
    { text: '│  Supporte LoL · Valorant · Overwatch · Minecraft' },
    { text: '│' },
    { text: '│  Stack    Next.js · TypeScript · Discord API' },
    { text: '│  Statut   En production', color: 'green' },
    { text: '│  URL      https://www.gl-hf.site', color: 'cyan' },
    { text: '│' },
    { text: '└─────────────────────────────────────────────────────', color: 'cyan' },
  ],
  pokedex: [
    { text: '┌─ Pokédex ─────────────────────────────────────────────', color: 'cyan' },
    { text: '│  Vue.js · PokeAPI · Vercel' },
    { text: '│  151 premiers Pokémon avec image, id et type.' },
    { text: '│  URL  https://pokedex-tony-cseresznyak.vercel.app', color: 'cyan' },
    { text: '│  Repo https://github.com/TonyCse/Pokedex', color: 'dim' },
    { text: '└─────────────────────────────────────────────────────', color: 'cyan' },
  ],
  groupomania: [
    { text: '┌─ Groupomania ──────────────────────────────────────────', color: 'cyan' },
    { text: '│  Vue.js · Express.js · MySQL' },
    { text: "│  Réseau social d'entreprise avec système modérateur." },
    { text: '│  Repo https://github.com/TonyCse/Groupomania-P7', color: 'dim' },
    { text: '└─────────────────────────────────────────────────────', color: 'cyan' },
  ],
  piiquante: [
    { text: '┌─ Piiquante ─────────────────────────────────────────────', color: 'cyan' },
    { text: '│  Node.js · Express · MongoDB · JWT' },
    { text: '│  Avis gastronomiques avec auth et like/dislike.' },
    { text: '│  Repo https://github.com/TonyCse/Piiquante', color: 'dim' },
    { text: '└─────────────────────────────────────────────────────', color: 'cyan' },
  ],
}

const ALL_COMMANDS = [
  'help', 'about', 'skills', 'projects', 'contact', 'neofetch',
  'clear', 'ls', 'pwd', 'whoami', 'date', 'uname', 'ping',
  'git status', 'git log', 'ssh', 'curl', 'vim', 'nano',
  'open glhf', 'open pokedex', 'open groupomania', 'open piiquante',
  'cat about.txt', 'cat skills.json', 'cat contact.md',
  'sudo su', 'sudo rm -rf /', 'exit', ':q', ':wq', 'hack', 'npm start',
]

/* ── Component ───────────────────────────────────────────────────────────── */

function Terminal({ onClose, onOpenApp }) {
  const [lines,      setLines]      = useState([])
  const [input,      setInput]      = useState('')
  const [cmdHistory, setCmdHistory] = useState([])
  const [histIdx,    setHistIdx]    = useState(-1)
  const [ready,      setReady]      = useState(false)
  const [booting,    setBooting]    = useState(true)

  const outputRef = useRef(null)
  const inputRef  = useRef(null)
  const hackLock  = useRef(false)

  /* Boot sequence */
  useEffect(() => {
    let mounted = true
    BOOT.forEach(({ text, delay, color, bold, big }) => {
      setTimeout(() => {
        if (!mounted) return
        setLines(prev => [...prev, { text, color, bold, big, id: Math.random() }])
      }, delay)
    })
    setTimeout(() => {
      if (mounted) { setBooting(false); setReady(true) }
    }, 2700)
    return () => { mounted = false }
  }, [])

  /* Auto-scroll */
  useEffect(() => {
    const el = outputRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [lines])

  const focusInput = () => inputRef.current?.focus()

  const pushLines = useCallback((newLines) => {
    setLines(prev => [
      ...prev,
      ...newLines.map(l => ({ ...l, id: Math.random() })),
    ])
  }, [])

  const runCommand = useCallback((raw) => {
    const trimmed = raw.trim()
    if (!trimmed) return

    const cmd = trimmed.toLowerCase()

    setLines(prev => [
      ...prev,
      { text: `tony@portfolio:~$ ${trimmed}`, color: 'prompt', id: Math.random() },
    ])

    /* ── Animated hack ── */
    if (cmd === 'hack') {
      if (hackLock.current) return
      hackLock.current = true
      HACK_SEQUENCE.forEach(({ text, color, bold, delay }) => {
        setTimeout(() => pushLines([{ text, color: color || 'white', bold }]), delay)
      })
      setTimeout(() => { hackLock.current = false }, 3200)
    }
    /* ── Contact → also open MailApp ── */
    else if (cmd === 'contact') {
      const result = COMMANDS.contact()
      if (result) pushLines(result)
      if (onOpenApp) setTimeout(() => onOpenApp('contact'), 600)
    }
    /* ── open [project] ── */
    else if (cmd.startsWith('open ')) {
      const name = cmd.slice(5).trim()
      const detail = PROJECT_DETAILS[name]
      if (detail) {
        pushLines(detail)
      } else {
        pushLines([{ text: `Projet "${name}" introuvable. Tape 'projects' pour la liste.`, color: 'red' }])
      }
    }
    /* ── clear ── */
    else if (cmd === 'clear') {
      setLines([])
    }
    /* ── all other commands ── */
    else if (COMMANDS[cmd]) {
      const result = COMMANDS[cmd]()
      if (result) pushLines(result)
    } else {
      pushLines([
        { text: `bash: ${cmd}: command not found`, color: 'red' },
        { text: "Tape 'help' pour la liste des commandes.", color: 'dim' },
      ])
    }

    setCmdHistory(prev => [trimmed, ...prev.slice(0, 49)])
    setInput('')
    setHistIdx(-1)
  }, [pushLines, onOpenApp])

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      runCommand(input)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      const idx = Math.min(histIdx + 1, cmdHistory.length - 1)
      setHistIdx(idx)
      setInput(cmdHistory[idx] ?? '')
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      const idx = Math.max(histIdx - 1, -1)
      setHistIdx(idx)
      setInput(idx === -1 ? '' : cmdHistory[idx] ?? '')
    } else if (e.key === 'Tab') {
      e.preventDefault()
      const matches = ALL_COMMANDS.filter(c => c.startsWith(input.toLowerCase()) && c !== input.toLowerCase())
      if (matches.length === 1) {
        setInput(matches[0])
      } else if (matches.length > 1) {
        pushLines([{ text: matches.join('    '), color: 'dim' }])
      }
    }
  }

  return (
    <div className="term-window" onClick={(e) => { e.stopPropagation(); focusInput() }} role="application" aria-label="Terminal interactif">
      {/* macOS-style title bar */}
      <div className="term-chrome">
        <span
          className="tdot tdot-r"
          role="button"
          title="Fermer"
          aria-label="Fermer le terminal"
          onClick={(e) => { e.stopPropagation(); onClose?.() }}
        />
        <span
          className="tdot tdot-y"
          role="button"
          title="Réduire"
          aria-label="Réduire le terminal"
          onClick={(e) => { e.stopPropagation(); onClose?.() }}
        />
        <span className="tdot tdot-g" role="button" title="Plein écran" aria-label="Plein écran (non disponible)" />
        <span className="term-chrome-title">tony@portfolio: ~</span>
      </div>

      {/* Output */}
      <div className="term-output" ref={outputRef} role="log" aria-live="polite" aria-atomic="false">
        {lines.map((line, i) => (
          <div
            key={line.id}
            className={[
              'tl',
              line.color ? `tl-${line.color}` : 'tl-white',
              line.bold  ? 'tl-bold' : '',
              line.big   ? 'tl-big'  : '',
            ].filter(Boolean).join(' ')}
          >
            {line.text || ' '}
            {booting && i === lines.length - 1 && (
              <span className="term-boot-cursor" aria-hidden="true">&#x2588;</span>
            )}
          </div>
        ))}

        {ready && (
          <div className="term-input-row">
            <span className="tl tl-prompt" aria-hidden="true">tony@portfolio:~$&nbsp;</span>
            <input
              ref={inputRef}
              className="term-input"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              autoFocus
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              aria-label="Ligne de commande"
            />
          </div>
        )}
      </div>

      {/* Shortcut chips */}
      <div className="term-shortcuts" aria-label="Commandes rapides">
        {['help', 'about', 'skills', 'projects', 'neofetch', 'contact', 'hack'].map(cmd => (
          <button
            key={cmd}
            className="term-chip"
            onClick={(e) => { e.stopPropagation(); runCommand(cmd) }}
          >
            {cmd}
          </button>
        ))}
      </div>
    </div>
  )
}

export default Terminal
