import { useState, useRef, useCallback } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub, faYoutube } from '@fortawesome/free-brands-svg-icons'
import { faUpRightFromSquare } from '@fortawesome/free-solid-svg-icons'
import './FileExplorer.css'
import pokedex     from '../images/pokedex.png'
import groupomania from '../images/groupomania.png'
import piiquante   from '../images/piiquante.png'
import booki       from '../images/booki.png'
import ohmyfood    from '../images/ohmyfood.png'
import kanap       from '../images/kanap.png'

const PROJECTS = [
  {
    num: '01',
    name: 'GL-HF.site',
    year: '2025',
    type: 'Full Stack · Production',
    folderIcon: '🎮',
    desc: "Plateforme de tournois esport en français. Inscriptions, brackets d'élimination, matchs en temps réel. Intégration Discord pour la coordination. Supporte LoL, Valorant, Overwatch, Minecraft.",
    tags: ['Next.js', 'TypeScript', 'Discord API'],
    live: 'https://www.gl-hf.site/',
    featured: true,
    caseStudy: {
      challenge: "Créer une plateforme esport full-stack en temps réel supportant plusieurs jeux et gérant automatiquement les brackets d'élimination via Discord.",
      stack: {
        'Frontend': 'Next.js 14 App Router · TypeScript · Tailwind CSS',
        'Backend':  'Node.js · Express · PostgreSQL',
        'Infra':    'Vercel · Railway · Discord API',
      },
      highlights: [
        "Bot Discord créant/gérant automatiquement les channels de match",
        "Brackets dynamiques avec mise à jour en temps réel (WebSocket)",
        "Système multi-tournois avec gestion des scores et classements",
        "Auth via Discord OAuth pour la cohérence avec l'écosystème esport",
      ],
    },
  },
  {
    num: '02',
    name: 'GL-HF Présentation',
    year: '2025',
    type: 'Landing Page · Design',
    folderIcon: '🌐',
    desc: "Site de présentation officiel de la plateforme GL-HF.site. Conçu pour communiquer la vision du projet, les fonctionnalités clés et l'identité de la marque.",
    tags: ['Next.js', 'TypeScript', 'Tailwind CSS'],
    live: 'https://presentation-glhf.vercel.app/',
  },
  {
    num: '03',
    name: 'Pokédex',
    year: '2022',
    type: 'Frontend',
    folderIcon: '🔴',
    image: pokedex,
    desc: "Pokédex first-gen sous Vue.JS consommant l'API PokeAPI. Affiche les 151 premiers Pokémon avec image, id et type.",
    tags: ['Vue.js', 'API REST'],
    live: 'https://pokedex-tony-cseresznyak.vercel.app/',
    github: 'https://github.com/TonyCse/Pokedex',
    yt: 'https://www.youtube.com/watch?v=WTIMYAG9bks',
  },
  {
    num: '04',
    name: 'Groupomania',
    year: '2022',
    type: 'Full Stack',
    folderIcon: '💬',
    image: groupomania,
    desc: "Réseau social d'entreprise avec création de compte, partage de posts avec médias et compte modérateur.",
    tags: ['Vue.js', 'Express.js', 'MySQL'],
    github: 'https://github.com/TonyCse/Groupomania-P7',
    yt: 'https://www.youtube.com/watch?v=kncL0AvyGTQ',
  },
  {
    num: '05',
    name: 'Kanap',
    year: '2022',
    type: 'Frontend · E-commerce',
    folderIcon: '🛒',
    image: kanap,
    desc: "Site e-commerce en JavaScript Vanilla. Chargement dynamique des produits via une API REST, ajout au panier avec sélection de quantité et couleur, récapitulatif de commande et validation avec génération d'un numéro de commande unique.",
    tags: ['JavaScript Vanilla', 'API REST', 'HTML/CSS'],
    github: 'https://github.com/TonyCse/Kanap',
  },
  {
    num: '07',
    name: 'Piiquante',
    year: '2022',
    type: 'Backend · API',
    folderIcon: '🌶️',
    image: piiquante,
    desc: "API et site d'avis gastronomiques. Authentification JWT, publication de sauces, système de like/dislike.",
    tags: ['Node.js', 'Express', 'MongoDB', 'JWT'],
    github: 'https://github.com/TonyCse/Piiquante',
  },
  {
    num: '08',
    name: 'OhMyFood',
    year: '2021',
    type: 'Frontend · Animation',
    folderIcon: '🍽️',
    image: ohmyfood,
    desc: "Site de réservation de restaurant avec animations CSS et affichage dynamique des menus.",
    tags: ['HTML/CSS', 'Sass'],
    live: 'https://ohmyfood-tony.vercel.app/',
    github: 'https://github.com/TonyCse/OhMyFood',
  },
  {
    num: '09',
    name: 'Booki',
    year: '2021',
    type: 'Intégration · Responsive',
    folderIcon: '🏨',
    image: booki,
    desc: "Intégration pixel-perfect d'une maquette de site de réservation d'hôtels.",
    tags: ['HTML', 'CSS'],
    live: 'https://projet-booki.vercel.app/',
    github: 'https://github.com/TonyCse/Projet-Booki',
  },
]

