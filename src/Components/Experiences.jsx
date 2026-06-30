import React, { useState } from 'react'
import './TaskManager.css'

const PROCESSES = [
  {
    id: 'cc',
    icon: '💻',
    name: 'Développeur Full Stack',
    company: 'Cloud Campus · Paris',
    date: '2024 — 2026',
    type: 'Alternance',
    status: 'running',
    cpu: 92,
    mem: 78,
    tags: ['React', 'Laravel', 'PHP', 'Docker', 'MySQL'],
    desc: "Développement d'applications web full stack dans le cadre du Bac+4. Conception, développement et déploiement de solutions complètes, de la base de données à l'interface utilisateur. Travail en méthode Agile.",
  },
  {
    id: 'hab',
    icon: '🏠',
    name: 'Développeur Front-End',
    company: 'Habiteo · Paris',
    date: 'Sep 2022 — Mar 2023',
    type: 'Stage',
    status: 'completed',
    cpu: 65,
    mem: 52,
    tags: ['JavaScript', 'Node.js', 'Vue.js', 'Vuetify'],
    desc: "Développement et optimisation de l'ergonomie et de la navigation de 3 applications web pour une start-up spécialisée dans l'innovation immobilière 3D.",
  },
  {
    id: 'proc',
    icon: '🔒',
    name: 'Agent de sécurité',
    company: 'Procedo · Paris',
    date: 'Sep 2015 — Août 2022',
    type: 'CDI',
    status: 'completed',
    cpu: 25,
    mem: 20,
    tags: [],
    desc: "Contrôle et surveillance des accès d'un data center du ministère des finances. Rigueur, gestion du stress, sens des responsabilités.",
  },
]

const FORMATIONS = [
  {
    id: 'bac4',
    icon: '🎓',
    name: 'Bac+4 · Développeur Full Stack',
    company: 'Cloud Campus · Paris',
    date: '2024 — 2026',
    type: 'Alternance',
    status: 'running',
    cpu: 88,
    mem: 74,
    tags: ['React', 'PHP', 'Laravel', 'Docker', 'MySQL'],
    desc: "Formation en alternance axée sur le développement web full stack. Architecture web, bonnes pratiques agile, déploiement cloud.",
  },
  {
    id: 'oc',
    icon: '📚',
    name: 'Bac+2 · Développeur Web',
    company: 'OpenClassrooms · À distance',
    date: 'Oct 2021 — Avr 2022',
    type: 'En ligne',
    status: 'completed',
    cpu: 55,
    mem: 48,
    tags: ['HTML/CSS', 'JavaScript', 'Node.js', 'Vue.js', 'MongoDB'],
    desc: "Intégration de maquettes, SEO, e-commerce JavaScript Vanilla, API JWT, réseau social Express.js + Vue.js.",
  },
]

const SKILLS = [
  { name: 'HTML/CSS',    level: 95, color: '#e34c26' },
  { name: 'JavaScript',  level: 88, color: '#f7df1e' },
  { name: 'React.js',    level: 92, color: '#61dafb' },
  { name: 'TypeScript',  level: 84, color: '#3178c6' },
  { name: 'Git',         level: 90, color: '#f05032' },
  { name: 'Node.js',     level: 82, color: '#83cd29' },
  { name: 'Laravel',     level: 76, color: '#ff2d20' },
  { name: 'SQL',         level: 78, color: '#336791' },
  { name: 'Docker',      level: 72, color: '#2496ed' },
  { name: 'MongoDB',     level: 68, color: '#4db33d' },
  { name: 'PHP',         level: 74, color: '#777bb4' },
  { name: 'Vue.js',      level: 72, color: '#42b883' },
]

function SkillBar({ name, level, color }) {
  const BLOCKS = 20
  const filled = Math.round(level / 100 * BLOCKS)
  return (
    <div className="tm-skill-row">
      <span className="tm-skill-name">{name}</span>
      <div className="tm-skill-bar">
        {Array.from({ length: BLOCKS }, (_, i) => (
          <span
            key={i}
            className="tm-skill-block"
            style={i < filled ? { background: color, opacity: 0.85 } : {}}
          />
        ))}
      </div>
      <span className="tm-skill-pct">{level}%</span>
    </div>
  )
}

