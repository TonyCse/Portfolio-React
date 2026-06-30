import React, { useState, useRef, useEffect, useCallback, Suspense, lazy } from 'react'
import Window from './Window'
import Taskbar from './Taskbar'
import DesktopIcon from './DesktopIcon'
import './OS.css'
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
const SpotifyApp   = lazy(() => import('./SpotifyApp'))
const MailApp      = lazy(() => import('./MailApp'))
const CVViewer     = lazy(() => import('./CVViewer'))

const I = (src, alt) => <img src={src} alt={alt} className="app-icon-img" />

const APPS = [
  {
    id: 'about',
    title: 'À propos',
    icon: I(aproposImg, 'À propos'),
    defaultPos: { x: 114, y: 48 },
    defaultSize: { width: 840, height: 560 },
  },
  {
    id: 'skills',
    title: 'Compétences',
    icon: I(VScode, 'VSCode'),
    defaultPos: { x: 120, y: 52 },
    defaultSize: { width: 900, height: 560 },
  },
  {
    id: 'experience',
    title: 'Expériences',
    icon: I(taskImg, 'Expériences'),
    defaultPos: { x: 160, y: 72 },
    defaultSize: { width: 820, height: 540 },
  },
  {
    id: 'projects',
    title: 'Projets',
    icon: I(dossierImg, 'Projets'),
    defaultPos: { x: 130, y: 56 },
    defaultSize: { width: 940, height: 580 },
  },
  {
    id: 'contact',
    title: 'Mail',
    icon: I(OutlookImg, 'Mail'),
    defaultPos: { x: 180, y: 80 },
    defaultSize: { width: 820, height: 540 },
  },
  {
    id: 'cv',
    title: 'Mon CV',
    icon: I(canvaImg, 'Mon CV'),
    defaultPos: { x: 160, y: 20 },
    defaultSize: { width: 780, height: 2000 },
  },
  {
    id: 'hobbies',
    title: 'Hobbies',
    icon: I(dofusImg, 'Hobbies'),
    defaultPos: { x: 110, y: 52 },
    defaultSize: { width: 920, height: 530 },
  },
  {
    id: 'spotify',
    title: 'Music',
    icon: I(musicImg, 'Music'),
    defaultPos: { x: 150, y: 66 },
    defaultSize: { width: 860, height: 520 },
  },
  {
    id: 'terminal',
    title: 'Terminal',
    icon: I(terminalImg, 'Terminal'),
    defaultPos: { x: 200, y: 88 },
    defaultSize: { width: 740, height: 460 },
  },
]

const INITIAL_WIN_STATE = APPS.map((app) => ({
  id: app.id,
  isOpen: false,
  isMinimized: false,
  zIndex: 1,
}))

const BOOT_LINES = [
  'Initialisation du noyau…',
  'Chargement des modules…',
  'Démarrage de l\'interface…',
  'Bienvenue, Tony.',
]

