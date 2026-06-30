import { useState, useRef, useEffect, useCallback } from 'react'
import './SpotifyApp.css'

import lofi1 from '../../music/lofi1.mp3'
// import lofi2 from '../../music/lofi2.mp3'
// import lofi3 from '../../music/lofi3.mp3'
// import lofi4 from '../../music/lofi4.mp3'
// import lofi5 from '../../music/lofi5.mp3'

const TRACKS = [
  { id: 1, title: 'Debugging at 3am',   artist: 'Lofi', url: lofi1,  emoji: '🌙', grad: 'linear-gradient(145deg, #1a0a2e, #4c1d95)' },
  { id: 2, title: 'Rain & Café',         artist: 'Lofi', url: null,   emoji: '☕', grad: 'linear-gradient(145deg, #0c1a40, #1e3a7f)' },
  { id: 3, title: 'Git Push to Prod',   artist: 'Lofi', url: null,   emoji: '🚀', grad: 'linear-gradient(145deg, #1a0505, #7c1010)' },
  { id: 4, title: 'Late Night Commits', artist: 'Lofi', url: null,   emoji: '🌃', grad: 'linear-gradient(145deg, #1a1505, #7c4a10)' },
  { id: 5, title: 'Focus Flow',         artist: 'Lofi', url: null,   emoji: '🎧', grad: 'linear-gradient(145deg, #05180a, #107c3a)' },
]

const PLAYLISTS = [
  { id: 0, name: 'Lofi Playlist',      emoji: '📻', desc: '5 titres · Chill & focus',  indices: [0,1,3,4,2] },
  { id: 1, name: 'Code & Chill',       emoji: '💻', desc: '5 titres · Dev ambiance',   indices: [0,1,2,3,4] },
  { id: 2, name: 'Late Night Deploy',  emoji: '🌙', desc: '5 titres · Dark hours',     indices: [3,0,4,1,2] },
]

const GENRES = [
  { name: 'Dev Ambiance', emoji: '💻', color: '#7c3aed', indices: [0,1,4] },
  { name: 'Gaming',       emoji: '🎮', color: '#c2410c', indices: [2,4,1] },
  { name: 'Focus',        emoji: '🎯', color: '#1d4ed8', indices: [1,3,0] },
  { name: 'Late Night',   emoji: '🌙', color: '#374151', indices: [3,0,2] },
  { name: 'Chill',        emoji: '☁️',  color: '#0e7490', indices: [0,4,1] },
  { name: 'Énergie',      emoji: '⚡',  color: '#b45309', indices: [2,1,3] },
]

