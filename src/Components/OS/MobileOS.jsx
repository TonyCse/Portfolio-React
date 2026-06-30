import { useState, useEffect, useCallback, useRef, Suspense, lazy } from 'react'
import './MobileOS.css'
import avatarClindoeil from '../../images/avatarclindoeil.png'
import VScode      from '../../images/VScode.png'
import taskImg     from '../../images/task.png'
import OutlookImg  from '../../images/Outlook.png'
import terminalImg from '../../images/terminal.png'
import aproposImg  from '../../images/a-propos.webp'
import dofusImg    from '../../images/dofus.png'
import musicImg    from '../../images/music.png'
import dossierImg  from '../../images/dossier.avif'
import canvaImg    from '../../images/canva.png'

const Presentation = lazy(() => import('../Presentation'))
const VSCodeSkills = lazy(() => import('./VSCodeSkills'))
const Experiences  = lazy(() => import('../Experiences'))
const Projets      = lazy(() => import('../Projets'))
const Terminal     = lazy(() => import('../Terminal'))
const HobbiesGame  = lazy(() => import('./HobbiesGame'))
const CVViewer     = lazy(() => import('./CVViewer'))
const SpotifyApp   = lazy(() => import('./SpotifyApp'))
const MailApp      = lazy(() => import('./MailApp'))

const I = (src, alt) => <img src={src} alt={alt} className="app-icon-img" />

const ALL_APPS = [
  { id: 'about',    title: 'À propos',    icon: I(aproposImg,  'À propos'),   bg: 'linear-gradient(145deg, #7c3aed, #a476ff)' },
  { id: 'skills',   title: 'Stack',       icon: I(VScode,      'VSCode'),     bg: 'linear-gradient(145deg, #b45309, #fbbf24)' },
  { id: 'exp',      title: 'Expériences', icon: I(taskImg,     'Task'),       bg: 'linear-gradient(145deg, #1d4ed8, #60a5fa)' },
  { id: 'projects', title: 'Projets',     icon: I(dossierImg,  'Projets'),    bg: 'linear-gradient(145deg, #c2410c, #fb923c)' },
  { id: 'contact',  title: 'Mail',        icon: I(OutlookImg,  'Mail'),       bg: 'linear-gradient(145deg, #0e7490, #22d3ee)' },
  { id: 'hobbies',  title: 'Hobbies',     icon: I(dofusImg,    'Hobbies'),    bg: 'linear-gradient(145deg, #991b1b, #f87171)' },
  { id: 'cv',       title: 'Mon CV',      icon: I(canvaImg,    'Mon CV'),     bg: 'linear-gradient(145deg, #15803d, #4ade80)' },
  { id: 'spotify',  title: 'Music',       icon: I(musicImg,    'Music'),      bg: 'linear-gradient(145deg, #6d28d9, #c084fc)' },
]

const PAGE_SIZE = 4
const PAGES = [ALL_APPS.slice(0, PAGE_SIZE), ALL_APPS.slice(PAGE_SIZE)]

const DOCK_APPS = [
  { id: 'terminal', title: 'Terminal', icon: I(terminalImg, 'Terminal'), bg: 'linear-gradient(145deg, #14532d, #4ade80)' },
  { id: 'about',    title: 'À propos', icon: I(aproposImg,  'À propos'), bg: 'linear-gradient(145deg, #7c3aed, #a476ff)' },
  { id: 'spotify',  title: 'Music',    icon: I(musicImg,    'Music'),    bg: 'linear-gradient(145deg, #6d28d9, #c084fc)' },
  { id: 'contact',  title: 'Mail',     icon: I(OutlookImg,  'Mail'),     bg: 'linear-gradient(145deg, #0e7490, #22d3ee)' },
]

const DEV_QUOTES = [
  "Any fool can write code a computer understands.",
  "First, solve the problem. Then, write the code.",
  "Code is read more often than it is written.",
  "Make it work, make it right, make it fast.",
  "Simplicity is the soul of efficiency.",
]

const fmt     = () => new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
const fmtDate = () => new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })

function vibrate(pattern) {
  try { if ('vibrate' in navigator) navigator.vibrate(pattern) } catch {}
}

/* ── Widgets ─────────────────────────────────────────────────────── */
function WidgetRow() {
  const [quoteIdx, setQuoteIdx] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setQuoteIdx(q => (q + 1) % DEV_QUOTES.length), 7000)
    return () => clearInterval(id)
  }, [])
  return (
    <div className="mob-widgets">
      <div className="mob-widget mob-widget-weather">
        <div className="mob-widget-icon-lg">⛅</div>
        <div>
          <div className="mob-widget-temp">22°</div>
          <div className="mob-widget-city">Paris</div>
        </div>
      </div>
      <div className="mob-widget mob-widget-quote">
        <span className="mob-widget-quote-icon">💡</span>
        <p className="mob-widget-quote-text">{DEV_QUOTES[quoteIdx]}</p>
      </div>
    </div>
  )
}