function BootScreen({ onDone }) {
  const [phase, setPhase]   = useState(0)
  const [lineIdx, setLineIdx] = useState(0)

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 400)
    const t2 = setTimeout(() => setLineIdx(1), 900)
    const t3 = setTimeout(() => setLineIdx(2), 1400)
    const t4 = setTimeout(() => setLineIdx(3), 1900)
    const t5 = setTimeout(() => setPhase(2), 2400)
    const t6 = setTimeout(onDone, 2900)
    return () => [t1, t2, t3, t4, t5, t6].forEach(clearTimeout)
  }, [onDone])

  return (
    <div className={`os-boot${phase === 2 ? ' os-boot-out' : ''}`}>
      <div className="os-boot-inner">
        <div className="os-boot-logo">TonyOS</div>
        <div className="os-boot-ver">v1.0.0 · Full Stack Developer</div>
        {phase >= 1 && (
          <>
            <div className="os-boot-bar">
              <div className="os-boot-bar-fill" />
            </div>
            <div className="os-boot-lines">
              {BOOT_LINES.slice(0, lineIdx + 1).map((l, i) => (
                <div key={i} className="os-boot-line">&gt; {l}</div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function AppLoader() {
  return (
    <div className="os-lazy-loader">
      <span className="os-lazy-dot" /><span className="os-lazy-dot" /><span className="os-lazy-dot" />
    </div>
  )
}

function Desktop({ theme, onToggleTheme, onSwitchToMobile }) {
  const [windows, setWindows] = useState(INITIAL_WIN_STATE)
  const [volume,  setVolume]  = useState(0.7)
  const [booting, setBooting] = useState(() => sessionStorage.getItem('tonyos_boot') !== '1')
  const maxZRef = useRef(APPS.length + 1)

  const openWindow = useCallback((id) => {
    maxZRef.current++
    const z = maxZRef.current
    setWindows(ws => {
      const exists = ws.some(w => w.id === id)
      if (!exists) return [...ws, { id, isOpen: true, isMinimized: false, zIndex: z }]
      return ws.map(w => w.id === id ? { ...w, isOpen: true, isMinimized: false, zIndex: z } : w)
    })
  }, [])

  const closeWindow = useCallback((id) => {
    setWindows(ws => ws.map(w => w.id === id ? { ...w, isOpen: false } : w))
  }, [])

  const minimizeWindow = useCallback((id) => {
    setWindows(ws => ws.map(w => w.id === id ? { ...w, isMinimized: !w.isMinimized } : w))
  }, [])

  const focusWindow = useCallback((id) => {
    maxZRef.current++
    const z = maxZRef.current
    setWindows(ws => ws.map(w =>
      w.id === id ? { ...w, zIndex: z, isMinimized: false } : w
    ))
  }, [])

  const handleIconClick = useCallback((id) => {
    const win = windows.find(w => w.id === id)
    if (win?.isOpen && !win.isMinimized) {
      focusWindow(id)
    } else {
      openWindow(id)
    }
  }, [windows, focusWindow, openWindow])

  const handleBootDone = useCallback(() => {
    sessionStorage.setItem('tonyos_boot', '1')
    setBooting(false)
  }, [])

  useEffect(() => {
    if (booting) return
    const t = setTimeout(() => openWindow('terminal'), 600)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [booting])

  const renderContent = (id) => (
    <Suspense fallback={<AppLoader />}>
      {(() => {
        switch (id) {
          case 'about':      return <Presentation />
          case 'skills':     return <VSCodeSkills />
          case 'experience': return <Experiences />
          case 'projects':   return <Projets />
          case 'contact':    return <MailApp />
          case 'cv':         return <CVViewer />
          case 'hobbies':    return <HobbiesGame />
          case 'spotify':    return <SpotifyApp volume={volume} onVolumeChange={setVolume} />
          case 'terminal':   return <Terminal onClose={() => closeWindow('terminal')} onOpenApp={openWindow} />
          default:           return null
        }
      })()}
    </Suspense>
  )

  return (
    <div className="os-desktop">
      {booting && <BootScreen onDone={handleBootDone} />}

      <div className="os-wallpaper" aria-hidden="true">
        <span className="os-wallpaper-name">Tony Cseresznyak</span>
        <span className="os-wallpaper-role">Full Stack Developer</span>
      </div>

      <div className="os-icons-col" role="list" aria-label="Applications du bureau">
        {APPS.map(app => {
          const win = windows.find(w => w.id === app.id)
          return (
            <DesktopIcon
              key={app.id}
              icon={app.icon}
              label={app.title}
              isOpen={win?.isOpen && !win?.isMinimized}
              onClick={() => handleIconClick(app.id)}
            />
          )
        })}
      </div>

      {APPS.map(app => {
        const win = windows.find(w => w.id === app.id)
        return (
          <Window
            key={app.id}
            id={app.id}
            title={app.title}
            icon={app.icon}
            defaultPosition={app.defaultPos}
            defaultSize={app.defaultSize}
            isOpen={win?.isOpen}
            isMinimized={win?.isMinimized}
            zIndex={win?.zIndex}
            onFocus={focusWindow}
            onClose={closeWindow}
            onMinimize={minimizeWindow}
          >
            {renderContent(app.id)}
          </Window>
        )
      })}

      <Taskbar
        apps={APPS}
        windows={windows}
        onFocusWindow={focusWindow}
        onMinimizeWindow={minimizeWindow}
        onOpenWindow={openWindow}
        isDark={theme === 'dark'}
        onToggleTheme={onToggleTheme}
        volume={volume}
        onVolumeChange={setVolume}
        onSwitchToMobile={onSwitchToMobile}
      />
    </div>
  )
}

export default Desktop
