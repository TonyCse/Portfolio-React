import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub, faLinkedin, faYoutube } from '@fortawesome/free-brands-svg-icons'
import { faEnvelope, faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons'
import LaserFlow from './LaserFlow'

const NAV_LINKS = [
  { label: 'À propos',    href: '#presentation' },
  { label: 'Stack',       href: '#skills'       },
  { label: 'Expériences', href: '#experiences'  },
  { label: 'Projets',     href: '#projets'      },
  { label: 'Contact',     href: '#contact'      },
]

const SOCIAL_LINKS = [
  { label: 'Email',    href: 'mailto:tonycseresznyak@hotmail.com', icon: faEnvelope,  external: false },
  { label: 'GitHub',   href: 'https://github.com/TonyCse',         icon: faGithub,    external: true  },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/tony-cseresznyak/', icon: faLinkedin, external: true },
  { label: 'YouTube',  href: 'https://www.youtube.com/channel/UCCkt7tnefsVbFLFuNkM09Rw', icon: faYoutube, external: true },
]

function Contact() {
  return (
    <>
      <section id="contact" aria-labelledby="contact-title" data-aos="fade-up" data-aos-duration="800">
        <div className="contact-wrapper">
          <p className="contact-eyebrow" aria-hidden="true">05</p>
          <h2 id="contact-title" className="contact-heading">Travaillons ensemble.</h2>
          <p className="contact-sub">
            Développeur full stack disponible pour de nouvelles opportunités.
            Que ce soit pour un poste, du freelance ou simplement un échange —
            ma boîte mail est ouverte.
          </p>

          <a
            href="mailto:tonycseresznyak@hotmail.com"
            className="contact-email"
            aria-label="Envoyer un e-mail à Tony Cseresznyak"
          >
            <FontAwesomeIcon icon={faEnvelope} aria-hidden="true" />
            tonycseresznyak@hotmail.com
          </a>

          <nav className="contact-socials" aria-label="Réseaux sociaux">
            <a href="https://github.com/TonyCse" target="_blank" rel="noreferrer" aria-label="GitHub de Tony Cseresznyak">
              <FontAwesomeIcon icon={faGithub} aria-hidden="true" />
            </a>
            <a href="https://www.linkedin.com/in/tony-cseresznyak/" target="_blank" rel="noreferrer" aria-label="LinkedIn de Tony Cseresznyak">
              <FontAwesomeIcon icon={faLinkedin} aria-hidden="true" />
            </a>
            <a href="https://www.youtube.com/channel/UCCkt7tnefsVbFLFuNkM09Rw" target="_blank" rel="noreferrer" aria-label="Chaîne YouTube de Tony Cseresznyak">
              <FontAwesomeIcon icon={faYoutube} aria-hidden="true" />
            </a>
          </nav>
        </div>
      </section>

      <footer className="site-footer" aria-label="Pied de page">
        {/* LaserFlow background — container extends above footer for no hard cutoff */}
        <div className="footer-laser-wrap" aria-hidden="true">
          <LaserFlow
            color="#a476ff"
            horizontalBeamOffset={0.0}
            verticalBeamOffset={0.0}
            wispDensity={0.6}
            wispIntensity={3.5}
            fogIntensity={0.5}
            horizontalSizing={0.8}
            verticalSizing={0.001}
            flowStrength={0.3}
            fogFallSpeed={0.4}
          />
        </div>

        <div className="footer-inner">
          {/* Brand */}
          <div className="footer-brand">
            <span className="footer-name">Tony Cseresznyak</span>
            <span className="footer-role">Développeur Full Stack</span>
            <span className="footer-status">
              <span className="footer-status-dot" aria-hidden="true" />
              Disponible pour de nouvelles opportunités
            </span>
          </div>

          {/* Navigation */}
          <div className="footer-col">
            <span className="footer-col-title">Navigation</span>
            <ul className="footer-link-list">
              {NAV_LINKS.map(({ label, href }) => (
                <li key={href}>
                  <a href={href}>{label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact / Social */}
          <div className="footer-col">
            <span className="footer-col-title">Contact</span>
            <ul className="footer-link-list">
              {SOCIAL_LINKS.map(({ label, href, icon, external }) => (
                <li key={label}>
                  <a
                    href={href}
                    {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
                    aria-label={label}
                  >
                    <FontAwesomeIcon icon={icon} aria-hidden="true" />
                    {label}
                    {external && <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="footer-ext-icon" aria-hidden="true" />}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>Développé avec React · Déployé sur Vercel</span>
          <span>© 2026 Tony Cseresznyak</span>
        </div>
      </footer>
    </>
  )
}

export default Contact
