import React, { useState, useEffect, useCallback } from 'react'
import Desktop   from './Components/OS/Desktop'
import MobileOS  from './Components/OS/MobileOS'
import LiquidEther from './Components/LiquidEther'
import 'aos/dist/aos.css'
import AOS from 'aos'

function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark')
  const [isMobile, setIsMobile] = useState(() => window.matchMedia('(max-width: 768px)').matches)

  useEffect(() => {
    AOS.init({ once: true, offset: 60, duration: 700, easing: 'ease-out-cubic' })
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)')
    const onChange = (e) => setIsMobile(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const [forcedMobile,    setForcedMobile]    = useState(null)
  const [desktopHint,     setDesktopHint]     = useState(false)
  const showMobile = forcedMobile !== null ? forcedMobile : isMobile
  const switchToMobile  = useCallback(() => setForcedMobile(true), [])
  const switchToDesktop = useCallback(() => {
    setForcedMobile(false)
    if (window.innerWidth < 800) {
      setDesktopHint(true)
      setTimeout(() => setDesktopHint(false), 6000)
    }
  }, [])

  useEffect(() => {
    const forced = forcedMobile === false && isMobile
    if (forced) {
      document.body.classList.add('force-desktop-mode')
    } else {
      document.body.classList.remove('force-desktop-mode')
    }
  }, [forcedMobile, isMobile])

  const toggleTheme = useCallback(() => setTheme(t => t === 'dark' ? 'light' : 'dark'), [])

  const onMouseMove = useCallback((e) => {
    document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`)
    document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`)
  }, [])

  return (
    <div className="App" onMouseMove={onMouseMove}>
      <LiquidEther
        colors={['#a476ff', '#38D9FF', '#F472B6']}
        mouseForce={20}
        cursorSize={100}
        resolution={0.5}
        iterationsPoisson={32}
        autoDemo={true}
        autoSpeed={0.5}
        autoIntensity={2.2}
        autoResumeDelay={3000}
        autoRampDuration={0.6}
        style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}
      />

      {showMobile
        ? <MobileOS  theme={theme} onToggleTheme={toggleTheme} onSwitchToDesktop={switchToDesktop} />
        : <Desktop   theme={theme} onToggleTheme={toggleTheme} onSwitchToMobile={switchToMobile} />
      }

      {desktopHint && (
        <div className="app-desktop-hint">
          <span className="app-desktop-hint-icon">🖥️</span>
          <span className="app-desktop-hint-text">
            Le mode desktop est optimisé pour les grands écrans — pour une meilleure expérience, ouvre ce portfolio sur un PC.
          </span>
          <button className="app-desktop-hint-close" onClick={() => setDesktopHint(false)}>✕</button>
        </div>
      )}
    </div>
  )
}

export default App
