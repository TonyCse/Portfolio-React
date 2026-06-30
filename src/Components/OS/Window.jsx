import React, { useState, useCallback } from 'react'

const MIN_W = 300
const MIN_H = 180

const HANDLES = [
  { dir: 'n',  style: { top: -4, left: 8, right: 8, height: 8, cursor: 'n-resize' } },
  { dir: 's',  style: { bottom: -4, left: 8, right: 8, height: 8, cursor: 's-resize' } },
  { dir: 'e',  style: { top: 8, right: -4, bottom: 8, width: 8, cursor: 'e-resize' } },
  { dir: 'w',  style: { top: 8, left: -4, bottom: 8, width: 8, cursor: 'w-resize' } },
  { dir: 'ne', style: { top: -4, right: -4, width: 14, height: 14, cursor: 'ne-resize' } },
  { dir: 'nw', style: { top: -4, left: -4, width: 14, height: 14, cursor: 'nw-resize' } },
  { dir: 'se', style: { bottom: -4, right: -4, width: 14, height: 14, cursor: 'se-resize' } },
  { dir: 'sw', style: { bottom: -4, left: -4, width: 14, height: 14, cursor: 'sw-resize' } },
]

function Window({
  id,
  title,
  icon,
  children,
  defaultPosition = { x: 120, y: 60 },
  defaultSize = { width: 720, height: 500 },
  isOpen,
  isMinimized,
  zIndex,
  onFocus,
  onClose,
  onMinimize,
}) {
  const [size, setSize] = useState(() => {
    const vw = window.innerWidth
    const vh = window.innerHeight
    return {
      width:  Math.min(defaultSize.width,  vw - 60),
      height: Math.min(defaultSize.height, vh - 100),
    }
  })
  const [pos, setPos] = useState(() => {
    const vw = window.innerWidth
    const vh = window.innerHeight
    const w = Math.min(defaultSize.width,  vw - 60)
    const h = Math.min(defaultSize.height, vh - 100)
    return {
      x: Math.max(0, Math.min(defaultPosition.x, vw - w)),
      y: Math.max(0, Math.min(defaultPosition.y, vh - h)),
    }
  })
  const [maximized, setMaximized] = useState(false)

  const startDrag = useCallback((e) => {
    if (e.button !== 0) return
    if (e.target.closest('.win-controls')) return
    if (maximized) return
    onFocus(id)

    const ox = e.clientX - pos.x
    const oy = e.clientY - pos.y

    const onMove = (ev) => {
      setPos({ x: ev.clientX - ox, y: Math.max(0, ev.clientY - oy) })
    }
    const onUp = () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    e.preventDefault()
  }, [pos, maximized, id, onFocus])

  const startResize = useCallback((e, dir) => {
    if (e.button !== 0 || maximized) return
    e.preventDefault()
    e.stopPropagation()
    onFocus(id)

    const startX = e.clientX
    const startY = e.clientY
    const sw = size.width
    const sh = size.height
    const spx = pos.x
    const spy = pos.y

    const onMove = (ev) => {
      const dx = ev.clientX - startX
      const dy = ev.clientY - startY

      let newW = sw, newH = sh, newX = spx, newY = spy

      if (dir.includes('e')) newW = Math.max(MIN_W, sw + dx)
      if (dir.includes('s')) newH = Math.max(MIN_H, sh + dy)
      if (dir.includes('w')) { newW = Math.max(MIN_W, sw - dx); newX = spx + (sw - newW) }
      if (dir.includes('n')) { newH = Math.max(MIN_H, sh - dy); newY = spy + (sh - newH) }

      setSize({ width: newW, height: newH })
      setPos({ x: newX, y: newY })
    }
    const onUp = () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }, [maximized, size, pos, id, onFocus])

  if (!isOpen) return null

  const style = maximized
    ? {}
    : { top: pos.y, left: pos.x, width: size.width, height: size.height }

  return (
    <div
      className={`os-window${isMinimized ? ' win-minimized' : ''}${maximized ? ' win-maximized' : ''}`}
      style={{ ...style, zIndex }}
      onMouseDown={() => onFocus(id)}
    >
      {/* Resize handles (only when not maximized) */}
      {!maximized && HANDLES.map(h => (
        <div
          key={h.dir}
          className="win-resize-handle"
          style={{ position: 'absolute', ...h.style, zIndex: 10 }}
          onMouseDown={e => startResize(e, h.dir)}
        />
      ))}

      <div className="win-titlebar" onMouseDown={startDrag}>
        <div className="win-controls">
          <button className="win-btn win-close"    onClick={e => { e.stopPropagation(); onClose(id) }}    title="Fermer"   aria-label="Fermer" />
          <button className="win-btn win-minimize" onClick={e => { e.stopPropagation(); onMinimize(id) }} title="Réduire"  aria-label="Réduire" />
          <button className="win-btn win-maximize" onClick={e => { e.stopPropagation(); setMaximized(m => !m) }}
            title={maximized ? 'Restaurer' : 'Agrandir'} aria-label={maximized ? 'Restaurer' : 'Agrandir'} />
        </div>
        <div className="win-title-center">
          {icon && <span className="win-icon" aria-hidden="true">{icon}</span>}
          <span className="win-title-text">{title}</span>
        </div>
        <div className="win-title-spacer" aria-hidden="true" />
      </div>

      <div className="win-body">
        {children}
      </div>
    </div>
  )
}

export default Window
