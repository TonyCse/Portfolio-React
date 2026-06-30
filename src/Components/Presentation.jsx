import React, { useRef, useCallback } from 'react'
import photo from '../images/photoCV.png'

const TONY_EMAIL    = 'tonycseresznyak@hotmail.com'
const TONY_LINKEDIN = 'https://www.linkedin.com/in/tony-cseresznyak'
const TONY_GITHUB   = 'https://github.com/TonyCse'

function Presentation() {
  const sceneRef = useRef(null)
  const cardRef  = useRef(null)
  const rafRef   = useRef(null)

  const onMouseMove = useCallback((e) => {
    const scene = sceneRef.current
    const card  = cardRef.current
    if (!scene || !card) return
    const rect = scene.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width  - 0.5
    const y = (e.clientY - rect.top)  / rect.height - 0.5
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(() => {
      card.style.transition = 'transform 0.08s linear, box-shadow 0.08s linear'
      card.style.transform  = `perspective(900px) rotateX(${-y * 16}deg) rotateY(${x * 20}deg) scale(1.03)`
      card.style.boxShadow  = `
        ${-x * 24}px ${-y * 20}px 60px rgba(168,85,247,0.25),
        0 32px 80px rgba(0,0,0,0.55),
        inset 0 1px 0 rgba(255,255,255,0.07)`
    })
  }, [])

  const onMouseLeave = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    const card = cardRef.current
    if (!card) return
    card.style.transition = 'transform 0.65s cubic-bezier(0.23,1,0.32,1), box-shadow 0.65s ease'
    card.style.transform  = 'perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)'
    card.style.boxShadow  = ''
  }, [])

  const copyEmail = () => navigator.clipboard?.writeText(TONY_EMAIL).catch(() => {})

  return (
    <section
      id="presentation"
      className="card3d-section"
      ref={sceneRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      <div className="card3d" ref={cardRef}>
        {/* Ambient orbs */}
        <div className="card3d-orb card3d-orb1" aria-hidden="true" />
        <div className="card3d-orb card3d-orb2" aria-hidden="true" />

        {/* ── TOP : photo + identity ── */}
        <div className="card3d-top">
          <div className="card3d-photo-col" style={{ transform: 'translateZ(28px)' }}>
            <div className="card3d-photo-ring">
              <img src={photo} alt="Tony Cseresznyak" className="card3d-photo" />
            </div>
            <div className="card3d-avail">
              <span className="card3d-pulse" />
              Disponible · Open to work
            </div>
          </div>

          <div className="card3d-identity" style={{ transform: 'translateZ(18px)' }}>
            <h1 className="card3d-name">Tony Cseresznyak</h1>
            <span className="card3d-role-badge">Full Stack Developer</span>
            <p className="card3d-sub">🎓 Cloud Campus Paris · Bac+4</p>
            <p className="card3d-loc">📍 Paris, Île-de-France</p>
          </div>
        </div>

        {/* ── SEPARATOR ── */}
        <div className="card3d-line" aria-hidden="true" />

        {/* ── BOTTOM : bio + contact ── */}
        <div className="card3d-bottom">
          <div className="card3d-bio" style={{ transform: 'translateZ(10px)' }}>
            <p>
              Développeur Full Stack passionné par la création d'expériences web modernes et de projets innovants.
            </p>
            <div className="card3d-tags">
              {['JavaScript', 'React', 'Next.js', 'Laravel'].map(t => (
                <span key={t} className="card3d-tag">{t}</span>
              ))}
            </div>
          </div>

          <div className="card3d-links" style={{ transform: 'translateZ(16px)' }}>
            <a href={`mailto:${TONY_EMAIL}`} className="card3d-link">
              <span className="card3d-link-ico">📧</span>
              <span className="card3d-link-val">{TONY_EMAIL}</span>
            </a>
            <a href={TONY_LINKEDIN} target="_blank" rel="noopener noreferrer" className="card3d-link">
              <span className="card3d-link-ico">💼</span>
              <span className="card3d-link-val">linkedin.com/in/tony-cseresznyak</span>
            </a>
            <a href={TONY_GITHUB} target="_blank" rel="noopener noreferrer" className="card3d-link">
              <span className="card3d-link-ico">🐙</span>
              <span className="card3d-link-val">github.com/TonyCse</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Presentation