const WIP_PROJECTS = [
  {
    num: 'w1',
    name: 'TonyOS Portfolio',
    year: '2025',
    type: 'Portfolio · Interactif',
    folderIcon: '🖥️',
    desc: "Ce portfolio — un OS fictif interactif. Fenêtres draggables, jeu RPG 2D explorable avec système de quêtes, music player, terminal émulé, mode mobile iOS. Développement actif.",
    tags: ['React', 'CSS', 'Canvas', 'GSAP'],
    wip: true,
    status: 'En développement',
  },
  {
    num: 'w2',
    name: 'GL-HF API v2',
    year: '2025',
    type: 'Backend · Refactoring',
    folderIcon: '⚙️',
    desc: "Refonte du backend GL-HF.site avec Prisma ORM pour la gestion des données, tRPC pour la type safety end-to-end et amélioration des performances tournois.",
    tags: ['Node.js', 'Prisma', 'tRPC', 'PostgreSQL'],
    wip: true,
    status: 'En cours',
  },
]

const FILTERS = [
  { label: 'Tout',       test: () => true },
  { label: 'En cours',   test: () => false, wip: true },
  { label: 'Full Stack', test: p => p.type.includes('Full Stack') },
  { label: 'Frontend',   test: p => ['Frontend', 'Intégration', 'Landing'].some(t => p.type.includes(t)) },
  { label: 'Backend',    test: p => p.type.includes('Backend') || p.type.includes('API') },
  { label: 'Next.js',    test: p => p.tags.includes('Next.js') },
  { label: 'Vue.js',     test: p => p.tags.includes('Vue.js') },
]

function CaseStudySection({ cs }) {
  return (
    <div className="fe-casestudy">
      <div className="fe-cs-title">🔍 Case Study</div>
      <p className="fe-cs-challenge">{cs.challenge}</p>
      <div className="fe-cs-stack">
        {Object.entries(cs.stack).map(([layer, tech]) => (
          <div key={layer} className="fe-cs-layer">
            <span className="fe-cs-layer-name">{layer}</span>
            <span className="fe-cs-layer-tech">{tech}</span>
          </div>
        ))}
      </div>
      <ul className="fe-cs-highlights">
        {cs.highlights.map((h, i) => (
          <li key={i} className="fe-cs-highlight">
            <span className="fe-cs-bullet">▸</span> {h}
          </li>
        ))}
      </ul>
    </div>
  )
}

function DetailView({ project }) {
  return (
    <div className="fe-detail">
      <div className="fe-detail-header">
        <span className="fe-detail-bigicon">{project.wip ? '🚧' : '📂'}</span>
        <div className="fe-detail-hinfo">
          <div className="fe-detail-name">{project.name}</div>
          <div className="fe-detail-type">{project.type} · {project.year}</div>
        </div>
        {project.featured && <span className="fe-detail-live">🟢 En production</span>}
        {project.wip && <span className="fe-detail-wip">🔧 {project.status}</span>}
      </div>

      {project.image ? (
        <img src={project.image} alt={project.name} className="fe-detail-img" loading="lazy" />
      ) : (
        <div className="fe-detail-img-placeholder">{project.folderIcon}</div>
      )}

      <p className="fe-detail-desc">{project.desc}</p>

      <div className="fe-detail-meta">
        <span><span className="fe-meta-label">Type:</span>{project.type}</span>
        <span><span className="fe-meta-label">Année:</span>{project.year}</span>
      </div>

      <div className="fe-detail-tags">
        {project.tags.map(t => (
          <span key={t} className="fe-tag">{t}</span>
        ))}
      </div>

      {project.caseStudy && <CaseStudySection cs={project.caseStudy} />}

      <div className="fe-detail-links">
        {project.live && (
          <a href={project.live} target="_blank" rel="noreferrer" className="fe-link">
            <FontAwesomeIcon icon={faUpRightFromSquare} /> Voir le site
          </a>
        )}
        {project.github && (
          <a href={project.github} target="_blank" rel="noreferrer" className="fe-link">
            <FontAwesomeIcon icon={faGithub} /> Code source
          </a>
        )}
        {project.yt && (
          <a href={project.yt} target="_blank" rel="noreferrer" className="fe-link">
            <FontAwesomeIcon icon={faYoutube} /> Vidéo
          </a>
        )}
      </div>
    </div>
  )
}

