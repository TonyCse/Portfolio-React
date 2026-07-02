import React, { useState, useRef, useEffect, useCallback } from 'react'
import { sfx } from './sfx'
import './HobbiesGame.css'
import imgVictoire from '../../images/victoire.png'
import imgAttack   from '../../images/attack.png'
import imgAie      from '../../images/aie.png'

/* ── Persistent save (read once at module load) ── */
function readSave() {
  try {
    return {
      xp:           parseInt(localStorage.getItem('tonyos_game_xp') || '0', 10),
      collected:    new Set(JSON.parse(localStorage.getItem('tonyos_game_collected') || '[]')),
      visited:      new Set(JSON.parse(localStorage.getItem('tonyos_game_visited')   || '[]')),
      questState:   localStorage.getItem('tonyos_game_quest') || null,
      questKills:   parseInt(localStorage.getItem('tonyos_game_quest_kills') || '0', 10),
      bossDefeated: localStorage.getItem('tonyos_boss_defeated') === '1',
    }
  } catch { return { xp: 0, collected: new Set(), visited: new Set(), questState: null, questKills: 0, bossDefeated: false } }
}
const GAME_SAVE = readSave()

/* ── World constants ── */
const WORLD_W = 2.2
const WORLD_H = 1.8
const SPEED        = 200
const SPRINT_MUL   = 1.75
const NPC_SPEED    = 48
const MONSTER_SPEED = 55
const ZONE_RADIUS   = 76
const COLLECT_R     = 44
const NPC_TALK_R    = 82
const MONSTER_CHASE_R = 200
const MONSTER_HIT_R   = 22
const DUST_MS = 110

/* ── Level system ── */
const LEVELS = [
  { lv: 1, min: 0,   label: 'NOVICE',      color: '#94a3b8', maxHp: 22, atk: 7,  def: 2 },
  { lv: 2, min: 40,  label: 'VOYAGEUR',    color: '#6ee7b7', maxHp: 28, atk: 9,  def: 3 },
  { lv: 3, min: 100, label: 'EXPLORATEUR', color: '#4ade80', maxHp: 36, atk: 12, def: 4 },
  { lv: 4, min: 200, label: 'AVENTURIER',  color: '#60a5fa', maxHp: 46, atk: 15, def: 5 },
  { lv: 5, min: 350, label: 'CHAMPION',    color: '#c084fc', maxHp: 58, atk: 19, def: 7 },
  { lv: 6, min: 550, label: 'HÉROS',       color: '#f472b6', maxHp: 72, atk: 24, def: 9 },
  { lv: 7, min: 800, label: 'LÉGENDE',     color: '#fbbf24', maxHp: 90, atk: 30, def: 11 },
]
function getLevel(xp) {
  let lv = LEVELS[0]
  for (const l of LEVELS) { if (xp >= l.min) lv = l }
  return lv
}
function nextLevelXP(xp) {
  for (let i = 1; i < LEVELS.length; i++) {
    if (xp < LEVELS[i].min) return LEVELS[i].min
  }
  return null
}

/* ── Monster types ── */
const MONSTER_TYPES = {
  bug:    { name: 'BUGMON',    icon: '🐛', hp: 14, atk: 5,  def: 0, xpGain: 18,  color: '#22c55e' },
  glitch: { name: 'GLITCH',   icon: '👾', hp: 20, atk: 8,  def: 1, xpGain: 28,  color: '#8b5cf6' },
  crash:  { name: 'CRASH',    icon: '💥', hp: 10, atk: 11, def: 0, xpGain: 22,  color: '#f97316' },
  virus:  { name: 'VIRUS',    icon: '🦠', hp: 26, atk: 6,  def: 3, xpGain: 32,  color: '#06b6d4' },
  boss:   { name: 'DARK CORR',icon: '💀', hp: 65, atk: 18, def: 6, xpGain: 120, color: '#f43f5e' },
}

const INIT_MONSTERS = [
  { id: 'm1', type: 'bug',    pos: { x: 0.72, y: 0.25 }, spawn: { x: 0.72, y: 0.25 } },
  { id: 'm2', type: 'glitch', pos: { x: 0.20, y: 0.38 }, spawn: { x: 0.20, y: 0.38 } },
  { id: 'm3', type: 'crash',  pos: { x: 0.65, y: 0.75 }, spawn: { x: 0.65, y: 0.75 } },
  { id: 'm4', type: 'virus',  pos: { x: 0.42, y: 0.25 }, spawn: { x: 0.42, y: 0.25 } },
]
const RESPAWN_DELAY = 25

/* ── Zone interiors (NPC dialogues) ── */
const ZONE_INTERIORS = {
  manga: {
    bg: '#001828', accent: '#38D9FF',
    npc: { sprite: '📚', name: 'BIBLIO' },
    lines: ["Bienvenue dans la bibliothèque !", "One Piece, Berserk, Vagabond…", "Jujutsu Kaisen, Dandadan !", "Ces œuvres ont forgé Tony autant que le code. 📚"],
  },
  videotheque: {
    bg: '#050a18', accent: '#C89B3C',
    npc: { sprite: '🎮', name: 'GAMER' },
    lines: ["LoL, Dofus, Overwatch ici…", "Et aussi : Powerwash Simulator,", "Crimson Desert, Clair Obscure —", "Expedition 33, un voyage inoubliable. 🎮"],
  },
  secret: {
    bg: '#0a0020', accent: '#a855f7',
    npc: { sprite: '🧑‍💻', name: 'DEV TONY' },
    isBossZone: true,
    lines: [
      "🖥️ Bienvenue dans ma Dev Cave, Explorateur !",
      "React · Next.js · Node · Laravel · PostgreSQL",
      "Bac+4 Full Stack ✓ — Open to work 🟢",
      "⚠️ Mais DARK CORR veille sur ces lieux...",
      "Oses-tu affronter le Boss Final ?",
    ],
  },
}

/* ── Zones ── */
const ZONES = [
  { id: 'manga',       world: 'Bibliothèque', name: 'Grande Bibliothèque', icon: '📖', color: '#38D9FF', pos: { x: 0.35, y: 0.20 },
    desc: "One Piece, Berserk, Vagabond… des œuvres qui ont façonné Tony autant que les lignes de code.",
    detail: "Le manga, c'est de l'animation pure dans une page. Un art à part entière." },
  { id: 'videotheque', world: 'Vidéothèque',  name: 'Salle des Jeux',     icon: '🎮', color: '#C89B3C', pos: { x: 0.68, y: 0.62 },
    desc: "LoL, Dofus, Overwatch… mais aussi Powerwash Simulator, Crimson Desert, Expedition 33.",
    detail: "Du multi compétitif au solo narratif, chaque jeu est un univers à part entière." },
]
const SECRET_ZONE = {
  id: 'secret', world: 'Dev Cave', name: 'Salle Secrète', icon: '🖥️', color: '#a855f7',
  pos: { x: 0.50, y: 0.82 },
  desc: "Tu as trouvé la Dev Cave ! C'est ici que React, Node et Laravel prennent vie, ligne par ligne.",
  detail: "La zone secrète du portfolio. Félicitations, Explorateur ! 🏆",
}
const HOME = { pos: { x: 0.12, y: 0.62 }, icon: '🏡', name: 'Chez Tony', color: '#6ee7b7' }

/* Routes purement H/V — aucune diagonale
   Rue principale : HOME(12,62) ──── junction manga(35,62) ──── videotheque(68,62)
   Bretelle nord  : junction manga(35,62) ──── bibliothèque(35,20)
   Bretelle sud   : center(50,62) ──── Dev Cave(50,82)               */
const ZONE_PATHS = []
const EXTRA_SEGS = [
  [12, 62, 68, 62],  // rue principale H
  [35, 20, 35, 62],  // bretelle V → bibliothèque
  [50, 62, 50, 82],  // bretelle V → Dev Cave
]

function buildSegs(zones) {
  return [
    ...ZONE_PATHS.map(([a, b]) => {
      const z1 = zones.find(z => z.id === a), z2 = zones.find(z => z.id === b)
      return [z1.pos.x * 100, z1.pos.y * 100, z2.pos.x * 100, z2.pos.y * 100]
    }),
    ...EXTRA_SEGS,
  ]
}

