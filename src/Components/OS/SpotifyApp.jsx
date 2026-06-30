import { useState, useRef, useEffect, useCallback } from 'react'
import './SpotifyApp.css'

const PLAYLISTS = [
  { id: 'lofi',    name: 'Lofi Study',    emoji: '📻', query: 'lofi chill study',          grad: 'linear-gradient(145deg, #1a0a2e, #4c1d95)' },
  { id: 'jazz',    name: 'Jazz Café',     emoji: '🎷', query: 'jazz cafe smooth relax',     grad: 'linear-gradient(145deg, #2d0a00, #7c2d12)' },
  { id: 'ambient', name: 'Ambient Focus', emoji: '🌊', query: 'ambient focus deep work',    grad: 'linear-gradient(145deg, #001830, #0c4a6e)' },
  { id: 'chill',   name: 'Chill Vibes',   emoji: '☁️', query: 'chill relaxing vibes indie', grad: 'linear-gradient(145deg, #052010, #14532d)' },
  { id: 'piano',   name: 'Piano & Rain',  emoji: '🎹', query: 'piano rain relaxing calm',   grad: 'linear-gradient(145deg, #0a0520, #1e1b4b)' },
]

const GENRES = [
  { name: 'Lofi',    emoji: '📻', query: 'lofi chill study',      color: '#7c3aed' },
  { name: 'Jazz',    emoji: '🎷', query: 'jazz cafe smooth',      color: '#c2410c' },
  { name: 'Ambient', emoji: '🌊', query: 'ambient focus',         color: '#1d4ed8' },
  { name: 'Piano',   emoji: '🎹', query: 'piano rain relaxing',   color: '#374151' },
  { name: 'Chill',   emoji: '☁️', query: 'chill relaxing vibes',  color: '#0e7490' },
  { name: 'Focus',   emoji: '🎯', query: 'focus work study beat', color: '#b45309' },
]

async function fetchTracks(query, signal) {
  const url = `/api/music?q=${encodeURIComponent(query)}`
  const res = await fetch(url, { signal })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const json = await res.json()
  return (json.results || [])
    .filter(t => t.previewUrl)
    .map(t => ({
      id:     t.trackId,
      title:  t.trackName,
      artist: t.artistName,
      url:    t.previewUrl,
      cover:  (t.artworkUrl100 || '').replace('100x100bb', '300x300bb'),
    }))
}

