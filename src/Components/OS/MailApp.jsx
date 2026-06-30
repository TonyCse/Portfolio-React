import React, { useState } from 'react'
import emailjs from '@emailjs/browser'
import './MailApp.css'
import avatarContact from '../../images/avatarcontact.png'

const EJS_SERVICE  = process.env.REACT_APP_EMAILJS_SERVICE_ID
const EJS_TEMPLATE = process.env.REACT_APP_EMAILJS_TEMPLATE_ID
const EJS_KEY      = process.env.REACT_APP_EMAILJS_PUBLIC_KEY

const TONY_EMAIL    = 'tonycseresznyak@hotmail.com'
const TONY_LINKEDIN = 'https://www.linkedin.com/in/tony-cseresznyak'
const TONY_GITHUB   = 'https://github.com/TonyCse'

const FOLDERS = [
  { id: 'inbox',  icon: '📥', label: 'Boîte de réception', count: 2 },
  { id: 'sent',   icon: '📤', label: 'Envoyés',            count: 0 },
]

const EMAILS = {
  inbox: [
    {
      id: 1,
      from: 'Tony Cseresznyak',
      email: TONY_EMAIL,
      subject: '👋 Bienvenue sur mon portfolio',
      preview: 'Bonjour ! Je suis Tony, développeur Full Stack basé à Paris. Retrouvez ici mes coordonnées directes…',
      time: "Aujourd'hui",
      unread: true,
      body: `Bonjour et bienvenue sur mon portfolio interactif ! 👋

Je m'appelle Tony Cseresznyak, développeur Full Stack passionné par React, Node.js et Laravel.

Actuellement en alternance Bac+4 à Cloud Campus Paris, je recherche des opportunités de missions freelance ou d'un poste en CDI à partir de 2026.

N'hésitez pas à me contacter directement :

📧  ${TONY_EMAIL}
💼  linkedin.com/in/tony-cseresznyak
🐙  github.com/TonyCse

Je réponds généralement sous 24h.

À bientôt,
Tony`,
    },
    {
      id: 2,
      from: 'GitHub Notifications',
      email: 'noreply@github.com',
      subject: '✅ Deploy réussi · Portfolio-React → Vercel',
      preview: 'Action GitHub Actions exécutée avec succès. Portfolio-React est en ligne sur Vercel.',
      time: 'Hier',
      unread: false,
      body: `Action completed successfully ✅

Repository : TonyCse/Portfolio-React
Branch : main
Workflow : Deploy to Vercel
Duration : 1m 43s

✓ npm install     (12.3s)
✓ npm run build   (45.8s)
✓ Deploy Vercel   (23.1s)

Aucune erreur détectée.`,
    },
  ],
  sent: [],
}