function AppContent({ id, onClose, volume, onVolumeChange }) {
  const inner = (() => {
    switch (id) {
      case 'about':    return <Presentation />
      case 'skills':   return <VSCodeSkills />
      case 'exp':      return <Experiences />
      case 'projects': return <Projets />
      case 'contact':  return <MailApp />
      case 'hobbies':  return <HobbiesGame />
      case 'terminal': return <Terminal onClose={onClose} />
      case 'cv':       return <CVViewer />
      case 'spotify':  return <SpotifyApp volume={volume} onVolumeChange={onVolumeChange} />
      default:         return null
    }
  })()
  return (
    <Suspense fallback={<div className="os-lazy-loader"><span className="os-lazy-dot"/><span className="os-lazy-dot"/><span className="os-lazy-dot"/></div>}>
      {inner}
    </Suspense>
  )
}

function MobileApp({ app, onClose, volume, onVolumeChange }) {
  const [closing, setClosing] = useState(false)

  const handleClose = useCallback(() => {
    setClosing(true)
    setTimeout(onClose, 290)
  }, [onClose])

  return (
    <div className={`mob-app-overlay${closing ? ' mob-closing' : ''}`}>
      <div className="mob-app-header">
        <button className="mob-app-close" onClick={handleClose} aria-label="Fermer">✕</button>
        <div className="mob-app-title-bar">
          <span className="mob-app-title-icon">{app.icon}</span>
          <span className="mob-app-title-text">{app.title}</span>
        </div>
        <div className="mob-app-spacer" />
      </div>
      <div className="mob-app-body">
        <AppContent id={app.id} onClose={handleClose} volume={volume} onVolumeChange={onVolumeChange} />
      </div>
    </div>
  )
}