const DECOS = [
  // ── Forêt Nord ──
  { e: '🌲', x: 0.01, y: 0.01 }, { e: '🌳', x: 0.07, y: 0.02 }, { e: '🌲', x: 0.13, y: 0.01 },
  { e: '🌳', x: 0.19, y: 0.02 }, { e: '🌲', x: 0.25, y: 0.01 }, { e: '🌳', x: 0.31, y: 0.02 },
  { e: '🌲', x: 0.37, y: 0.01 }, { e: '🌳', x: 0.43, y: 0.02 }, { e: '🌲', x: 0.49, y: 0.01 },
  { e: '🌳', x: 0.55, y: 0.02 }, { e: '🌲', x: 0.61, y: 0.01 }, { e: '🌳', x: 0.67, y: 0.02 },
  { e: '🌲', x: 0.73, y: 0.01 }, { e: '🌳', x: 0.79, y: 0.02 }, { e: '🌲', x: 0.85, y: 0.01 },
  { e: '🌳', x: 0.91, y: 0.02 }, { e: '🌲', x: 0.97, y: 0.01 },
  { e: '🌿', x: 0.04, y: 0.06 }, { e: '🌲', x: 0.10, y: 0.07 }, { e: '🌿', x: 0.16, y: 0.06 },
  { e: '🌲', x: 0.28, y: 0.07 }, { e: '🌿', x: 0.34, y: 0.06 }, { e: '🌲', x: 0.46, y: 0.07 },
  { e: '🌿', x: 0.52, y: 0.06 }, { e: '🌲', x: 0.58, y: 0.07 }, { e: '🌿', x: 0.70, y: 0.06 },
  { e: '🌲', x: 0.76, y: 0.07 }, { e: '🌿', x: 0.88, y: 0.06 }, { e: '🌲', x: 0.94, y: 0.07 },
  // ── Forêt Sud ──
  { e: '🌲', x: 0.01, y: 0.96 }, { e: '🌳', x: 0.07, y: 0.97 }, { e: '🌲', x: 0.13, y: 0.96 },
  { e: '🌳', x: 0.19, y: 0.97 }, { e: '🌲', x: 0.25, y: 0.96 }, { e: '🌳', x: 0.31, y: 0.97 },
  { e: '🌲', x: 0.37, y: 0.96 }, { e: '🌳', x: 0.43, y: 0.97 }, { e: '🌲', x: 0.49, y: 0.96 },
  { e: '🌳', x: 0.55, y: 0.97 }, { e: '🌲', x: 0.61, y: 0.96 }, { e: '🌳', x: 0.67, y: 0.97 },
  { e: '🌲', x: 0.73, y: 0.96 }, { e: '🌳', x: 0.79, y: 0.97 }, { e: '🌲', x: 0.85, y: 0.96 },
  { e: '🌳', x: 0.91, y: 0.97 }, { e: '🌲', x: 0.97, y: 0.96 },
  { e: '🌲', x: 0.04, y: 0.90 }, { e: '🌿', x: 0.10, y: 0.91 }, { e: '🌲', x: 0.22, y: 0.90 },
  { e: '🌿', x: 0.28, y: 0.91 }, { e: '🌲', x: 0.40, y: 0.90 }, { e: '🌿', x: 0.52, y: 0.91 },
  { e: '🌲', x: 0.64, y: 0.90 }, { e: '🌿', x: 0.76, y: 0.91 }, { e: '🌲', x: 0.88, y: 0.90 },
  { e: '🌿', x: 0.94, y: 0.91 },
  // ── Forêt Ouest ──
  { e: '🌲', x: 0.01, y: 0.10 }, { e: '🌳', x: 0.02, y: 0.16 }, { e: '🌲', x: 0.01, y: 0.22 },
  { e: '🌳', x: 0.02, y: 0.28 }, { e: '🌲', x: 0.01, y: 0.34 }, { e: '🌳', x: 0.02, y: 0.40 },
  { e: '🌲', x: 0.01, y: 0.46 }, { e: '🌳', x: 0.02, y: 0.52 }, { e: '🌲', x: 0.01, y: 0.58 },
  { e: '🌳', x: 0.02, y: 0.64 }, { e: '🌲', x: 0.01, y: 0.70 }, { e: '🌳', x: 0.02, y: 0.76 },
  { e: '🌲', x: 0.01, y: 0.82 }, { e: '🌳', x: 0.02, y: 0.88 },
  { e: '🌿', x: 0.07, y: 0.13 }, { e: '🌲', x: 0.08, y: 0.19 }, { e: '🌿', x: 0.07, y: 0.31 },
  { e: '🌲', x: 0.08, y: 0.43 }, { e: '🌿', x: 0.07, y: 0.55 }, { e: '🌲', x: 0.08, y: 0.67 },
  { e: '🌿', x: 0.07, y: 0.79 },
  // ── Forêt Est ──
  { e: '🌲', x: 0.97, y: 0.10 }, { e: '🌳', x: 0.96, y: 0.16 }, { e: '🌲', x: 0.97, y: 0.22 },
  { e: '🌳', x: 0.96, y: 0.28 }, { e: '🌲', x: 0.97, y: 0.34 }, { e: '🌳', x: 0.96, y: 0.40 },
  { e: '🌲', x: 0.97, y: 0.46 }, { e: '🌳', x: 0.96, y: 0.52 }, { e: '🌲', x: 0.97, y: 0.58 },
  { e: '🌳', x: 0.96, y: 0.64 }, { e: '🌲', x: 0.97, y: 0.70 }, { e: '🌳', x: 0.96, y: 0.76 },
  { e: '🌲', x: 0.97, y: 0.82 }, { e: '🌳', x: 0.96, y: 0.88 },
  { e: '🌿', x: 0.90, y: 0.13 }, { e: '🌲', x: 0.91, y: 0.25 }, { e: '🌿', x: 0.90, y: 0.37 },
  { e: '🌲', x: 0.91, y: 0.49 }, { e: '🌿', x: 0.90, y: 0.61 }, { e: '🌲', x: 0.91, y: 0.73 },
  { e: '🌿', x: 0.90, y: 0.85 },
  // ── Décorations intérieures du village ──
  { e: '🌿', x: 0.18, y: 0.32 }, { e: '🌿', x: 0.42, y: 0.26 }, { e: '🌿', x: 0.67, y: 0.35 },
  { e: '🌿', x: 0.15, y: 0.60 }, { e: '🌿', x: 0.40, y: 0.60 },
  { e: '🍄', x: 0.42, y: 0.46 }, { e: '🍄', x: 0.19, y: 0.86 }, { e: '🍄', x: 0.78, y: 0.88 },
  { e: '🌸', x: 0.37, y: 0.36 }, { e: '🌸', x: 0.10, y: 0.30 }, { e: '🌸', x: 0.72, y: 0.50 },
  { e: '🌳', x: 0.14, y: 0.64 },
]

const COLLECTIBLES = [
  { id: 'c1', icon: '💫', x: 0.22, y: 0.20 },
  { id: 'c2', icon: '💎', x: 0.70, y: 0.28 },
  { id: 'c3', icon: '📜', x: 0.18, y: 0.55 },
  { id: 'c4', icon: '🗝️', x: 0.72, y: 0.65 },
  { id: 'c5', icon: '⭐', x: 0.38, y: 0.80 },
]

/* Le sorcier patrouille uniquement sur les routes du village */
const NPC_WAYPOINTS = [
  { x: 0.12, y: 0.62 }, // HOME
  { x: 0.35, y: 0.62 }, // carrefour bibliothèque
  { x: 0.35, y: 0.20 }, // bibliothèque
  { x: 0.35, y: 0.62 }, // retour carrefour
  { x: 0.50, y: 0.62 }, // centre (carrefour Dev Cave)
  { x: 0.68, y: 0.62 }, // vidéothèque
  { x: 0.50, y: 0.62 }, // retour centre
  { x: 0.50, y: 0.82 }, // Dev Cave
  { x: 0.50, y: 0.62 }, // retour centre
]
const NPC_QUOTES = [
  "La bibliothèque vaut le détour ! 📖",
  "LoL, Dofus... la Vidéothèque t'attend ! 🎮",
  "Expedition 33 est une vraie pépite ✨",
  "Il paraît qu'il y a des fragments cachés...",
  "Attention aux monstres dans les parages !",
  "Tony code et joue — un vrai double talent 🧑‍💻",
  "Berserk, Vagabond... des chefs-d'œuvre ! 📚",
]

/* ── XP Bar ── */
function XPBar({ xp }) {
  const lv   = getLevel(xp)
  const next = nextLevelXP(xp)
  const pct  = next ? Math.round(((xp - lv.min) / (next - lv.min)) * 100) : 100
  const barColor = pct > 50 ? '#58d858' : pct > 20 ? '#f8d030' : '#e83030'
  return (
    <div className="hg-xp-bar">
      <span className="hg-xp-label">EXP</span>
      <div className="hg-xp-track"><div className="hg-xp-fill" style={{ width: `${pct}%`, background: barColor }} /></div>
      <span className="hg-xp-val">{xp}</span>
    </div>
  )
}