function Experiences() {
  const [mainTab, setMainTab] = useState('processes')
  const [filter,  setFilter]  = useState('all')
  const [selected, setSelected] = useState('cc')

  const allItems = [...PROCESSES, ...FORMATIONS]
  const displayed = filter === 'all'
    ? allItems
    : filter === 'exp'
    ? PROCESSES
    : FORMATIONS

  const selectedItem = allItems.find(i => i.id === selected) ?? allItems[0]

  return (
    <section id="experiences" style={{ padding: 0, height: '100%' }}>
      <div className="tm-root">

        {/* Menu bar */}
        <div className="tm-menubar">
          <span className="tm-menu-item">Fichier</span>
          <span className="tm-menu-item">Options</span>
          <span className="tm-menu-item">Vue</span>
          <span className="tm-menu-sep" />
          <span className="tm-menu-title">Gestionnaire des tâches</span>
        </div>

        {/* Main tabs */}
        <div className="tm-tabs">
          <button
            className={`tm-tab${mainTab === 'processes' ? ' tm-tab-active' : ''}`}
            onClick={() => setMainTab('processes')}
          >
            Processus
          </button>
          <button
            className={`tm-tab${mainTab === 'perf' ? ' tm-tab-active' : ''}`}
            onClick={() => setMainTab('perf')}
          >
            Performances
          </button>
          <div className="tm-tabs-space" />
          {mainTab === 'processes' && (
            <div className="tm-filter-btns">
              {[['all','Tous'],['exp','Expériences'],['form','Formations']].map(([v, label]) => (
                <button
                  key={v}
                  className={`tm-filter-btn${filter === v ? ' active' : ''}`}
                  onClick={() => setFilter(v)}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>

        {mainTab === 'processes' ? (
          <div className="tm-body">
            {/* Table */}
            <div className="tm-table">
              <div className="tm-thead">
                <span className="tm-th">Processus</span>
                <span className="tm-th">Date</span>
                <span className="tm-th">Type</span>
                <span className="tm-th">CPU</span>
                <span className="tm-th">Statut</span>
              </div>

              {displayed.map(item => (
                <button
                  key={item.id}
                  className={`tm-row${selected === item.id ? ' tm-row-selected' : ''}`}
                  onClick={() => setSelected(item.id)}
                >
                  <span className="tm-td tm-td-name">
                    <span className="tm-row-icon">{item.icon}</span>
                    <span className="tm-row-text">{item.name}</span>
                  </span>
                  <span className="tm-td tm-td-date">{item.date}</span>
                  <span className="tm-td tm-td-type">{item.type}</span>
                  <span className="tm-td">
                    <span className="tm-cpu-mini">
                      <span className="tm-cpu-bar" style={{ width: `${item.cpu}%` }} />
                    </span>
                    <span className="tm-cpu-val">{item.cpu}%</span>
                  </span>
                  <span className="tm-td">
                    <span className={`tm-badge tm-badge-${item.status}`}>
                      {item.status === 'running' ? '● Running' : '✓ Completed'}
                    </span>
                  </span>
                </button>
              ))}
            </div>

            {/* Detail panel */}
            {selectedItem && (
              <div className="tm-detail">
                <div className="tm-detail-top">
                  <span className="tm-detail-icon">{selectedItem.icon}</span>
                  <div className="tm-detail-info">
                    <div className="tm-detail-name">{selectedItem.name}</div>
                    <div className="tm-detail-company">{selectedItem.company}</div>
                  </div>
                  <span className={`tm-badge tm-badge-${selectedItem.status}`}>
                    {selectedItem.status === 'running' ? '● Running' : '✓ Completed'}
                  </span>
                </div>

                <p className="tm-detail-desc">{selectedItem.desc}</p>

                <div className="tm-detail-gauges">
                  <div className="tm-gauge-row">
                    <span className="tm-gauge-label">CPU</span>
                    <div className="tm-gauge-track">
                      <div className="tm-gauge-fill" style={{ width: `${selectedItem.cpu}%`, background: '#a855f7' }} />
                    </div>
                    <span className="tm-gauge-pct">{selectedItem.cpu}%</span>
                  </div>
                  <div className="tm-gauge-row">
                    <span className="tm-gauge-label">MEM</span>
                    <div className="tm-gauge-track">
                      <div className="tm-gauge-fill" style={{ width: `${selectedItem.mem}%`, background: '#6366f1' }} />
                    </div>
                    <span className="tm-gauge-pct">{selectedItem.mem}%</span>
                  </div>
                </div>

                {selectedItem.tags.length > 0 && (
                  <div className="tm-detail-tags">
                    {selectedItem.tags.map(t => (
                      <span key={t} className="tm-tag">{t}</span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="tm-perf-body">
            <div className="tm-perf-title">Utilisation des ressources · Stack Technique</div>
            <div className="tm-skills-grid">
              {SKILLS.map(s => (
                <SkillBar key={s.name} {...s} />
              ))}
            </div>
          </div>
        )}

        {/* Status bar */}
        <div className="tm-statusbar">
          <span>{displayed.length} processus</span>
          <span>|</span>
          <span>{displayed.filter(i => i.status === 'running').length} actifs</span>
          <span>|</span>
          <span>CPU avg: {Math.round(displayed.reduce((s, i) => s + i.cpu, 0) / displayed.length)}%</span>
        </div>

      </div>
    </section>
  )
}

export default Experiences
