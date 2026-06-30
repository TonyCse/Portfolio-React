import React from 'react'

function DesktopIcon({ icon, label, isOpen, onClick }) {
  return (
    <button
      role="listitem"
      className={`desktop-icon${isOpen ? ' desktop-icon-open' : ''}`}
      onClick={onClick}
      title={label}
      aria-label={`Ouvrir ${label}`}
    >
      <div className="desktop-icon-emoji" aria-hidden="true">{icon}</div>
      <span className="desktop-icon-label">{label}</span>
    </button>
  )
}

export default DesktopIcon