const fmtTime = (s) => {
  const t = Math.max(0, Math.floor(s))
  return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`
}

function TrackCover({ cover, grad, size = 'mini' }) {
  const [err, setErr] = useState(false)
  if (cover && !err) {
    return <img
      src={cover}
      alt=""
      className={`sp-track-cover-${size}`}
      onError={() => setErr(true)}
    />
  }
  return (
    <div className={`sp-track-cover-${size}`} style={{ background: grad || '#2d1b69' }}>
      <span>🎵</span>
    </div>
  )
}

function SpotifyApp({ volume }) {
  const audioRef    = useRef(null)
  const rafRef      = useRef(null)
  const musicVolRef = useRef(0.8)
  const globalVolRef= useRef(volume)
  const searchTimer      = useRef(null)
  const searchController = useRef(null)

  const [tracks,       setTracks]       = useState([])
  const [trackIdx,     setTrackIdx]     = useState(0)
  const [isPlaying,    setIsPlaying]    = useState(false)
  const [currentTime,  setCurrentTime]  = useState(0)
  const [duration,     setDuration]     = useState(0)
  const [localVol,     setLocalVol]     = useState(0.8)
  const [isShuffled,   setIsShuffled]   = useState(false)
  const [liked,        setLiked]        = useState(false)
  const [activeNav,    setActiveNav]    = useState('home')
  const [currentPL,    setCurrentPL]    = useState(PLAYLISTS[0])
  const [loading,      setLoading]      = useState(false)
  const [error,        setError]        = useState(false)
  const [searchQuery,  setSearchQuery]  = useState('')
  const [searchResults,setSearchResults]= useState(null)
  const [searching,    setSearching]    = useState(false)

  const track    = tracks[trackIdx] || null
  const progress = duration > 0 ? currentTime / duration : 0

  const effectiveVol = () => Math.min(1, musicVolRef.current * globalVolRef.current)

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

  const loadPlaylist = useCallback(async (pl) => {
    stopRaf()
    if (audioRef.current) { audioRef.current.pause(); audioRef.current.src = '' }
    setIsPlaying(false)
    setCurrentTime(0); setDuration(0)
    setLoading(true); setError(false); setTracks([])
    setCurrentPL(pl); setActiveNav('home')

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 10000)
    try {
      const data = await fetchTracks(pl.query, controller.signal)
      setTracks(data)
      setTrackIdx(0)
    } catch (e) {
      if (e.name !== 'AbortError') setError(true)
    } finally {
      clearTimeout(timeout)
      setLoading(false)
    }
  }, [stopRaf])

  useEffect(() => { loadPlaylist(PLAYLISTS[0]) }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const playTrack = useCallback((idx, list) => {
    const src = list ? list[idx] : tracks[idx]
    const audio = audioRef.current
    if (!audio || !src?.url) return
    stopRaf(); audio.pause()
    audio.src = src.url
    audio.volume = effectiveVol()
    setCurrentTime(0); setDuration(0); setTrackIdx(idx)
    audio.play()
      .then(() => { setIsPlaying(true); startRaf() })
      .catch(() => setIsPlaying(false))
  }, [tracks, startRaf, stopRaf]) // eslint-disable-line react-hooks/exhaustive-deps

  const togglePlay = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    if (isPlaying) {
      audio.pause(); stopRaf(); setIsPlaying(false)
    } else {
      if (!audio.src && track?.url) audio.src = track.url
      if (!audio.src) return
      audio.volume = effectiveVol()
      audio.play().then(() => { setIsPlaying(true); startRaf() }).catch(() => setIsPlaying(false))
    }
  }, [isPlaying, track, startRaf, stopRaf]) // eslint-disable-line react-hooks/exhaustive-deps

  const next = useCallback(() => {
    const n = tracks.length
    if (!n) return
    playTrack(isShuffled ? Math.floor(Math.random() * n) : (trackIdx + 1) % n)
  }, [trackIdx, isShuffled, tracks, playTrack])

  const prev = useCallback(() => {
    if (currentTime > 3) {
      if (audioRef.current) audioRef.current.currentTime = 0
      setCurrentTime(0)
    } else {
      playTrack((trackIdx - 1 + tracks.length) % tracks.length)
    }
  }, [trackIdx, currentTime, tracks, playTrack])

  const seek = useCallback((e) => {
    const audio = audioRef.current
    if (!audio?.duration) return
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

  const handleSearch = useCallback((q) => {
    setSearchQuery(q)
    clearTimeout(searchTimer.current)
    searchController.current?.abort()
    if (!q.trim()) { setSearchResults(null); return }
    setSearching(true)
    searchTimer.current = setTimeout(async () => {
      const ctrl = new AbortController()
      searchController.current = ctrl
      try {
        const data = await fetchTracks(q, ctrl.signal)
        setSearchResults(data)
      } catch (e) {
        if (e.name !== 'AbortError') setSearchResults([])
      } finally {
        setSearching(false)
      }
    }, 600)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const volIcon = localVol === 0 ? '🔇' : localVol < 0.35 ? '🔈' : localVol < 0.7 ? '🔉' : '🔊'

  return (
    <div className="sp-root">
      <audio
        ref={audioRef}
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
                className={`sp-playlist-item${currentPL?.id === pl.id ? ' sp-playlist-active' : ''}`}
                onClick={() => loadPlaylist(pl)}
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
                <div className="sp-album-cover" style={{ background: currentPL?.grad || '#2d1b69' }}>
                  <span className="sp-album-emoji">{currentPL?.emoji || '🎵'}</span>
                </div>
                <div className="sp-album-info">
                  <span className="sp-album-type">Playlist</span>
                  <h2 className="sp-album-name">{currentPL?.name || 'Musique'}</h2>
                  <p className="sp-album-artist">Deezer · {tracks.length} titres · previews 30s</p>
                </div>
              </div>

              <div className="sp-album-controls">
                <button className="sp-play-big" onClick={togglePlay} disabled={loading || !tracks.length}>
                  {isPlaying ? '⏸' : '▶'}
                </button>
                <button className="sp-shuffle-btn" onClick={() => setIsShuffled(s => !s)}
                  style={{ opacity: isShuffled ? 1 : 0.45, color: isShuffled ? '#a476ff' : 'inherit' }}>🔀</button>
                <button className="sp-like-btn" onClick={() => setLiked(l => !l)}>
                  {liked ? '💜' : '🤍'}
                </button>
              </div>

              {loading && (
                <div className="sp-loading">
                  <div className="sp-loading-dots">
                    <span /><span /><span />
                  </div>
                  <span>Chargement de la playlist…</span>
                </div>
              )}

              {error && (
                <div className="sp-error">
                  <span>⚠️ Impossible de charger la playlist.</span>
                  <button className="sp-retry-btn" onClick={() => loadPlaylist(currentPL)}>Réessayer</button>
                </div>
              )}

              {!loading && !error && (
                <div className="sp-tracks">
                  <div className="sp-tracks-header">
                    <span className="sp-th sp-th-num">#</span>
                    <span className="sp-th" />
                    <span className="sp-th">Titre</span>
                    <span className="sp-th sp-th-dur">⏱</span>
                  </div>
                  <div className="sp-tracks-list">
                    {tracks.map((t, idx) => (
                      <button
                        key={t.id}
                        className={`sp-track-row${trackIdx === idx ? ' sp-track-active' : ''}`}
                        onClick={() => idx === trackIdx ? togglePlay() : playTrack(idx)}
                      >
                        <span className="sp-track-num">
                          {trackIdx === idx && isPlaying
                            ? <span className="sp-eq"><span /><span /><span /></span>
                            : idx + 1}
                        </span>
                        <TrackCover cover={t.cover} />
                        <div className="sp-track-meta">
                          <span className="sp-track-title">{t.title}</span>
                          <span className="sp-track-artist">{t.artist}</span>
                        </div>
                        <span className="sp-track-dur">0:30</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
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
                  placeholder="Artiste, titre, ambiance…"
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
                  {searching ? (
                    <div className="sp-loading">
                      <div className="sp-loading-dots"><span /><span /><span /></div>
                    </div>
                  ) : (
                    <>
                      <div className="sp-search-results-title">
                        {searchResults.length} résultat{searchResults.length !== 1 ? 's' : ''}
                      </div>
                      {searchResults.length === 0
                        ? <div className="sp-search-empty">Aucun résultat pour « {searchQuery} »</div>
                        : searchResults.map((t, idx) => (
                          <button
                            key={t.id}
                            className={`sp-track-row${trackIdx === idx && tracks === searchResults ? ' sp-track-active' : ''}`}
                            onClick={() => {
                              setTracks(searchResults)
                              setCurrentPL(null)
                              playTrack(idx, searchResults)
                            }}
                          >
                            <span className="sp-track-num">▶</span>
                            <TrackCover cover={t.cover} />
                            <div className="sp-track-meta">
                              <span className="sp-track-title">{t.title}</span>
                              <span className="sp-track-artist">{t.artist}</span>
                            </div>
                            <span className="sp-track-dur">0:30</span>
                          </button>
                        ))
                      }
                    </>
                  )}
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
                        onClick={() => {
                          const pl = { id: g.name.toLowerCase(), name: g.name, emoji: g.emoji, query: g.query, grad: `linear-gradient(145deg, #1a0a2e, ${g.color})` }
                          loadPlaylist(pl)
                        }}
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
                    className={`sp-library-item${currentPL?.id === pl.id ? ' sp-library-active' : ''}`}
                    onClick={() => loadPlaylist(pl)}
                  >
                    <div className="sp-library-cover" style={{ background: pl.grad }}>
                      <span>{pl.emoji}</span>
                    </div>
                    <div className="sp-library-info">
                      <div className="sp-library-name">{pl.name}</div>
                      <div className="sp-library-desc">Deezer · previews 30s</div>
                    </div>
                    {currentPL?.id === pl.id && (
                      <div className="sp-library-playing">
                        {isPlaying ? <span className="sp-eq"><span /><span /><span /></span> : '▶'}
                      </div>
                    )}
                  </button>
                ))}
              </div>

              <div className="sp-library-sep" />
              <div className="sp-library-stats">
                <div className="sp-stat"><span className="sp-stat-n">{tracks.length}</span><span>Titres chargés</span></div>
                <div className="sp-stat"><span className="sp-stat-n">{PLAYLISTS.length}</span><span>Playlists</span></div>
                <div className="sp-stat"><span className="sp-stat-n">{GENRES.length}</span><span>Genres</span></div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* ── Player bar ── */}
      <div className="sp-player">
        <div className="sp-now-playing">
          {track
            ? <>
                <TrackCover cover={track.cover} size="np" />
                <div className="sp-np-info">
                  <span className="sp-np-title">{track.title}</span>
                  <span className="sp-np-artist">{track.artist}</span>
                </div>
              </>
            : <div className="sp-np-empty">Aucune piste sélectionnée</div>
          }
        </div>

        <div className="sp-controls">
          <div className="sp-ctrl-btns">
            <button className="sp-ctrl-btn" onClick={prev} disabled={!track}>⏮</button>
            <button className="sp-play-circle" onClick={togglePlay} disabled={!track}>{isPlaying ? '⏸' : '▶'}</button>
            <button className="sp-ctrl-btn" onClick={next} disabled={!track}>⏭</button>
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