/* ── HP Bar ── */
function HPBar({ current, max }) {
  const pct   = Math.max(0, Math.round((current / max) * 100))
  const color = pct > 50 ? '#58d858' : pct > 20 ? '#f8d030' : '#e83030'
  return (
    <div className="hg-hp-bar">
      <span className="hg-hp-label">HP</span>
      <div className="hg-hp-track"><div className="hg-hp-fill" style={{ width: `${pct}%`, background: color }} /></div>
      <span className="hg-hp-val">{current}/{max}</span>
    </div>
  )
}

/* ── Zone building ── */
function ZoneHouse({ z, isNear, isVisited }) {
  return (
    <div
      className={`hg-zone${isNear ? ' hg-zone-near' : ''}${isVisited ? ' hg-zone-visited' : ''}`}
      style={{ left: `${z.pos.x * 100}%`, top: `${z.pos.y * 100}%`, '--zc': z.color }}
    >
     
      {isNear && <div className="hg-e-prompt">E</div>}
      <div className="hg-zone-house">
        <div className="hg-zone-chimney"><div className="hg-zone-smoke" /></div>
        <div className="hg-zone-roof" />
        <div className="hg-zone-facade">
          <div className="hg-zone-winrow"><div className="hg-zone-win" /><div className="hg-zone-win" /></div>
          <span className="hg-zone-icon">{z.icon}</span>
          <div className="hg-zone-door" />
        </div>
      </div>
      <div className="hg-zone-sign">{z.world}</div>
      {isVisited && !isNear && <div className="hg-zone-dot" />}
    </div>
  )
}

/* ── Battle Screen ── */
function BattleScreen({ battle, playerHp, playerMaxHp, playerLevel, onAction, battleAnim }) {
  const mType   = MONSTER_TYPES[battle.monsterType]
  const mHpPct  = Math.max(0, Math.round((battle.monsterHp / mType.hp) * 100))
  const pHpPct  = Math.max(0, Math.round((playerHp / playerMaxHp) * 100))
  const mHpColor = mHpPct > 50 ? '#4ade80' : mHpPct > 20 ? '#fbbf24' : '#f87171'
  const pHpColor = pHpPct > 50 ? '#4ade80' : pHpPct > 20 ? '#fbbf24' : '#f87171'
  const isPlayerTurn = battle.phase === 'player'
  const isEnding     = ['end_win', 'end_lose', 'end_run'].includes(battle.phase)

  return (
    <div className="hg-battle">
      {battle.phase === 'intro' && (
        <div className="hg-battle-intro">
          <div className="hg-battle-intro-text">Un {mType.name} sauvage apparaît !</div>
        </div>
      )}

      <div className="hg-battle-scene" style={{ '--mc': mType.color }}>
        {/* Côté ennemi */}
        <div className="hg-battle-enemy-side">
          <div className="hg-battle-card" style={{ '--cc': mType.color }}>
            <div className="hg-battle-cname" style={{ color: mType.color }}>{mType.name}</div>
            <div className="hg-battle-type-badge" style={{ background: mType.color }}>{battle.monsterType.toUpperCase()}</div>
            <div className="hg-battle-hp-row">
              <span className="hg-battle-hp-lbl">HP</span>
              <div className="hg-battle-hp-track">
                <div className="hg-battle-hp-fill" style={{ width: `${mHpPct}%`, background: mHpColor }} />
              </div>
              <span className="hg-battle-hp-val">{battle.monsterHp}/{mType.hp}</span>
            </div>
          </div>
          <div className={`hg-battle-enemy-sprite${battleAnim === 'enemy-hit' ? ' anim-hit' : battleAnim === 'enemy-atk' ? ' anim-atk-left' : ''}`} style={{ '--mc': mType.color }}>
            {mType.icon}
          </div>
        </div>

        {/* Côté joueur */}
        <div className="hg-battle-player-side">
          <div className={`hg-battle-player-sprite${battleAnim === 'player-hit' ? ' anim-hit' : battleAnim === 'player-atk' ? ' anim-atk-right' : ''}`}>
            <img
              src={battleAnim === 'player-atk' ? imgAttack : battleAnim === 'player-hit' ? imgAie : imgVictoire}
              alt="Tony"
              className="hg-battle-player-img"
            />
          </div>
          <div className="hg-battle-card hg-battle-card-player">
            <div className="hg-battle-cname" style={{ color: '#c084fc' }}>TONY</div>
            <div className="hg-battle-type-badge" style={{ background: '#7c3aed' }}>{playerLevel ? playerLevel.label : 'NOVICE'}</div>
            <div className="hg-battle-hp-row">
              <span className="hg-battle-hp-lbl">HP</span>
              <div className="hg-battle-hp-track">
                <div className="hg-battle-hp-fill" style={{ width: `${pHpPct}%`, background: pHpColor }} />
              </div>
              <span className="hg-battle-hp-val">{playerHp}/{playerMaxHp}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="hg-battle-log">
        <div className="hg-battle-log-inner">
          <div className="hg-battle-log-text">{battle.log}</div>
          {isEnding && <div className="hg-dialog-cursor">▼</div>}
        </div>
      </div>

      {isPlayerTurn && (
        <div className="hg-battle-actions">
          <button className="hg-battle-btn hg-battle-btn-atk" onClick={() => onAction('attack')}>ATTAQUER</button>
          <button
            className={`hg-battle-btn hg-battle-btn-talent${battle.talentCd > 0 ? ' hg-battle-btn-cd' : ''}`}
            onClick={() => onAction('talent')}
            disabled={battle.talentCd > 0}
          >TALENT{battle.talentCd > 0 ? ` (${battle.talentCd})` : ''}</button>
          <button className="hg-battle-btn hg-battle-btn-flee" onClick={() => onAction('flee')}>FUIR</button>
        </div>
      )}
    </div>
  )
}