const fmtTime = (s) => {
  const t = Math.max(0, Math.floor(s))
  return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`
}

function SpotifyApp({ volume }) {
  const audioRef     = useRef(null)
  const rafRef       = useRef(null)
  const musicVolRef  = useRef(0.8)   // volume propre à l'app Music
  const globalVolRef = useRef(volume) // volume OS global (lecture seule)

  const [trackIdx,    setTrackIdx]    = useState(0)
  const [isPlaying,   setIsPlaying]   = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration,    setDuration]    = useState(0)
  const [localVol,    setLocalVol]    = useState(0.8) // indépendant du global
  const [isShuffled,  setIsShuffled]  = useState(false)
  const [liked,       setLiked]       = useState(false)

  // Nav + playlist state
  const [activeNav,      setActiveNav]      = useState('home')
  const [currentPL,      setCurrentPL]      = useState(0)
  const [displayIndices, setDisplayIndices] = useState([0,1,3,4,2])
  const [searchQuery,    setSearchQuery]    = useState('')
  const [searchResults,  setSearchResults]  = useState(null)

  const track    = TRACKS[trackIdx]
  const progress = duration > 0 ? currentTime / duration : 0

  // Volume effectif = global OS × volume Music (multiplicatif, indépendant)
  const effectiveVol = () => Math.min(1, musicVolRef.current * globalVolRef.current)

  // Quand le global OS change → mise à jour du volume audio sans toucher localVol
  useEffect(() => {
    globalVolRef.current = volume
    if (audioRef.current) audioRef.current.volume = effectiveVol()
  }, [volume]) // eslint-disable-line react-hooks/exhaustive-deps

  const stopRaf  = useCallback(() => cancelAnimationFrame(rafRef.current), [])
  const startRaf = useCallback(() => {
    const tick = () => {
      if (audioRef.current) setCurrentTime(audioRef.current.currentTime)
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
  }, [])
  useEffect(() => () => stopRaf(), [stopRaf])

  const playTrack = useCallback((idx) => {
    const audio = audioRef.current
    if (!audio || !TRACKS[idx].url) return
    stopRaf(); audio.pause()
    audio.src = TRACKS[idx].url
    audio.volume = effectiveVol()
    setCurrentTime(0); setDuration(0); setTrackIdx(idx)
    audio.play()
      .then(() => { setIsPlaying(true); startRaf() })
      .catch(() => setIsPlaying(false))
  }, [startRaf, stopRaf]) // eslint-disable-line react-hooks/exhaustive-deps

  const togglePlay = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    if (isPlaying) {
      audio.pause(); stopRaf(); setIsPlaying(false)
    } else {
      if (!audio.src && track.url) audio.src = track.url
      if (!audio.src) return
      audio.volume = effectiveVol()
      audio.play().then(() => { setIsPlaying(true); startRaf() }).catch(() => setIsPlaying(false))
    }
  }, [isPlaying, track, startRaf, stopRaf]) // eslint-disable-line react-hooks/exhaustive-deps

  const next = useCallback(() => {
    const nextIdx = isShuffled
      ? Math.floor(Math.random() * TRACKS.length)
      : (trackIdx + 1) % TRACKS.length
    playTrack(nextIdx)
  }, [trackIdx, isShuffled, playTrack])

  const prev = useCallback(() => {
    if (currentTime > 3) {
      if (audioRef.current) audioRef.current.currentTime = 0
      setCurrentTime(0)
    } else {
      playTrack((trackIdx - 1 + TRACKS.length) % TRACKS.length)
    }
  }, [trackIdx, currentTime, playTrack])

  const seek = useCallback((e) => {
    const audio = audioRef.current
    if (!audio || !audio.duration) return
    const rect  = e.currentTarget.getBoundingClientRect()
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    audio.currentTime = ratio * audio.duration
    setCurrentTime(audio.currentTime)
  }, [])

  const handleVol = useCallback((v) => {
    const n = parseFloat(v)
    musicVolRef.current = n
    setLocalVol(n)
    if (audioRef.current) audioRef.current.volume = Math.min(1, n * globalVolRef.current)
  }, [])

  const handleTrackClick = useCallback((idx) => {
    if (!TRACKS[idx].url) return
    if (idx === trackIdx) togglePlay()
    else playTrack(idx)
  }, [trackIdx, togglePlay, playTrack])

  // Switch playlist
  const switchPlaylist = (plIdx) => {
    setCurrentPL(plIdx)
    setDisplayIndices(PLAYLISTS[plIdx].indices)
    setActiveNav('home')
  }

  // Switch genre
  const switchGenre = (genre) => {
    setDisplayIndices(genre.indices)
    setCurrentPL(-1)
    setActiveNav('home')
  }

  // Search
  const handleSearch = (q) => {
    setSearchQuery(q)
    if (!q.trim()) { setSearchResults(null); return }
    const lower = q.toLowerCase()
    const results = TRACKS
      .map((t, i) => ({ ...t, originalIdx: i }))
      .filter(t => t.title.toLowerCase().includes(lower) || t.artist.toLowerCase().includes(lower))
    setSearchResults(results)
  }

  const displayTracks = displayIndices.map(i => ({ ...TRACKS[i], originalIdx: i }))
  const volIcon = localVol === 0 ? '🔇' : localVol < 0.35 ? '🔈' : localVol < 0.7 ? '🔉' : '🔊'
  const currentPlaylistName = currentPL >= 0 ? PLAYLISTS[currentPL].name : 'Sélection'

  return (
    <div className="sp-root">
      <audio
        ref={audioRef}
        crossOrigin="anonymous"
        onEnded={next}
        onLoadedMetadata={() => audioRef.current && setDuration(audioRef.current.duration)}
      />

      <div className="sp-inner">
        {/* ── Sidebar ── */}
        <div className="sp-sidebar">
          <div className="sp-logo">
            <span className="sp-logo-icon">🎵</span>
            <span className="sp-logo-name">Music</span>
          </div>

          <nav className="sp-nav">
            {[
              { id: 'home',    icon: '🏠', label: 'Accueil' },
              { id: 'search',  icon: '🔍', label: 'Recherche' },
              { id: 'library', icon: '📚', label: 'Bibliothèque' },
            ].map(n => (
              <button
                key={n.id}
                className={`sp-nav-btn${activeNav === n.id ? ' sp-nav-active' : ''}`}
                onClick={() => setActiveNav(n.id)}
              >
                <span>{n.icon}</span><span>{n.label}</span>
              </button>
            ))}
          </nav>

          <div className="sp-sidebar-sep" />

          <div className="sp-playlists">
            <div className="sp-playlist-header">Mes playlists</div>
            {PLAYLISTS.map(pl => (
              <button
                key={pl.id}
                className={`sp-playlist-item${currentPL === pl.id ? ' sp-playlist-active' : ''}`}
                onClick={() => switchPlaylist(pl.id)}
              >
                <span className="sp-playlist-emoji">{pl.emoji}</span>
                <span>{pl.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Main content ── */}
        <div className="sp-main">

          {/* ── HOME ── */}
          {activeNav === 'home' && (
            <>
              <div className="sp-album-hero">
                <div className="sp-album-cover" style={{ background: track.grad }}>
                  <span className="sp-album-emoji">{track.emoji}</span>
                </div>
                <div className="sp-album-info">
                  <span className="sp-album-type">Playlist</span>
                  <h2 className="sp-album-name">{currentPlaylistName}</h2>
                  <p className="sp-album-artist">TonyOS Lofi · {displayIndices.length} titres · 2026</p>
                </div>
              </div>

              <div className="sp-album-controls">
                <button className="sp-play-big" onClick={togglePlay}>{isPlaying ? '⏸' : '▶'}</button>
                <button className="sp-shuffle-btn" onClick={() => setIsShuffled(s => !s)}
                  style={{ opacity: isShuffled ? 1 : 0.45, color: isShuffled ? '#a476ff' : 'inherit' }}>🔀</button>
                <button className="sp-like-btn" onClick={() => setLiked(l => !l)}>
                  {liked ? '💜' : '🤍'}
                </button>
              </div>

              <div className="sp-tracks">
                <div className="sp-tracks-header">
                  <span className="sp-th sp-th-num">#</span>
                  <span className="sp-th" />
                  <span className="sp-th">Titre</span>
                  <span className="sp-th sp-th-dur">⏱</span>
                </div>
                <div className="sp-tracks-list">
                  {displayTracks.map((t, listIdx) => (
                    <button
                      key={t.id}
                      className={`sp-track-row${trackIdx === t.originalIdx ? ' sp-track-active' : ''}${!t.url ? ' sp-track-unavailable' : ''}`}
                      onClick={() => handleTrackClick(t.originalIdx)}
                      disabled={!t.url}
                    >
                      <span className="sp-track-num">
                        {trackIdx === t.originalIdx && isPlaying
                          ? <span className="sp-eq"><span /><span /><span /></span>
                          : listIdx + 1}
                      </span>
                      <div className="sp-track-cover-mini" style={{ background: t.grad }}>
                        <span>{t.emoji}</span>
                      </div>
                      <div className="sp-track-meta">
                        <span className="sp-track-title">{t.title}</span>
                        <span className="sp-track-artist">{t.artist}{!t.url ? ' · bientôt disponible' : ''}</span>
                      </div>
                      <span className="sp-track-dur">
                        {trackIdx === t.originalIdx ? fmtTime(duration) : '—'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* ── SEARCH ── */}
          {activeNav === 'search' && (
            <div className="sp-search-view">
              <h2 className="sp-view-title">Recherche</h2>
              <div className="sp-search-bar">
                <span className="sp-search-icon">🔍</span>
                <input
                  type="text"
                  className="sp-search-input"
                  placeholder="Titres, artistes…"
                  value={searchQuery}
                  onChange={e => handleSearch(e.target.value)}
                  autoFocus
                />
                {searchQuery && (
                  <button className="sp-search-clear" onClick={() => handleSearch('')}>✕</button>
                )}
              </div>

              {searchResults !== null ? (
                <div className="sp-search-results">
                  <div className="sp-search-results-title">
                    {searchResults.length} résultat{searchResults.length !== 1 ? 's' : ''}
                  </div>
                  {searchResults.length === 0
                    ? <div className="sp-search-empty">Aucun résultat pour « {searchQuery} »</div>
                    : searchResults.map(t => (
                      <button key={t.id}
                        className={`sp-track-row${trackIdx === t.originalIdx ? ' sp-track-active' : ''}${!t.url ? ' sp-track-unavailable' : ''}`}
                        onClick={() => handleTrackClick(t.originalIdx)}
                        disabled={!t.url}>
                        <span className="sp-track-num">
                          {trackIdx === t.originalIdx && isPlaying
                            ? <span className="sp-eq"><span /><span /><span /></span>
                            : <span>▶</span>}
                        </span>
                        <div className="sp-track-cover-mini" style={{ background: t.grad }}><span>{t.emoji}</span></div>
                        <div className="sp-track-meta">
                          <span className="sp-track-title">{t.title}</span>
                          <span className="sp-track-artist">{t.artist}{!t.url ? ' · bientôt disponible' : ''}</span>
                        </div>
                        <span className="sp-track-dur">
                          {trackIdx === t.originalIdx ? fmtTime(duration) : '—'}
                        </span>
                      </button>
                    ))
                  }
                </div>
              ) : (
                <>
                  <div className="sp-genres-title">Parcourir par ambiance</div>
                  <div className="sp-genres-grid">
                    {GENRES.map(g => (
                      <button
                        key={g.name}
                        className="sp-genre-card"
                        style={{ background: `linear-gradient(135deg, ${g.color}, color-mix(in srgb, ${g.color} 60%, #000))` }}
                        onClick={() => switchGenre(g)}
                      >
                        <span className="sp-genre-emoji">{g.emoji}</span>
                        <span className="sp-genre-name">{g.name}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* ── LIBRARY ── */}
          {activeNav === 'library' && (
            <div className="sp-library-view">
              <h2 className="sp-view-title">Ma bibliothèque</h2>
              <div className="sp-library-list">
                {PLAYLISTS.map(pl => (
                  <button
                    key={pl.id}
                    className={`sp-library-item${currentPL === pl.id ? ' sp-library-active' : ''}`}
                    onClick={() => switchPlaylist(pl.id)}
                  >
                    <div className="sp-library-cover">
                      <span>{pl.emoji}</span>
                    </div>
                    <div className="sp-library-info">
                      <div className="sp-library-name">{pl.name}</div>
                      <div className="sp-library-desc">{pl.desc}</div>
                    </div>
                    {currentPL === pl.id && (
                      <div className="sp-library-playing">
                        {isPlaying ? <span className="sp-eq"><span /><span /><span /></span> : '▶'}
                      </div>
                    )}
                  </button>
                ))}
              </div>

              <div className="sp-library-sep" />
              <div className="sp-library-stats">
                <div className="sp-stat"><span className="sp-stat-n">{TRACKS.length}</span><span>Titres</span></div>
                <div className="sp-stat"><span className="sp-stat-n">{PLAYLISTS.length}</span><span>Playlists</span></div>
                <div className="sp-stat"><span className="sp-stat-n">{TRACKS.filter(t => t.url).length}</span><span>Dispo</span></div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* ── Player bar ── */}
      <div className="sp-player">
        <div className="sp-now-playing">
          <div className="sp-np-cover" style={{ background: track.grad }}><span>{track.emoji}</span></div>
          <div className="sp-np-info">
            <span className="sp-np-title">{track.title}</span>
            <span className="sp-np-artist">{track.artist}</span>
          </div>
        </div>

        <div className="sp-controls">
          <div className="sp-ctrl-btns">
            <button className="sp-ctrl-btn" onClick={prev}>⏮</button>
            <button className="sp-play-circle" onClick={togglePlay}>{isPlaying ? '⏸' : '▶'}</button>
            <button className="sp-ctrl-btn" onClick={next}>⏭</button>
          </div>
          <div className="sp-seek-row">
            <span className="sp-time">{fmtTime(currentTime)}</span>
            <div className="sp-seek" onClick={seek}>
              <div className="sp-seek-track">
                <div className="sp-seek-fill" style={{ width: `${progress * 100}%` }} />
                <div className="sp-seek-thumb" style={{ left: `${progress * 100}%` }} />
              </div>
            </div>
            <span className="sp-time">{fmtTime(duration)}</span>
          </div>
        </div>

        <div className="sp-volume">
          <span className="sp-vol-icon">{volIcon}</span>
          <input type="range" className="sp-vol-slider" min={0} max={1} step={0.02}
            value={localVol} onChange={e => handleVol(e.target.value)} aria-label="Volume" />
        </div>
      </div>
    </div>
  )
}

export default SpotifyApp