/* ── Compose modal with real EmailJS send ─────────────────────────── */
function ComposeModal({ onClose }) {
  const [name,   setName]   = useState('')
  const [from,   setFrom]   = useState('')
  const [subj,   setSubj]   = useState('')
  const [body,   setBody]   = useState('')
  const [status, setStatus] = useState('idle') // idle | sending | sent | error

  const isConfigured = EJS_SERVICE && EJS_TEMPLATE && EJS_KEY &&
    !EJS_SERVICE.startsWith('YOUR_') && !EJS_TEMPLATE.startsWith('YOUR_')

  const handleSend = async () => {
    if (!name || !from || !subj || !body) return

    if (!isConfigured) {
      console.warn('[MailApp] EmailJS non configuré — variables manquantes dans le build')
      const mailto = `mailto:${TONY_EMAIL}?subject=${encodeURIComponent(subj)}&body=${encodeURIComponent(`De : ${name} <${from}>\n\n${body}`)}`
      window.open(mailto)
      setStatus('sent')
      setTimeout(onClose, 1800)
      return
    }

    setStatus('sending')
    try {
      await emailjs.send(
        EJS_SERVICE,
        EJS_TEMPLATE,
        { name, email: from, title: subj, message: body },
        EJS_KEY,
      )
      setStatus('sent')
      setTimeout(onClose, 2000)
    } catch {
      setStatus('error')
    }
  }

  const busy = status === 'sending'

  return (
    <div className="mail-compose-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="mail-compose">
        <div className="mail-compose-header">
          <span className="mail-compose-title">✉️ Nouveau message</span>
          <button className="mail-compose-close" onClick={onClose}>✕</button>
        </div>

        {status === 'sent' && (
          <div className="mail-compose-sent">
            <span>✅</span>
            <span>Message envoyé ! Je vous répondrai sous 24h.</span>
          </div>
        )}

        {status === 'error' && (
          <div className="mail-compose-error">
            <span>❌ Erreur d'envoi.{' '}
              <a href={`mailto:${TONY_EMAIL}`} className="mail-error-fallback">Contactez-moi directement</a>
            </span>
            <button className="mail-error-retry" onClick={() => setStatus('idle')}>Réessayer</button>
          </div>
        )}

        {(status === 'idle' || status === 'sending') && (
          <>
            <div className="mail-compose-to-row">
              <span className="mail-compose-to-label">À :</span>
              <span className="mail-compose-to-val">{TONY_EMAIL}</span>
            </div>
            <div className="mail-compose-field">
              <label>Votre nom :</label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Prénom Nom" disabled={busy} />
            </div>
            <div className="mail-compose-field">
              <label>Votre email :</label>
              <input type="email" value={from} onChange={e => setFrom(e.target.value)} placeholder="vous@example.com" disabled={busy} />
            </div>
            <div className="mail-compose-field">
              <label>Objet :</label>
              <input value={subj} onChange={e => setSubj(e.target.value)} placeholder="Objet" disabled={busy} />
            </div>
            <textarea
              className="mail-compose-body"
              value={body}
              onChange={e => setBody(e.target.value)}
              placeholder="Votre message…"
              disabled={busy}
            />
            <div className="mail-compose-actions">
              <button
                className={`mail-compose-send${busy ? ' mail-compose-sending' : ''}`}
                onClick={handleSend}
                disabled={busy || !name || !from || !subj || !body}
              >
                {busy ? '⏳ Envoi…' : '📤 Envoyer'}
              </button>
              <button className="mail-compose-discard" onClick={onClose}>Annuler</button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

/* ── Contact card shown in viewer by default ───────────────────── */
function ContactCard({ onCompose }) {
  const copyEmail = () => {
    navigator.clipboard?.writeText(TONY_EMAIL).catch(() => {})
  }

  return (
    <div className="mail-contact-card">
      <img src={avatarContact} alt="Tony" className="mail-cc-avatar" />
      <div className="mail-cc-name">Tony Cseresznyak</div>
      <div className="mail-cc-role">Développeur Full Stack · Paris</div>
      <div className="mail-cc-status"><span className="mail-cc-dot" />Disponible</div>

      <div className="mail-cc-links">
        <div className="mail-cc-link-row">
          <span className="mail-cc-link-icon">📧</span>
          <a href={`mailto:${TONY_EMAIL}`} className="mail-cc-link-val">{TONY_EMAIL}</a>
          <button className="mail-cc-copy" onClick={copyEmail} title="Copier">📋</button>
        </div>
        <div className="mail-cc-link-row">
          <span className="mail-cc-link-icon">💼</span>
          <a href={TONY_LINKEDIN} target="_blank" rel="noopener noreferrer" className="mail-cc-link-val">
            linkedin.com/in/tony-cseresznyak
          </a>
          <a href={TONY_LINKEDIN} target="_blank" rel="noopener noreferrer" className="mail-cc-copy">↗</a>
        </div>
        <div className="mail-cc-link-row">
          <span className="mail-cc-link-icon">🐙</span>
          <a href={TONY_GITHUB} target="_blank" rel="noopener noreferrer" className="mail-cc-link-val">
            github.com/TonyCse
          </a>
          <a href={TONY_GITHUB} target="_blank" rel="noopener noreferrer" className="mail-cc-copy">↗</a>
        </div>
      </div>

      <div className="mail-cc-actions">
        <button className="mail-cc-btn mail-cc-btn-primary" onClick={onCompose}>
          ✏️ Envoyer un message
        </button>
      </div>
    </div>
  )
}

function MailApp() {
  const [folder,   setFolder]   = useState('inbox')
  const [selected, setSelected] = useState(null)
  const [compose,  setCompose]  = useState(false)

  const emails = EMAILS[folder] || []

  return (
    <div className="mail-root">
      {/* ── Sidebar ── */}
      <div className="mail-sidebar">
        <div className="mail-account">
          <img src={avatarContact} alt="Tony" className="mail-account-avatar" />
          <div className="mail-account-info">
            <div className="mail-account-name">Tony Cseresznyak</div>
            <div className="mail-account-email">{TONY_EMAIL}</div>
          </div>
        </div>

        <button className="mail-compose-btn" onClick={() => setCompose(true)}>
          ✏️ Nouveau message
        </button>

        <nav className="mail-folders">
          {FOLDERS.map(f => (
            <button
              key={f.id}
              className={`mail-folder-btn${folder === f.id ? ' mail-folder-active' : ''}`}
              onClick={() => { setFolder(f.id); setSelected(null) }}
            >
              <span className="mail-folder-icon">{f.icon}</span>
              <span className="mail-folder-label">{f.label}</span>
              {f.count > 0 && <span className="mail-folder-badge">{f.count}</span>}
            </button>
          ))}
        </nav>

        <div className="mail-sidebar-contacts">
          <div className="mail-contacts-title">Mes contacts</div>
          <a href={`mailto:${TONY_EMAIL}`} className="mail-contact-link">
            <span>📧</span><span>Email direct</span>
          </a>
          <a href={TONY_LINKEDIN} target="_blank" rel="noopener noreferrer" className="mail-contact-link">
            <span>💼</span><span>LinkedIn</span>
          </a>
          <a href={TONY_GITHUB} target="_blank" rel="noopener noreferrer" className="mail-contact-link">
            <span>🐙</span><span>GitHub</span>
          </a>
        </div>
      </div>

      {/* ── Email list ── */}
      <div className="mail-list">
        <div className="mail-list-header">
          <span className="mail-list-title">
            {FOLDERS.find(f => f.id === folder)?.icon}{' '}
            {FOLDERS.find(f => f.id === folder)?.label}
          </span>
          <span className="mail-list-count">{emails.length}</span>
        </div>
        {emails.length === 0
          ? <div className="mail-list-empty">Aucun message</div>
          : emails.map(email => (
            <button
              key={email.id}
              className={`mail-item${selected?.id === email.id ? ' mail-item-active' : ''}${email.unread ? ' mail-item-unread' : ''}`}
              onClick={() => setSelected(email)}
            >
              {email.unread && <div className="mail-unread-dot" />}
              <div className="mail-item-from">{email.from}</div>
              <div className="mail-item-subject">{email.subject}</div>
              <div className="mail-item-preview">{email.preview}</div>
              <div className="mail-item-time">{email.time}</div>
            </button>
          ))
        }
      </div>

      {/* ── Viewer ── */}
      <div className="mail-viewer">
        {selected ? (
          <>
            <div className="mail-viewer-header">
              <button className="mail-viewer-back" onClick={() => setSelected(null)}>← Retour</button>
              <h2 className="mail-viewer-subject">{selected.subject}</h2>
              <div className="mail-viewer-meta">
                {selected.email === TONY_EMAIL
                  ? <img src={avatarContact} alt="Tony" className="mail-viewer-avatar" />
                  : <div className="mail-viewer-avatar">{selected.from[0]}</div>
                }
                <div className="mail-viewer-from-info">
                  <span className="mail-viewer-from-name">{selected.from}</span>
                  <span className="mail-viewer-from-email">&lt;{selected.email}&gt;</span>
                </div>
                <span className="mail-viewer-time">{selected.time}</span>
              </div>
            </div>
            <div className="mail-viewer-body">
              <pre className="mail-viewer-text">{selected.body}</pre>
            </div>
            <div className="mail-viewer-actions">
              <button className="mail-action-btn" onClick={() => setCompose(true)}>↩ Répondre</button>
              <button className="mail-action-btn">↪ Transférer</button>
            </div>
          </>
        ) : (
          <ContactCard onCompose={() => setCompose(true)} />
        )}
      </div>

      {compose && (
        <ComposeModal onClose={() => setCompose(false)} />
      )}
    </div>
  )
}

export default MailApp