function Projets() {
  const [view,         setView]         = useState('grid')
  const [selected,     setSelected]     = useState(null)
  const [activeFilter, setActiveFilter] = useState('Tout')
  const clickTimer = useRef(null)

  const isWipFilter = activeFilter === 'En cours'
  const pool        = isWipFilter ? WIP_PROJECTS : PROJECTS
  const filterFn    = FILTERS.find(f => f.label === activeFilter)?.test ?? (() => true)
  const visible     = isWipFilter ? WIP_PROJECTS : pool.filter(filterFn)

  const openProject = useCallback((p) => {
    setSelected(p)
    setView('detail')
  }, [])

  const goBack = useCallback(() => {
    setView('grid')
  }, [])

  const handleFilterClick = useCallback((label) => {
    setActiveFilter(label)
    setSelected(null)
    setView('grid')
  }, [])

  const handleFolderClick = (p) => {
    if (clickTimer.current) {
      clearTimeout(clickTimer.current)
      clickTimer.current = null
      openProject(p)
    } else {
      setSelected(p)
      clickTimer.current = setTimeout(() => { clickTimer.current = null }, 300)
    }
  }

  const path = view === 'detail' && selected
    ? ['tony-portfolio', activeFilter === 'En cours' ? 'En cours' : 'Projets', selected.name]
    : ['tony-portfolio', activeFilter === 'En cours' ? 'En cours' : 'Projets']

  const statusText = view === 'grid'
    ? activeFilter === 'Tout'
      ? `${visible.length} éléments`
      : `${visible.length} élément${visible.length > 1 ? 's' : ''} · ${activeFilter}`
    : selected
    ? `${selected.name} · ${selected.type} · ${selected.year}`
    : ''

  return (
    <section id="projets" style={{ padding: 0, height: '100%' }}>
      <div className="fe-root">

        {/* Toolbar */}
        <div className="fe-toolbar">
          <button className="fe-nav-btn" onClick={goBack} disabled={view !== 'detail'} title="Retour">←</button>
          <button className="fe-nav-btn" disabled title="Suivant">→</button>
          <div className="fe-address">
            {path.map((p, i) => (
              <span key={i}>
                {i > 0 && <span className="fe-address-sep"> › </span>}
                <span>{p}</span>
              </span>
            ))}
          </div>
          <div className="fe-search">
            <span style={{ color: '#555' }}>🔍</span>
            <input placeholder="Rechercher..." className="fe-search-input" readOnly />
          </div>
        </div>

        {/* Filter bar */}
        <div className="fe-filter-bar">
          {FILTERS.map(f => (
            <button
              key={f.label}
              className={`fe-filter-btn${activeFilter === f.label ? ' fe-filter-active' : ''}${f.wip ? ' fe-filter-wip' : ''}`}
              onClick={() => handleFilterClick(f.label)}
            >
              {f.wip ? '🔧 ' : ''}{f.label}
            </button>
          ))}
        </div>

        <div className="fe-main">
          {/* Left tree */}
          <div className="fe-tree">
            <div className="fe-tree-title">Dossiers</div>
            <button
              className={`fe-tree-item${view === 'grid' && !isWipFilter ? ' fe-tree-active' : ''}`}
              onClick={() => handleFilterClick('Tout')}
            >
              📂 Projets
            </button>
            <button
              className={`fe-tree-item${view === 'grid' && isWipFilter ? ' fe-tree-active' : ''}`}
              onClick={() => handleFilterClick('En cours')}
            >
              🚧 En cours
              <span className="fe-tree-badge">{WIP_PROJECTS.length}</span>
            </button>
            {visible.map(p => (
              <button
                key={p.num}
                className={`fe-tree-file${selected?.num === p.num && view === 'detail' ? ' fe-tree-active' : ''}`}
                onClick={() => openProject(p)}
              >
                {p.folderIcon} {p.name}
              </button>
            ))}
          </div>

          {/* Right content */}
          <div className="fe-content">
            {view === 'grid' ? (
              visible.length > 0 ? (
                <div className="fe-grid">
                  {visible.map(p => (
                    <button
                      key={p.num}
                      className={`fe-folder${selected?.num === p.num ? ' fe-folder-selected' : ''}${p.wip ? ' fe-folder-wip' : ''}`}
                      onClick={() => handleFolderClick(p)}
                      title={`Double-clic pour ouvrir — ${p.name}`}
                    >
                      <span className="fe-folder-icon">
                        {p.wip ? '🚧' : selected?.num === p.num ? '📂' : '📁'}
                      </span>
                      <span className="fe-folder-name">{p.name}</span>
                      {p.wip && <span className="fe-folder-wip-dot" />}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="fe-empty">Aucun projet pour ce filtre.</div>
              )
            ) : (
              selected && <DetailView project={selected} />
            )}
          </div>
        </div>

        {/* Status bar */}
        <div className="fe-statusbar">{statusText}</div>
      </div>
    </section>
  )
}

export default Projets