function LockSlider({ onUnlock }) {
  const [thumbX,   setThumbX]   = useState(0)
  const [snapping, setSnapping] = useState(false)
  const [done,     setDone]     = useState(false)
  const isDragging  = useRef(false)
  const startClient = useRef(0)
  const currentX    = useRef(0)

  const MAX_DRAG  = 204
  const THRESHOLD = MAX_DRAG * 0.72

  const begin = (clientX) => {
    if (done) return
    isDragging.current  = true
    startClient.current = clientX - currentX.current
    setSnapping(false)
  }
  const move = (clientX) => {
    if (!isDragging.current) return
    const x = Math.max(0, Math.min(MAX_DRAG, clientX - startClient.current))
    currentX.current = x
    setThumbX(x)
  }
  const end = () => {
    if (!isDragging.current) return
    isDragging.current = false
    if (currentX.current >= THRESHOLD) {
      currentX.current = MAX_DRAG
      setThumbX(MAX_DRAG)
      setDone(true)
      vibrate([40, 30, 60])
      setTimeout(onUnlock, 360)
    } else {
      currentX.current = 0
      setSnapping(true)
      setThumbX(0)
    }
  }

  useEffect(() => {
    const onMM = (e) => move(e.clientX)
    const onMU = ()  => end()
    const onTM = (e) => { e.preventDefault(); move(e.touches[0].clientX) }
    const onTE = ()  => end()
    window.addEventListener('mousemove', onMM)
    window.addEventListener('mouseup',   onMU)
    window.addEventListener('touchmove', onTM, { passive: false })
    window.addEventListener('touchend',  onTE)
    return () => {
      window.removeEventListener('mousemove', onMM)
      window.removeEventListener('mouseup',   onMU)
      window.removeEventListener('touchmove', onTM)
      window.removeEventListener('touchend',  onTE)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const progress = thumbX / MAX_DRAG

  return (
    <div className={`mob-lock-track${done ? ' mob-lock-track-done' : ''}`}>
      <span className="mob-lock-track-label" style={{ opacity: Math.max(0, 1 - progress * 1.8) }}>
        Glisser pour déverrouiller
      </span>
      <div
        className={`mob-lock-thumb${done ? ' mob-lock-thumb-done' : ''}`}
        style={{
          transform: `translateX(${thumbX}px)`,
          transition: snapping || done ? 'transform 0.38s cubic-bezier(0.22,1,0.36,1)' : 'none',
        }}
        onMouseDown={(e) => { e.preventDefault(); begin(e.clientX) }}
        onTouchStart={(e) => begin(e.touches[0].clientX)}
      >
        ›
      </div>
    </div>
  )
}

function MobileOS({ theme, onToggleTheme, onSwitchToDesktop }) {
  const [time,      setTime]     = useState(fmt)
  const [openApp,   setOpenApp]  = useState(null)
  const [volume,    setVolume]   = useState(0.7)
  const [locked,    setLocked]   = useState(true)
  const [lockAnim,  setLockAnim] = useState(false)
  const [page,      setPage]     = useState(0)
  const swipeStartX = useRef(null)
  const date = fmtDate()

  useEffect(() => {
    const id = setInterval(() => setTime(fmt()), 15000)
    return () => clearInterval(id)
  }, [])

  const openById = useCallback((appDef) => {
    vibrate([20])
    setOpenApp(appDef)
  }, [])
  const closeApp = useCallback(() => setOpenApp(null), [])

  const handleUnlock = useCallback(() => {
    setLockAnim(true)
    setTimeout(() => { setLocked(false); setLockAnim(false) }, 440)
  }, [])

  const handleTouchStart = (e) => { swipeStartX.current = e.touches[0].clientX }
  const handleTouchEnd   = (e) => {
    if (swipeStartX.current === null) return
    const dx = e.changedTouches[0].clientX - swipeStartX.current
    swipeStartX.current = null
    if (Math.abs(dx) > 55) {
      setPage(p => dx < 0 ? Math.min(p + 1, PAGES.length - 1) : Math.max(p - 1, 0))
    }
  }

  return (
    <div className="mob-os">

      {/* ── Status bar ── */}
      <div className="mob-status">
        <span className="mob-status-brand"></span>
        <span className="mob-status-time">{time}</span>
        <div className="mob-status-right">
          {onSwitchToDesktop && (
            <button
              className="mob-status-icon-btn"
              onClick={onSwitchToDesktop}
              title="Mode bureau"
              aria-label="Passer en mode bureau"
            >🖥️</button>
          )}
          <button
            className="mob-status-icon-btn"
            onClick={onToggleTheme}
            title={theme === 'dark' ? 'Mode clair' : 'Mode sombre'}
            aria-label="Changer le thème"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          <div className="mob-signal-bars">
            <span /><span /><span /><span />
          </div>
          <span className="mob-battery-icon">🔋</span>
        </div>
      </div>

      {/* ── Home screen ── */}
      <div
        className="mob-home"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >

        {/* Identity */}
        <div className="mob-identity">
          <img src={avatarClindoeil} alt="Tony" className="mob-avatar" />
          <p className="mob-date">{date}</p>
          <h1 className="mob-name">Tony Cseresznyak</h1>
          <p className="mob-role">Full Stack Developer</p>
        </div>

        {/* Widgets */}
        <WidgetRow />

        {/* App grid — swipeable pages */}
        <div className="mob-grid-wrapper">
          <div className="mob-grid">
            {PAGES[page].map(app => (
              <button key={app.id} className="mob-icon" onClick={() => openById(app)}>
                <div className="mob-icon-bg">
                  <span className="mob-icon-emoji">{app.icon}</span>
                </div>
                <span className="mob-icon-label">{app.title}</span>
              </button>
            ))}
          </div>

          {/* Page dots */}
          <div className="mob-page-dots" aria-label={`Page ${page + 1} sur ${PAGES.length}`}>
            {PAGES.map((_, i) => (
              <button
                key={i}
                className={`mob-dot${page === i ? ' mob-dot-active' : ''}`}
                onClick={() => setPage(i)}
                aria-label={`Page ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── Dock ── */}
      <div className="mob-dock">
        <div className="mob-dock-inner">
          {DOCK_APPS.map(app => (
            <button key={app.id} className="mob-dock-btn" onClick={() => openById(app)} title={app.title}>
              <div className="mob-dock-icon-bg">
                <span className="mob-dock-emoji">{app.icon}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ── App overlay ── */}
      {openApp && (
        <MobileApp
          app={openApp}
          onClose={closeApp}
          volume={volume}
          onVolumeChange={setVolume}
        />
      )}

      {/* ── Lock screen ── */}
      {locked && (
        <div className={`mob-lockscreen${lockAnim ? ' mob-lock-exiting' : ''}`}>
          <div className="mob-lock-center">
            <div className="mob-lock-time">{time}</div>
            <div className="mob-lock-date">{date}</div>
          </div>
          <LockSlider onUnlock={handleUnlock} />
        </div>
      )}
    </div>
  )
}

export default MobileOS