/* ── Interior View ── */
function InteriorView({ zone, nearNpc, dialog, dialogLine, onAdvanceDialog, onExit, playerElRef, onBossChallenge, bossDefeated }) {
  const interior = ZONE_INTERIORS[zone.id]
  if (!interior) return null
  const isLast = dialogLine >= interior.lines.length - 1
  const showBossChoice = !!interior.isBossZone && dialog && isLast && !bossDefeated

  return (
    <div className="hg-interior" style={{ '--ia': interior.accent, '--ib': interior.bg }}>
      <button className="hg-interior-exit-btn" onClick={onExit}>✕ EXIT</button>

      <div className="hg-interior-room">
        <div className="hg-interior-wall" />
        <div className="hg-interior-floor" />

        {/* Porte de sortie au bas de la pièce */}
        <div className="hg-int-door" />

        {/* PNJ centré en haut */}
        <div className="hg-interior-npc-wrap">
          {nearNpc && !dialog && (
            <div className="hg-e-prompt hg-int-e-prompt">E</div>
          )}
          <div className="hg-interior-npc-sprite">{interior.npc.sprite}</div>
          <div className="hg-interior-npc-name" style={{ color: interior.accent }}>{interior.npc.name}</div>
        </div>

        {/* Joueur — manipulé directement via ref */}
        <div
          className="hg-player hg-int-player"
          ref={playerElRef}
          style={{ left: '50%', top: '78%' }}
          data-moving="0" data-dir="s"
        >
          <div className="hg-player-name">TONY</div>
          <div className="hg-player-sprite">🧑‍💻</div>
          <div className="hg-player-shadow" />
        </div>
      </div>

      {/* Boîte de dialogue PNJ */}
      {dialog ? (
        <div className="hg-interior-dialog" onClick={!showBossChoice ? onAdvanceDialog : undefined}>
          <div className="hg-interior-dialog-inner">
            <div className="hg-interior-speaker" style={{ color: interior.accent }}>{interior.npc.name}</div>
            <div className="hg-interior-text">{interior.lines[dialogLine]}</div>
            {!isLast && <div className="hg-dialog-cursor">▼</div>}
            {isLast && !showBossChoice && !bossDefeated && <div className="hg-interior-exit-hint">[ E pour continuer ]</div>}
            {isLast && interior.isBossZone && bossDefeated && (
              <div className="hg-interior-exit-hint">[ DARK CORR est vaincu ! LÉGENDE 🏆 ]</div>
            )}
            {showBossChoice && (
              <div className="hg-boss-choice">
                <button className="hg-boss-choice-fight" onClick={onBossChallenge}>⚔️ AFFRONTER</button>
                <button className="hg-boss-choice-flee"  onClick={onExit}>🚪 PARTIR</button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="hg-interior-hint-bar">
          <span className="hg-idle-hint">WASD: déplacer · E: parler · marche vers la porte ↓ pour sortir</span>
        </div>
      )}
    </div>
  )
}

/* ══════════════════════════════════════════════════════
   Main component
   ══════════════════════════════════════════════════════ */
function HobbiesGame() {
  const mapRef    = useRef(null)
  const worldRef  = useRef(null)
  const playerRef = useRef(null)
  const npcElRef  = useRef(null)
  const keysRef   = useRef({})

  const posRef  = useRef({ x: 0.12, y: 0.66 })
  const zoomRef = useRef(1.0)
  const rafRef  = useRef(null)
  const lastT   = useRef(null)

  const npcRef         = useRef({ pos: { x: 0.12, y: 0.62 }, targetIdx: 0, waitTime: 2 })
  const npcNearRef     = useRef(false)
  const npcQuoteIdxRef = useRef(0)

  const collectedRef    = useRef(new Set(GAME_SAVE.collected))
  const visitedRef      = useRef(new Set(GAME_SAVE.visited))
  const xpRef           = useRef(GAME_SAVE.xp)
  const questRef        = useRef(GAME_SAVE.questState)
  const questKillsRef   = useRef(GAME_SAVE.questKills)
  const minimapRef      = useRef(null)
  const footprintTimerRef = useRef(0)
  const stepSfxTimerRef   = useRef(0)
  const lvTimerRef   = useRef(null)
  const dustTimerRef = useRef(0)
  const nearRef      = useRef(null)

  /* battle / interior refs */
  const playerHpRef    = useRef(getLevel(GAME_SAVE.xp).maxHp)
  const inBattleRef    = useRef(false)
  const insideZoneRef  = useRef(null)
  const battleRef      = useRef(null)
  const bossDefeatedRef= useRef(GAME_SAVE.bossDefeated)

  /* interior exploration refs */
  const interiorPlayerElRef = useRef(null)
  const interiorPosRef      = useRef({ x: 0.5, y: 0.78 })
  const interiorNearNpcRef  = useRef(false)
  const interiorDialogRef   = useRef(false)
  const interiorDialogLineRef = useRef(0)

  /* monster refs */
  const monstersRef   = useRef(
    INIT_MONSTERS.map(m => ({
      ...m,
      pos: { ...m.pos },
      stunTime: 0,
      chasing: false,
      waitTime: Math.random() * 2,
      wanderDx: Math.random() - 0.5,
      wanderDy: Math.random() - 0.5,
      dead: false,
      respawnTimer: 0,
    }))
  )
  const monsterElsRef = useRef({})

  /* ── React state ── */
  const [nearZone,       setNearZone]       = useState(null)
  const [visited,        setVisited]        = useState(() => new Set(GAME_SAVE.visited))
  const [collected,      setCollected]      = useState(() => new Set(GAME_SAVE.collected))
  const [npcNear,        setNpcNear]        = useState(false)
  const [npcQuote,       setNpcQuote]       = useState(NPC_QUOTES[0])
  const [xp,             setXp]             = useState(GAME_SAVE.xp)
  const [questState,     setQuestState]     = useState(GAME_SAVE.questState)
  const [questKills,     setQuestKills]     = useState(GAME_SAVE.questKills)
  const [questDialog,    setQuestDialog]    = useState(null)
  const [hitFlash,       setHitFlash]       = useState(false)
  const [levelUpMsg,     setLevelUpMsg]     = useState(null)
  const [playerHp,       setPlayerHp]       = useState(getLevel(GAME_SAVE.xp).maxHp)
  const [battle,         setBattle]         = useState(null)
  const [insideZone,     setInsideZone]     = useState(null)
  const [battleAnim,     setBattleAnim]     = useState(null)
  const [interiorNearNpc, setInteriorNearNpc] = useState(false)
  const [interiorDialog,  setInteriorDialog]  = useState(false)
  const [intDialogLine,   setIntDialogLine]   = useState(0)
  const [bossDefeated,   setBossDefeated]   = useState(GAME_SAVE.bossDefeated)

  /* mirror battle to ref */
  useEffect(() => { battleRef.current = battle }, [battle])

  /* persist game progress */
  useEffect(() => { localStorage.setItem('tonyos_game_xp', String(xp)) }, [xp])
  useEffect(() => { localStorage.setItem('tonyos_game_collected', JSON.stringify([...collected])) }, [collected])
  useEffect(() => { localStorage.setItem('tonyos_game_visited',   JSON.stringify([...visited]))   }, [visited])
  useEffect(() => { if (questState) localStorage.setItem('tonyos_game_quest', questState) }, [questState])
  useEffect(() => { localStorage.setItem('tonyos_game_quest_kills', String(questKills)) }, [questKills])
  useEffect(() => { localStorage.setItem('tonyos_boss_defeated', bossDefeated ? '1' : '0') }, [bossDefeated])

  /* wheel → zoom autour du joueur */
  useEffect(() => {
    const el = mapRef.current
    if (!el) return
    const onWheel = (e) => {
      e.preventDefault()
      zoomRef.current = Math.max(0.35, Math.min(2.0, zoomRef.current - e.deltaY * 0.0008))
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [])

  const allFound = collected.size === COLLECTIBLES.length

  /* ── grantXP ── */
  const grantXP = useCallback((delta) => {
    const prev = xpRef.current
    xpRef.current = Math.max(0, prev + delta)
    setXp(xpRef.current)
    const pl = getLevel(prev), nl = getLevel(xpRef.current)
    if (nl.lv > pl.lv) {
      playerHpRef.current = nl.maxHp
      setPlayerHp(nl.maxHp)
      setLevelUpMsg(`⬆ ${nl.label} ! (LV${nl.lv})`)
      clearTimeout(lvTimerRef.current)
      lvTimerRef.current = setTimeout(() => setLevelUpMsg(null), 2600)
      sfx.levelUp()
    }
  }, [])

  /* ── Building enter/exit ── */
  const enterBuilding = useCallback((zone) => {
    if (!ZONE_INTERIORS[zone.id]) return
    sfx.enter()
    insideZoneRef.current = zone
    setInsideZone(zone)
    interiorPosRef.current = { x: 0.5, y: 0.78 }
    interiorNearNpcRef.current = false
    setInteriorNearNpc(false)
    interiorDialogRef.current = false
    setInteriorDialog(false)
    interiorDialogLineRef.current = 0
    setIntDialogLine(0)
  }, [])

  const exitBuilding = useCallback(() => {
    insideZoneRef.current = null
    setInsideZone(null)
    interiorNearNpcRef.current = false
    setInteriorNearNpc(false)
    interiorDialogRef.current = false
    setInteriorDialog(false)
    interiorDialogLineRef.current = 0
    setIntDialogLine(0)
  }, [])

  const startInteriorDialog = useCallback(() => {
    interiorDialogRef.current = true
    interiorDialogLineRef.current = 0
    setInteriorDialog(true)
    setIntDialogLine(0)
  }, [])

  const advanceInteriorDialog = useCallback(() => {
    const zone = insideZoneRef.current
    if (!zone) return
    const interior = ZONE_INTERIORS[zone.id]
    if (!interior) return
    const next = interiorDialogLineRef.current + 1
    if (next >= interior.lines.length) {
      interiorDialogRef.current = false
      interiorDialogLineRef.current = 0
      setInteriorDialog(false)
      setIntDialogLine(0)
    } else {
      interiorDialogLineRef.current = next
      setIntDialogLine(next)
    }
  }, [])

  /* ── NPC quest interaction ── */
  const handleNpcTalk = useCallback(() => {
    const qs = questRef.current
    let text, type
    sfx.npc()

    if (qs === null) {
      questRef.current = 'active'
      setQuestState('active')
      text = "Aventurier ! Bats 3 créatures qui rôdent dans les plaines… et je te récompenserai !"
      type = 'offer'
      sfx.quest()
    } else if (qs === 'active') {
      const k = questKillsRef.current
      text = k === 0
        ? "Les créatures t'attendent dans les plaines… Vas-y !"
        : `Bien ! Tu en es à ${k}/3. Continue, courage !`
      type = 'progress'
    } else if (qs === 'ready') {
      questRef.current = 'done'
      setQuestState('done')
      grantXP(100)
      text = "Impressionnant ! Tu mérites cette récompense : +100 EXP. Tu es un vrai aventurier !"
      type = 'reward'
      sfx.win()
    } else if (qs === 'done') {
      questRef.current = 'q2_active'
      setQuestState('q2_active')
      text = "Excellent héros ! Nouvelle mission : trouve les 5 fragments sacrés cachés dans les plaines !"
      type = 'q2_offer'
      sfx.quest()
    } else if (qs === 'q2_active') {
      const c = collectedRef.current.size
      text = `Fragments trouvés : ${c}/5 ! Continue l'exploration !`
      type = 'q2_progress'
    } else if (qs === 'q2_ready') {
      questRef.current = 'q2_done'
      setQuestState('q2_done')
      grantXP(150)
      text = "EXTRAORDINAIRE ! Tous les fragments ! +150 EXP · Tu es une LÉGENDE ! 🌟"
      type = 'q2_reward'
      sfx.win()
    } else {
      text = "Bravo Légende ! Tu as tout accompli dans ce monde. Tu peux être fier de toi ! 🌟"
      type = 'q2_done'
    }
    setQuestDialog({ text, type })
    setTimeout(() => setQuestDialog(null), 4500)
  }, [grantXP])

  /* ── Boss battle trigger ── */
  const startBossBattle = useCallback(() => {
    exitBuilding()
    setTimeout(() => startBattle('boss_npc', 'boss'), 200)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Battle: start ── */
  const startBattle = useCallback((monsterId, monsterType) => {
    if (inBattleRef.current) return
    inBattleRef.current = true
    const mType = MONSTER_TYPES[monsterType]
    const newBattle = {
      monsterId, monsterType,
      monsterHp: mType.hp,
      phase: 'intro',
      log: `Un ${mType.name} sauvage apparaît !`,
      talentCd: 0,
    }
    battleRef.current = newBattle
    setBattle(newBattle)
    setTimeout(() => {
      setBattle(prev => {
        if (!prev) return prev
        const b = { ...prev, phase: 'player', log: 'Que faire ?' }
        battleRef.current = b
        return b
      })
    }, 1500)
  }, [])

  /* ── Battle: player actions ── */
  const handleBattleAction = useCallback((action) => {
    const prev = battleRef.current
    if (!prev || prev.phase !== 'player') return
    const lv    = getLevel(xpRef.current)
    const mType = MONSTER_TYPES[prev.monsterType]

    if (action === 'flee') {
      const success = Math.random() < 0.6
      const b = { ...prev, phase: success ? 'end_run' : 'enemy',
        log: success ? 'Tu as réussi à fuir !' : 'Impossible de fuir !' }
      battleRef.current = b
      setBattle(b)
      return
    }

    if (action === 'attack') {
      const dmg    = Math.max(1, lv.atk - mType.def + Math.floor(Math.random() * 4))
      const newMHp = Math.max(0, prev.monsterHp - dmg)
      /* Phase transitoire — désactive les boutons */
      const bAnim = { ...prev, phase: 'anim', log: '...' }
      battleRef.current = bAnim
      setBattle(bAnim)
      setBattleAnim('player-atk')
      setTimeout(() => {
        setBattleAnim('enemy-hit')
        const b = newMHp <= 0
          ? { ...prev, monsterHp: 0, phase: 'end_win', log: `${mType.name} est KO ! +${mType.xpGain} EXP` }
          : { ...prev, monsterHp: newMHp, phase: 'enemy', log: `Tu infligues ${dmg} dégâts !` }
        battleRef.current = b
        setBattle(b)
        setTimeout(() => setBattleAnim(null), 350)
      }, 700)
      return
    }

    if (action === 'talent') {
      if (prev.talentCd > 0) return
      const heal  = Math.floor(lv.maxHp * 0.35)
      const newHp = Math.min(lv.maxHp, playerHpRef.current + heal)
      playerHpRef.current = newHp
      setPlayerHp(newHp)
      setBattleAnim('player-atk')
      const b = { ...prev, phase: 'enemy', talentCd: 3, log: `Soin ! +${heal} HP !` }
      battleRef.current = b
      setBattle(b)
      setTimeout(() => setBattleAnim(null), 450)
      return
    }
  }, [])

  /* ── Battle: enemy auto-turn ── */
  useEffect(() => {
    if (!battle || battle.phase !== 'enemy') return
    const t1 = setTimeout(() => {
      setBattleAnim('enemy-atk')
      setTimeout(() => {
        const prev = battleRef.current
        if (!prev || prev.phase !== 'enemy') return
        const lv    = getLevel(xpRef.current)
        const mType = MONSTER_TYPES[prev.monsterType]
        const dmg   = Math.max(1, mType.atk - lv.def + Math.floor(Math.random() * 3))
        const newHp = Math.max(0, playerHpRef.current - dmg)
        playerHpRef.current = newHp
        setPlayerHp(newHp)
        sfx.hit()
        setHitFlash(true)
        setTimeout(() => setHitFlash(false), 500)
        setBattleAnim('player-hit')
        const newCd = Math.max(0, prev.talentCd - 1)
        const b = newHp <= 0
          ? { ...prev, talentCd: newCd, phase: 'end_lose', log: 'Tu es KO... Retour à la maison.' }
          : { ...prev, talentCd: newCd, phase: 'player', log: `${mType.name} inflige ${dmg} dégâts !` }
        battleRef.current = b
        setBattle(b)
        setTimeout(() => setBattleAnim(null), 700)
      }, 420)
    }, 500)
    return () => clearTimeout(t1)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [battle?.phase])

  /* ── Battle: end resolution ── */
  useEffect(() => {
    const phase = battle?.phase
    if (!phase || !['end_win', 'end_lose', 'end_run'].includes(phase)) return
    const prev = battleRef.current

    if (phase === 'end_win' && prev) {
      sfx.win()
      if (prev.monsterId === 'boss_npc') {
        bossDefeatedRef.current = true
        setBossDefeated(true)
      }
      const mType = MONSTER_TYPES[prev.monsterType]
      grantXP(mType.xpGain)
      const m = monstersRef.current.find(mn => mn.id === prev.monsterId)
      if (m) { m.dead = true; m.respawnTimer = RESPAWN_DELAY }
      if (questRef.current === 'active' && prev.monsterId !== 'boss_npc') {
        const newKills = questKillsRef.current + 1
        questKillsRef.current = newKills
        setQuestKills(newKills)
        if (newKills >= 3) { questRef.current = 'ready'; setQuestState('ready') }
      }
    }

    if (phase === 'end_lose') {
      sfx.lose()
      grantXP(-10)
      posRef.current = { ...HOME.pos }
      const lv  = getLevel(xpRef.current)
      const hp  = Math.floor(lv.maxHp * 0.5)
      playerHpRef.current = hp
      setPlayerHp(hp)
    }

    const delay = phase === 'end_run' ? 900 : 2000
    const timer = setTimeout(() => {
      inBattleRef.current = false
      battleRef.current   = null
      setBattle(null)
    }, delay)
    return () => clearTimeout(timer)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [battle?.phase, grantXP])

  /* ── Keyboard ── */
  useEffect(() => {
    const onDown = (e) => {
      keysRef.current[e.key] = true
      if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key)) e.preventDefault()
      if (e.key === 'e' || e.key === 'E') {
        if (insideZoneRef.current) {
          if (interiorDialogRef.current) {
            advanceInteriorDialog()
          } else if (interiorNearNpcRef.current) {
            startInteriorDialog()
          }
        } else if (npcNearRef.current) {
          handleNpcTalk()
        } else if (nearRef.current) {
          enterBuilding(nearRef.current)
        }
      }
      if (e.key === 'Escape') {
        if (insideZoneRef.current) exitBuilding()
      }
    }
    const onUp = (e) => { delete keysRef.current[e.key] }
    window.addEventListener('keydown', onDown)
    window.addEventListener('keyup',   onUp)
    return () => { window.removeEventListener('keydown', onDown); window.removeEventListener('keyup', onUp) }
  }, [advanceInteriorDialog, startInteriorDialog, enterBuilding, exitBuilding]) // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Main game loop ── */
  useEffect(() => {
    const tick = (t) => {
      if (!lastT.current) { lastT.current = t; rafRef.current = requestAnimationFrame(tick); return }
      const dt = Math.min((t - lastT.current) / 1000, 0.05)
      lastT.current = t

      /* pause physics when in battle */
      if (inBattleRef.current) { rafRef.current = requestAnimationFrame(tick); return }

      /* interior free movement */
      if (insideZoneRef.current) {
        const map = mapRef.current
        if (!interiorDialogRef.current && map) {
          const W2 = map.clientWidth  || 800
          const H2 = map.clientHeight || 360
          const pos = interiorPosRef.current
          const k   = keysRef.current
          const up    = !!(k['ArrowUp']    || k['w'] || k['W'])
          const down  = !!(k['ArrowDown']  || k['s'] || k['S'])
          const left  = !!(k['ArrowLeft']  || k['a'] || k['A'])
          const right = !!(k['ArrowRight'] || k['d'] || k['D'])
          const pps = SPEED * 0.65 * dt
          let idx = (right ? 1 : 0) - (left ? 1 : 0)
          let idy = (down  ? 1 : 0) - (up   ? 1 : 0)
          if (idx !== 0 && idy !== 0) { idx *= 0.707; idy *= 0.707 }
          pos.x = Math.max(0.07, Math.min(0.93, pos.x + idx * pps / W2))
          pos.y = Math.max(0.18, Math.min(0.88, pos.y + idy * pps / H2))
          const el = interiorPlayerElRef.current
          if (el) {
            el.style.left = `${pos.x * 100}%`
            el.style.top  = `${pos.y * 100}%`
            const isM = idx !== 0 || idy !== 0
            el.dataset.moving = isM ? '1' : '0'
            el.dataset.dir = left && !right ? 'a' : right && !left ? 'd' : up && !down ? 'w' : 's'
          }
          /* NPC is at 50%, 32% of the room */
          const npcDist = Math.hypot((pos.x - 0.5) * W2, (pos.y - 0.32) * H2)
          const nearNpc = npcDist < 58
          if (nearNpc !== interiorNearNpcRef.current) {
            interiorNearNpcRef.current = nearNpc
            setInteriorNearNpc(nearNpc)
          }
          /* Exit zone: walk into door at bottom center */
          if (pos.y > 0.84 && Math.abs(pos.x - 0.5) < 0.09) {
            exitBuilding()
            rafRef.current = requestAnimationFrame(tick)
            return
          }
        }
        rafRef.current = requestAnimationFrame(tick)
        return
      }

      const map     = mapRef.current
      const worldEl = worldRef.current
      const player  = playerRef.current
      if (!map || !worldEl || !player) { rafRef.current = requestAnimationFrame(tick); return }

      const W  = map.clientWidth  || 800
      const H  = map.clientHeight || 360
      const wW = W * WORLD_W
      const wH = H * WORLD_H

      const k      = keysRef.current
      const up     = !!(k['ArrowUp']   || k['w'] || k['W'])
      const down   = !!(k['ArrowDown'] || k['s'] || k['S'])
      const left   = !!(k['ArrowLeft'] || k['a'] || k['A'])
      const right  = !!(k['ArrowRight']|| k['d'] || k['D'])
      const sprint = !!(k['Shift'])

      let dx = (right ? 1 : 0) - (left ? 1 : 0)
      let dy = (down  ? 1 : 0) - (up   ? 1 : 0)
      const isMoving = dx !== 0 || dy !== 0
      if (dx !== 0 && dy !== 0) { dx *= 0.707; dy *= 0.707 }

      if (isMoving) {
        const pps = (sprint ? SPEED * SPRINT_MUL : SPEED) * dt
        posRef.current = {
          x: Math.max(0.13, Math.min(0.87, posRef.current.x + dx * pps / wW)),
          y: Math.max(0.13, Math.min(0.87, posRef.current.y + dy * pps / wH)),
        }
        let dir = 's'
        if (left && !right) dir = 'a'
        else if (right && !left) dir = 'd'
        else if (up && !down) dir = 'w'
        player.dataset.dir    = dir
        player.dataset.moving = '1'
        player.dataset.sprint = sprint ? '1' : '0'
      } else {
        player.dataset.moving = '0'
        player.dataset.sprint = '0'
      }
      player.style.left = `${posRef.current.x * 100}%`
      player.style.top  = `${posRef.current.y * 100}%`

      const playerWPx = posRef.current.x * wW
      const playerWPy = posRef.current.y * wH

      /* camera — toujours centré sur le joueur, zoom souris */
      const zoom = zoomRef.current
      const tx = W / 2 - playerWPx * zoom
      const ty = H / 2 - playerWPy * zoom
      worldEl.style.transform = `translate(${tx}px, ${ty}px) scale(${zoom})`

      /* zone proximity */
      let nearest = null, nearestDist = Infinity
      const allZones = collectedRef.current.size === COLLECTIBLES.length ? [...ZONES, SECRET_ZONE] : ZONES
      for (const z of allZones) {
        const d = Math.hypot(playerWPx - z.pos.x * wW, playerWPy - z.pos.y * wH)
        if (d < ZONE_RADIUS && d < nearestDist) { nearest = z; nearestDist = d }
      }
      if (nearest?.id !== nearRef.current?.id) {
        nearRef.current = nearest
        setNearZone(nearest)
        if (nearest && !visitedRef.current.has(nearest.id)) {
          visitedRef.current = new Set([...visitedRef.current, nearest.id])
          setVisited(new Set(visitedRef.current))
          grantXP(10)
        }
      }

      /* dust + footprints + step sfx */
      if (isMoving) {
        dustTimerRef.current += dt * 1000
        if (dustTimerRef.current >= DUST_MS) {
          dustTimerRef.current = 0
          const d = document.createElement('div')
          d.className = 'hg-dust'
          d.style.left = `${(posRef.current.x - dx * 0.015) * 100}%`
          d.style.top  = `${(posRef.current.y - dy * 0.015) * 100}%`
          worldEl.appendChild(d)
          setTimeout(() => { try { worldEl.removeChild(d) } catch {} }, 480)
        }
        footprintTimerRef.current += dt * 1000
        if (footprintTimerRef.current >= 220) {
          footprintTimerRef.current = 0
          const fp = document.createElement('div')
          fp.className = 'hg-footprint'
          fp.style.left = `${(posRef.current.x - dx * 0.008) * 100}%`
          fp.style.top  = `${(posRef.current.y - dy * 0.008) * 100}%`
          worldEl.appendChild(fp)
          setTimeout(() => { try { worldEl.removeChild(fp) } catch {} }, 1400)
        }
        stepSfxTimerRef.current += dt * 1000
        if (stepSfxTimerRef.current >= 310) {
          stepSfxTimerRef.current = 0
          sfx.step()
        }
      } else {
        footprintTimerRef.current = 0
        stepSfxTimerRef.current = 0
      }

      /* NPC */
      const npc   = npcRef.current
      const npcEl = npcElRef.current
      if (npcEl) {
        if (npc.waitTime > 0) {
          npc.waitTime -= dt
        } else {
          const tgt = NPC_WAYPOINTS[npc.targetIdx]
          const ndx = (tgt.x - npc.pos.x) * wW
          const ndy = (tgt.y - npc.pos.y) * wH
          const dist = Math.hypot(ndx, ndy)
          if (dist < 10) {
            npc.waitTime = 1.5 + Math.random() * 2.5
            let next = npc.targetIdx
            while (next === npc.targetIdx) next = Math.floor(Math.random() * NPC_WAYPOINTS.length)
            npc.targetIdx = next
          } else {
            const pps = NPC_SPEED * dt
            npc.pos.x = Math.max(0.04, Math.min(0.96, npc.pos.x + (ndx / dist) * pps / wW))
            npc.pos.y = Math.max(0.04, Math.min(0.94, npc.pos.y + (ndy / dist) * pps / wH))
          }
        }
        npcEl.style.left  = `${npc.pos.x * 100}%`
        npcEl.style.top   = `${npc.pos.y * 100}%`
        npcEl.dataset.dir = npc.pos.x < NPC_WAYPOINTS[npc.targetIdx].x ? 'd' : 'a'
        const dpx = (npc.pos.x - posRef.current.x) * wW
        const dpy = (npc.pos.y - posRef.current.y) * wH
        const isNear = Math.hypot(dpx, dpy) < NPC_TALK_R
        if (isNear !== npcNearRef.current) {
          npcNearRef.current = isNear
          setNpcNear(isNear)
          if (isNear) {
            sfx.npc()
            const qs = questRef.current
            if (qs === null) {
              setNpcQuote("Tu as l'air courageux… (E pour parler) ⚔️")
            } else if (qs === 'active') {
              setNpcQuote(`Créatures battues : ${questKillsRef.current}/3 — allez !`)
            } else if (qs === 'ready') {
              setNpcQuote("Tu l'as fait ! Viens récupérer ta récompense ! 🏆")
              grantXP(5)
            } else if (qs === 'done') {
              setNpcQuote("J'ai encore une mission pour toi… (E pour parler) 🌟")
            } else if (qs === 'q2_active') {
              setNpcQuote(`Fragments : ${collectedRef.current.size}/5 — courage !`)
            } else if (qs === 'q2_ready') {
              setNpcQuote("Tous les fragments ! Viens réclamer ta récompense ! 🌟")
              grantXP(5)
            } else {
              const idx = npcQuoteIdxRef.current
              npcQuoteIdxRef.current = (idx + 1) % NPC_QUOTES.length
              setNpcQuote(NPC_QUOTES[idx])
              grantXP(5)
            }
          }
        }
      }

      /* monsters */
      for (const m of monstersRef.current) {
        const el = monsterElsRef.current[m.id]
        if (!el) continue

        /* respawn countdown */
        if (m.dead) {
          m.respawnTimer -= dt
          el.style.display = 'none'
          if (m.respawnTimer <= 0) {
            m.dead = false
            m.pos = { ...m.spawn }
            m.stunTime = 2
            m.chasing = false
            m.waitTime = 2
          }
          continue
        }

        const mWPx = m.pos.x * wW
        const mWPy = m.pos.y * wH
        const dist = Math.hypot(mWPx - playerWPx, mWPy - playerWPy)

        el.style.display = dist < 500 ? '' : 'none'
        if (dist >= 500) continue

        if (m.stunTime > 0) {
          m.stunTime -= dt
          el.dataset.state   = 'stunned'
          el.dataset.chasing = '0'
        } else {
          const shouldChase = dist < MONSTER_CHASE_R
          m.chasing          = shouldChase
          el.dataset.state   = shouldChase ? 'chase' : 'idle'
          el.dataset.chasing = shouldChase ? '1' : '0'

          if (shouldChase) {
            const bdx = playerWPx - mWPx
            const bdy = playerWPy - mWPy
            const bd  = Math.hypot(bdx, bdy)
            const pps = MONSTER_SPEED * dt
            m.pos.x = Math.max(0.13, Math.min(0.87, m.pos.x + (bdx / bd) * pps / wW))
            m.pos.y = Math.max(0.13, Math.min(0.87, m.pos.y + (bdy / bd) * pps / wH))
          } else {
            if (m.waitTime > 0) {
              m.waitTime -= dt
            } else {
              m.wanderDx = (Math.random() - 0.5) * 1.4
              m.wanderDy = (Math.random() - 0.5) * 1.4
              m.waitTime = 1.5 + Math.random() * 2
            }
            const pps = MONSTER_SPEED * 0.35 * dt
            m.pos.x = Math.max(0.13, Math.min(0.87, m.pos.x + m.wanderDx * pps / wW))
            m.pos.y = Math.max(0.13, Math.min(0.87, m.pos.y + m.wanderDy * pps / wH))
          }

          if (dist < MONSTER_HIT_R) {
            startBattle(m.id, m.type)
            m.stunTime = 5
          }
        }

        el.style.left = `${m.pos.x * 100}%`
        el.style.top  = `${m.pos.y * 100}%`
      }

      /* collectibles */
      for (const c of COLLECTIBLES) {
        if (collectedRef.current.has(c.id)) continue
        const cdx = (c.x - posRef.current.x) * wW
        const cdy = (c.y - posRef.current.y) * wH
        if (Math.hypot(cdx, cdy) < COLLECT_R) {
          collectedRef.current = new Set([...collectedRef.current, c.id])
          setCollected(new Set(collectedRef.current))
          grantXP(25)
          sfx.collect()
          if (questRef.current === 'q2_active' && collectedRef.current.size >= COLLECTIBLES.length) {
            questRef.current = 'q2_ready'
            setQuestState('q2_ready')
          }
          const flash = document.createElement('div')
          flash.className = 'hg-collect-flash'
          flash.style.left = `${c.x * 100}%`
          flash.style.top  = `${c.y * 100}%`
          flash.textContent = c.icon
          worldEl.appendChild(flash)
          setTimeout(() => { try { worldEl.removeChild(flash) } catch {} }, 700)
        }
      }

      /* minimap */
      const mm = minimapRef.current
      if (mm) {
        const ctx = mm.getContext('2d')
        const MW = mm.width, MH = mm.height
        ctx.clearRect(0, 0, MW, MH)
        ctx.fillStyle = '#08061a'
        ctx.fillRect(0, 0, MW, MH)
        /* roads */
        ctx.strokeStyle = 'rgba(200,160,96,0.5)'
        ctx.lineWidth = 1
        for (const [x1, y1, x2, y2] of EXTRA_SEGS) {
          ctx.beginPath()
          ctx.moveTo(x1 / 100 * MW, y1 / 100 * MH)
          ctx.lineTo(x2 / 100 * MW, y2 / 100 * MH)
          ctx.stroke()
        }
        /* zones */
        const allZ = collectedRef.current.size === COLLECTIBLES.length ? [...ZONES, SECRET_ZONE] : ZONES
        for (const z of allZ) {
          ctx.fillStyle = z.color
          ctx.beginPath()
          ctx.arc(z.pos.x * MW, z.pos.y * MH, 3, 0, Math.PI * 2)
          ctx.fill()
        }
        /* monsters */
        for (const m of monstersRef.current) {
          if (m.dead) continue
          ctx.fillStyle = MONSTER_TYPES[m.type].color
          ctx.beginPath()
          ctx.arc(m.pos.x * MW, m.pos.y * MH, 2, 0, Math.PI * 2)
          ctx.fill()
        }
        /* NPC */
        ctx.fillStyle = '#fbbf24'
        ctx.beginPath()
        ctx.arc(npcRef.current.pos.x * MW, npcRef.current.pos.y * MH, 2.5, 0, Math.PI * 2)
        ctx.fill()
        /* player */
        ctx.fillStyle = '#fff'
        ctx.beginPath()
        ctx.arc(posRef.current.x * MW, posRef.current.y * MH, 3, 0, Math.PI * 2)
        ctx.fill()
        /* player halo */
        ctx.strokeStyle = 'rgba(168,85,247,0.6)'
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.arc(posRef.current.x * MW, posRef.current.y * MH, 5, 0, Math.PI * 2)
        ctx.stroke()
      }

      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [grantXP, startBattle, exitBuilding])

  /* Modification 1 : panelOpen seulement quand tous les collectibles sont trouvés */
  const panelOpen = allFound

  return (
    <div className={`hg-root${hitFlash ? ' hg-hit-flash' : ''}`}>

      {/* ── MAP ── */}
      <div className="hg-map" ref={mapRef}>
        <div className="hg-world" ref={worldRef}>

          {/* paths */}
          <svg className="hg-paths" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs><filter id="hg-path-blur"><feGaussianBlur stdDeviation="0.4" /></filter></defs>
            {buildSegs(ZONES).map(([x1,y1,x2,y2], i) => (
              <g key={i}>
                <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#3a2808" strokeWidth="5.5" strokeLinecap="square" filter="url(#hg-path-blur)" />
                <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#c8a060" strokeWidth="4" strokeLinecap="square" />
                <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#e0bc80" strokeWidth="1.4" strokeLinecap="square" strokeDasharray="2,3" />
              </g>
            ))}
            <g opacity={allFound ? 1 : 0.35}>
              <line x1={55} y1={74} x2={55} y2={88} stroke={allFound ? "#a855f7" : "#c8a060"} strokeWidth="4" strokeLinecap="square" strokeDasharray={allFound ? undefined : "3,3.5"} />
              {allFound && <line x1={55} y1={74} x2={55} y2={88} stroke="#d4aaff" strokeWidth="1.4" strokeLinecap="square" strokeDasharray="2,3" />}
            </g>
          </svg>

          {/* decos */}
          {DECOS.map((d, i) => <span key={i} className="hg-deco" style={{ left: `${d.x * 100}%`, top: `${d.y * 100}%` }}>{d.e}</span>)}

          {/* collectibles */}
          {COLLECTIBLES.map(c => !collected.has(c.id) && (
            <div key={c.id} className="hg-collectible" style={{ left: `${c.x * 100}%`, top: `${c.y * 100}%` }}>{c.icon}</div>
          ))}

          {/* home */}
          <div className="hg-home" style={{ left: `${HOME.pos.x * 100}%`, top: `${HOME.pos.y * 100}%`, '--zc': HOME.color }}>
            <div className="hg-zone-house">
              <div className="hg-zone-chimney"><div className="hg-zone-smoke" /></div>
              <div className="hg-zone-roof" />
              <div className="hg-zone-facade">
                <div className="hg-zone-winrow"><div className="hg-zone-win" /><div className="hg-zone-win" /></div>
                <span className="hg-zone-icon">{HOME.icon}</span>
                <div className="hg-zone-door" />
              </div>
            </div>
            <div className="hg-zone-sign">{HOME.name}</div>
          </div>

          {/* zones */}
          {ZONES.map(z => <ZoneHouse key={z.id} z={z} isNear={nearZone?.id === z.id} isVisited={visited.has(z.id)} />)}
          {allFound && <ZoneHouse z={SECRET_ZONE} isNear={nearZone?.id === 'secret'} isVisited={visited.has('secret')} />}
          {!allFound && <div className="hg-secret-hint" style={{ left: `${SECRET_ZONE.pos.x * 100}%`, top: `${SECRET_ZONE.pos.y * 100}%` }}>❓</div>}

          {/* NPC */}
          <div className="hg-npc" ref={npcElRef}
            style={{ left: `${npcRef.current.pos.x * 100}%`, top: `${npcRef.current.pos.y * 100}%` }}
            data-dir="d"
          >
            {npcNear && <div className="hg-npc-bubble">{npcQuote}</div>}
            <div className="hg-npc-name">Voyageur</div>
            <div className="hg-npc-sprite">🧙‍♂️</div>
            <div className="hg-player-shadow" />
          </div>

          {/* monsters */}
          {INIT_MONSTERS.map(m => (
            <div
              key={m.id}
              className="hg-monster"
              data-type={m.type}
              data-state="idle"
              data-chasing="0"
              ref={el => { monsterElsRef.current[m.id] = el }}
              style={{ left: `${m.pos.x * 100}%`, top: `${m.pos.y * 100}%`, display: 'none' }}
            >
              <div className="hg-monster-sprite" style={{ '--mc': MONSTER_TYPES[m.type].color }}>
                {MONSTER_TYPES[m.type].icon}
              </div>
              <div className="hg-player-shadow" />
            </div>
          ))}

          {/* player */}
          <div className="hg-player" ref={playerRef}
            style={{ left: `${posRef.current.x * 100}%`, top: `${posRef.current.y * 100}%` }}
            data-dir="s" data-moving="0" data-sprint="0"
          >
            <div className="hg-player-name">TONY</div>
            <div className="hg-player-sprite">🧑‍💻</div>
            <div className="hg-player-shadow" />
          </div>
        </div>{/* end world */}

        {/* HUD tl */}
        <div className="hg-hud-tl">
          <div className="hg-status-card">
            <div className="hg-sc-row">
              <span className="hg-sc-name">TONY</span>
              <span className="hg-sc-lv" style={{ color: getLevel(xp).color }}>{getLevel(xp).label}</span>
            </div>
            <HPBar current={playerHp} max={getLevel(xp).maxHp} />
            <XPBar xp={xp} />
          </div>
        </div>

        {/* HUD tr */}
        <div className="hg-hud-tr">
          <canvas className="hg-minimap" ref={minimapRef} width={108} height={86} />
          <div className="hg-pk-badge">🗺️ <span className="hg-pk-n">{visited.size}</span>/{ZONES.length + (allFound ? 1 : 0)}</div>
          <div className="hg-pk-badge">💫 <span className="hg-pk-n">{collected.size}</span>/{COLLECTIBLES.length}</div>
          {(questState === 'active' || questState === 'ready') && (
            <div className={`hg-pk-badge hg-quest-badge${questState === 'ready' ? ' hg-quest-ready' : ''}`}>
              ⚔️ <span className="hg-pk-n">{questKills}</span>/3{questState === 'ready' ? ' ✓' : ''}
            </div>
          )}
          {(questState === 'q2_active' || questState === 'q2_ready') && (
            <div className={`hg-pk-badge hg-quest-badge${questState === 'q2_ready' ? ' hg-quest-ready' : ''}`}>
              💫 <span className="hg-pk-n">{Math.min(collected.size, 5)}</span>/5{questState === 'q2_ready' ? ' ✓' : ''}
            </div>
          )}
        </div>

        {levelUpMsg && <div className="hg-levelup-msg">{levelUpMsg}</div>}

        {/* D-pad */}
        <div className="hg-dpad" onContextMenu={e => e.preventDefault()}>
          <div className="hg-dpad-col">
            <button className="hg-dpad-btn"
              onPointerDown={() => { keysRef.current['ArrowUp'] = true }}
              onPointerUp={() => { delete keysRef.current['ArrowUp'] }}
              onPointerLeave={() => { delete keysRef.current['ArrowUp'] }}>▲</button>
            <div className="hg-dpad-mid">
              <button className="hg-dpad-btn"
                onPointerDown={() => { keysRef.current['ArrowLeft'] = true }}
                onPointerUp={() => { delete keysRef.current['ArrowLeft'] }}
                onPointerLeave={() => { delete keysRef.current['ArrowLeft'] }}>◀</button>
              <div className="hg-dpad-center" />
              <button className="hg-dpad-btn"
                onPointerDown={() => { keysRef.current['ArrowRight'] = true }}
                onPointerUp={() => { delete keysRef.current['ArrowRight'] }}
                onPointerLeave={() => { delete keysRef.current['ArrowRight'] }}>▶</button>
            </div>
            <button className="hg-dpad-btn"
              onPointerDown={() => { keysRef.current['ArrowDown'] = true }}
              onPointerUp={() => { delete keysRef.current['ArrowDown'] }}
              onPointerLeave={() => { delete keysRef.current['ArrowDown'] }}>▼</button>
          </div>
          {/* A button — NPC / enter building / advance interior dialogue */}
          <button className="hg-dpad-a-btn" onClick={() => {
            if (insideZoneRef.current) {
              if (interiorDialogRef.current) advanceInteriorDialog()
              else if (interiorNearNpcRef.current) startInteriorDialog()
            } else if (npcNearRef.current) {
              handleNpcTalk()
            } else if (nearRef.current) {
              enterBuilding(nearRef.current)
            }
          }}>A</button>
        </div>

      </div>{/* end map */}

      {/* dialog panel */}
      <div className={`hg-dialog${panelOpen || questDialog ? ' hg-dialog-open' : ''}`}>
        <div className="hg-dialog-inner">
          {questDialog ? (
            <div className="hg-dialog-content">
              <div className="hg-dialog-portrait">🧙‍♂️</div>
              <div className="hg-dialog-textbox">
                <div className="hg-dialog-speaker" style={{ color: ['reward','q2_reward'].includes(questDialog.type) ? '#fbbf24' : ['offer','q2_offer'].includes(questDialog.type) ? '#a855f7' : '#ccc' }}>
                  Voyageur
                </div>
                <div className="hg-dialog-body">{questDialog.text}</div>
              </div>
            </div>
          ) : allFound ? (
            <div className="hg-dialog-content">
              <div className="hg-dialog-portrait">🏆</div>
              <div className="hg-dialog-textbox">
                <div className="hg-dialog-speaker" style={{ color: '#b8860b' }}>Explorateur !</div>
                <div className="hg-dialog-body">Tu as tout trouvé ! La Dev Cave est débloquée au sud.</div>
              </div>
              <div className="hg-dialog-cursor">▼</div>
            </div>
          ) : (
            <div className="hg-dialog-idle">
              <span className="hg-idle-icon">🗺️</span>
              <div className="hg-idle-text">
                <div className="hg-idle-main">Explore la carte pour découvrir mes passions !</div>
                <div className="hg-idle-hint">WASD · Shift: sprint · E: entrer · 💫 {COLLECTIBLES.length} fragments</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Battle overlay ── */}
      {battle && (
        <BattleScreen
          battle={battle}
          playerHp={playerHp}
          playerMaxHp={getLevel(xp).maxHp}
          playerLevel={getLevel(xp)}
          onAction={handleBattleAction}
          battleAnim={battleAnim}
        />
      )}

      {/* ── Interior overlay ── */}
      {insideZone && (
        <InteriorView
          zone={insideZone}
          nearNpc={interiorNearNpc}
          dialog={interiorDialog}
          dialogLine={intDialogLine}
          onAdvanceDialog={advanceInteriorDialog}
          onExit={exitBuilding}
          playerElRef={interiorPlayerElRef}
          onBossChallenge={startBossBattle}
          bossDefeated={bossDefeated}
        />
      )}

    </div>
  )
}

export default HobbiesGame
