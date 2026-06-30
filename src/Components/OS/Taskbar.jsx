import React, { useState, useEffect, useRef } from 'react'
import photo from '../../images/photoCV.png'
import avatarClindoeil from '../../images/avatarclindoeil.png'
import OutlookImg  from '../../images/Outlook.png'
import terminalImg from '../../images/terminal.png'
import aproposImg  from '../../images/a-propos.webp'
import dossierImg  from '../../images/dossier.avif'
import canvaImg    from '../../images/canva.png'
import VScode      from '../../images/VScode.png'
import dofusImg    from '../../images/dofus.png'
import musicImg    from '../../images/music.png'

const SunIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
)
const MoonIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
)

const fmt = () => new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })

function ProfilePanel({ onOpenApp, onClose }) {
  const ref = useRef(null)
  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose()
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [onClose])

  const shortcuts = [
    { id: 'about',      icon: <img src={aproposImg}  alt="À propos"    className="app-icon-img" />, label: 'À propos' },
    { id: 'skills',     icon: <img src={VScode}      alt="Compétences" className="app-icon-img" />, label: 'Compétences' },
    { id: 'projects',   icon: <img src={dossierImg}  alt="Projets"     className="app-icon-img" />, label: 'Projets' },
    { id: 'hobbies',    icon: <img src={dofusImg}    alt="Hobbies"     className="app-icon-img" />, label: 'Hobbies' },
    { id: 'spotify',    icon: <img src={musicImg}    alt="Music"       className="app-icon-img" />, label: 'Music' },
    { id: 'cv',         icon: <img src={canvaImg}    alt="Mon CV"      className="app-icon-img" />, label: 'Mon CV' },
    { id: 'terminal',   icon: <img src={terminalImg} alt="Terminal"    className="app-icon-img" />, label: 'Terminal' },
    { id: 'contact',    icon: <img src={OutlookImg}  alt="Mail"        className="app-icon-img" />, label: 'Mail' },
  ]

  return (
    <div className="tb-profile-panel" ref={ref}>
      <div className="tb-pp-header">
        <img src={photo} alt="Tony" className="tb-pp-photo" />
        <div className="tb-pp-info">
          <div className="tb-pp-name">Tony Cseresznyak</div>
          <div className="tb-pp-status">
            <span className="tb-pp-dot" />
            <span>Disponible</span>
          </div>
        </div>
      </div>

      <div className="tb-pp-sep" />


      <div className="tb-pp-shortcuts">
        <div className="tb-pp-shortcuts-title">Accès rapide</div>
        {shortcuts.map(s => (
          <button key={s.id} className="tb-pp-shortcut" onClick={() => { onOpenApp(s.id); onClose() }}>
            <span className="tb-pp-shortcut-icon">{s.icon}</span>
            <span className="tb-pp-shortcut-label">{s.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

function VolumeControl({ volume, onVolumeChange }) {
  const [show, setShow] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!show) return
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setShow(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [show])

  const volIcon = volume === 0 ? '🔇' : volume < 0.35 ? '🔈' : volume < 0.7 ? '🔉' : '🔊'

  return (
    <div className="taskbar-vol-wrap" ref={ref}>
      <button
        className={`taskbar-vol-icon-btn${show ? ' taskbar-vol-active' : ''}`}
        onClick={() => setShow(v => !v)}
        title="Volume"
        aria-label="Régler le volume"
      >
        {volIcon}
      </button>

      {show && (
        <div className="taskbar-vol-popup">
          <div className="taskbar-vol-top">
            <span className="taskbar-vol-label">Volume</span>
            <span className="taskbar-vol-pct">{Math.round(volume * 100)}%</span>
          </div>
          <div className="taskbar-vol-track-wrap">
            <span className="taskbar-vol-icon-small">{volume === 0 ? '🔇' : '🔈'}</span>
            <input
              type="range"
              className="taskbar-vol-slider"
              min={0} max={1} step={0.02}
              value={volume}
              onChange={e => onVolumeChange(parseFloat(e.target.value))}
              aria-label="Volume système"
            />
            <span className="taskbar-vol-icon-small">🔊</span>
          </div>
          <button
            className="taskbar-vol-mute"
            onClick={() => onVolumeChange(volume > 0 ? 0 : 0.7)}
          >
            {volume === 0 ? '🔇 Activer le son' : '🔇 Couper le son'}
          </button>
        </div>
      )}
    </div>
  )
}

function Taskbar({ apps, windows, onFocusWindow, onMinimizeWindow, onOpenWindow, isDark, onToggleTheme, volume, onVolumeChange, onSwitchToMobile }) {
  const [time, setTime]         = useState(fmt)
  const [showProfile, setShowProfile] = useState(false)

  useEffect(() => {
    const id = setInterval(() => setTime(fmt()), 15000)
    return () => clearInterval(id)
  }, [])

  const openWindows = apps.filter(app => {
    const win = windows.find(w => w.id === app.id)
    return win?.isOpen
  })

  const handleOpenApp = (id) => {
    const win = windows.find(w => w.id === id)
    if (win?.isOpen && !win.isMinimized) onFocusWindow(id)
    else onOpenWindow(id)
  }

  return (
    <div className="os-taskbar" role="navigation" aria-label="Barre des tâches">

      {/* ── LEFT: profile + sep + open apps ── */}
      <div className="taskbar-left">
        {/* Profile button */}
        <div className="taskbar-profile-wrap">
          <button
            className={`taskbar-profile-btn${showProfile ? ' taskbar-profile-active' : ''}`}
            onClick={() => setShowProfile(p => !p)}
            title="Mon profil"
            aria-label="Ouvrir le profil"
          >
            <img src={avatarClindoeil} alt="Tony" className="taskbar-profile-photo" />
          </button>
          {showProfile && (
            <ProfilePanel onOpenApp={handleOpenApp} onClose={() => setShowProfile(false)} />
          )}
        </div>

        {/* Separator */}
        <div className="taskbar-profile-sep" aria-hidden="true" />

        {/* Open app buttons */}
        <div className="taskbar-apps">
          {openWindows.length === 0 && (
            <span className="taskbar-empty-hint">Aucune fenêtre ouverte</span>
          )}
          {openWindows.map(app => {
            const win = windows.find(w => w.id === app.id)
            const isMinimized = win?.isMinimized
            return (
              <button
                key={app.id}
                className={`taskbar-app-btn taskbar-app-open${isMinimized ? ' taskbar-app-minimized' : ''}`}
                onClick={() => isMinimized ? onMinimizeWindow(app.id) : onFocusWindow(app.id)}
                title={app.title}
              >
                <span className="taskbar-app-icon" aria-hidden="true">{app.icon}</span>
                <span className="taskbar-app-label">{app.title}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* ── RIGHT: volume + theme + clock ── */}
      <div className="taskbar-right">

        <div className="taskbar-sep" aria-hidden="true" />
        <button
          className="taskbar-mode-btn"
          onClick={onSwitchToMobile}
          title="Passer en vue portable"
          aria-label="Vue portable"
        >
          📱
        </button>
        <VolumeControl volume={volume} onVolumeChange={onVolumeChange} />

        <button
          className="taskbar-theme-btn"
          onClick={onToggleTheme}
          aria-label={isDark ? 'Passer en mode clair' : 'Passer en mode sombre'}
        >
          {isDark ? <SunIcon /> : <MoonIcon />}
        </button>

        <div className="taskbar-clock" aria-label={`Heure : ${time}`}>{time}</div>
      </div>
    </div>
  )
}

export default Taskbar
