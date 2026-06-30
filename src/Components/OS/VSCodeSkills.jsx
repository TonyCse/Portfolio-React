import { useState } from 'react'
import './VSCodeSkills.css'
import avatarClindoeil from '../../images/avatarclindoeil.png'

/* ─── Devicon CDN ────────────────────────────────────────────── */
const CDN = 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons'

/* ─── File tree data ─────────────────────────────────────────── */
const FILE_TREE = [
  {
    id: 'frontend', label: 'Frontend',
    files: [
      { id: 'html',       name: 'HTML_CSS.html',   ext: 'html', color: '#e34f26', level: 90, logo: `${CDN}/html5/html5-original.svg` },
      { id: 'javascript', name: 'JavaScript.js',   ext: 'js',   color: '#f7df1e', level: 88, logo: `${CDN}/javascript/javascript-original.svg` },
      { id: 'typescript', name: 'TypeScript.ts',   ext: 'ts',   color: '#3178c6', level: 65, logo: `${CDN}/typescript/typescript-original.svg` },
      { id: 'react',      name: 'React.jsx',       ext: 'jsx',  color: '#61dafb', level: 65, logo: `${CDN}/react/react-original.svg` },
      { id: 'nextjs',     name: 'Next.js.tsx',     ext: 'tsx',  color: '#e0e0e0', level: 58, logo: `${CDN}/nextjs/nextjs-original.svg`, invert: true },
    ],
  },
  {
    id: 'backend', label: 'Backend',
    files: [
      { id: 'nodejs',  name: 'Node.js.js',   ext: 'js',  color: '#83cd29', level: 82, logo: `${CDN}/nodejs/nodejs-original.svg` },
      { id: 'express', name: 'Express.js',   ext: 'js',  color: '#d4d4d4', level: 62, logo: `${CDN}/express/express-original.svg`, invert: true },
      { id: 'php',     name: 'PHP.php',      ext: 'php', color: '#8892be', level: 55, logo: `${CDN}/php/php-original.svg` },
      { id: 'laravel', name: 'Laravel.php',  ext: 'php', color: '#ff2d20', level: 60, logo: `${CDN}/laravel/laravel-original.svg` },
    ],
  },
  {
    id: 'database', label: 'Base de données',
    files: [
      { id: 'postgres', name: 'SQL_PostgreSQL.sql', ext: 'sql', color: '#336791', level: 62, logo: `${CDN}/postgresql/postgresql-original.svg` },
      { id: 'mongodb',  name: 'MongoDB.js',        ext: 'js',  color: '#4db33d', level: 55, logo: `${CDN}/mongodb/mongodb-original.svg` },
    ],
  },
  {
    id: 'devops', label: 'DevOps & Outils',
    files: [
      { id: 'git',    name: 'Git_GitHub.sh',   ext: 'sh',   color: '#f05032', level: 90, logo: `${CDN}/git/git-original.svg` },
      { id: 'docker', name: 'Docker.yaml',     ext: 'yaml', color: '#2496ed', level: 55, logo: `${CDN}/docker/docker-original.svg` },
      { id: 'figma',  name: 'Figma.design',    ext: 'fig',  color: '#f24e1e', level: 55, logo: `${CDN}/figma/figma-original.svg` },
      { id: 'apiai',  name: 'APIs_IA.js',      ext: 'js',   color: '#10b981', level: 68, logo: null },
    ],
  },
]

const ALL_FILES = FILE_TREE.flatMap(f =>
  f.files.map(file => ({ ...file, folder: f.label }))
)

/* ─── Code snippets ──────────────────────────────────────────── */
const SNIPPETS = {
  html: `<!-- HTML_CSS.html — Langages du web  ⭐ Avancé · 3 ans -->
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Tony Cseresznyak · Portfolio</title>
  <link rel="stylesheet" href="styles.css" />
</head>
<body>
  <header class="navbar glass">
    <h1 class="logo">Tony<span class="accent">OS</span></h1>
    <nav>
      <a href="#about">À propos</a>
      <a href="#skills">Compétences</a>
      <a href="#contact">Contact</a>
    </nav>
  </header>

  <main class="hero">
    <h2>Développeur <em>Full Stack</em></h2>
    <p>React · Node.js · Laravel · TypeScript</p>
  </main>
</body>
</html>

/* styles.css */
.glass {
  backdrop-filter: blur(20px);
  background: rgba(255, 255, 255, 0.08);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}
.accent { color: #a855f7; }`,

  javascript: `// JavaScript.js — Langage du web  ⭐ Avancé  · 3 ans

// Gestion des fenêtres TonyOS
class WindowManager {
  #windows = new Map()
  #topZ    = 100

  open(id, options = {}) {
    if (this.#windows.has(id)) {
      this.focus(id)
      return
    }
    const win = { id, zIndex: ++this.#topZ, ...options }
    this.#windows.set(id, win)
    this.#render(win)
  }

  focus(id) {
    const win = this.#windows.get(id)
    if (win) { win.zIndex = ++this.#topZ; this.#render(win) }
  }

  close(id) {
    this.#windows.delete(id)
    document.getElementById(\`win-\${id}\`)?.remove()
  }

  #render(win) {
    const el = document.getElementById(\`win-\${win.id}\`) ?? this.#create(win)
    el.style.zIndex = win.zIndex
  }

  #create({ id, title }) {
    const el = document.createElement('div')
    el.id = \`win-\${id}\`
    el.className = 'os-window'
    el.innerHTML = \`<div class="win-title">\${title}</div>\`
    document.body.appendChild(el)
    return el
  }
}

const wm = new WindowManager()
wm.open('about', { title: 'À propos' })`,

  postgres: `-- SQL_PostgreSQL.sql — Base de données relationnelle  ⭐ Intermédiaire · 2 ans

CREATE SCHEMA IF NOT EXISTS portfolio;

CREATE TABLE portfolio.projects (
    id          SERIAL PRIMARY KEY,
    title       VARCHAR(255) NOT NULL,
    description TEXT,
    tech_stack  TEXT[],
    live_url    VARCHAR(512),
    featured    BOOLEAN DEFAULT FALSE,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE portfolio.technologies (
    id   SERIAL PRIMARY KEY,
    name VARCHAR(80) UNIQUE NOT NULL,
    icon VARCHAR(10),
    lvl  SMALLINT CHECK (lvl BETWEEN 0 AND 100)
);

-- Vue matérialisée featured
CREATE MATERIALIZED VIEW portfolio.featured AS
  SELECT p.id, p.title, p.tech_stack,
         ARRAY_AGG(t.name ORDER BY t.lvl DESC) AS tech_names
  FROM portfolio.projects p
  JOIN UNNEST(p.tech_stack) AS s(name) ON TRUE
  JOIN portfolio.technologies t ON t.name = s.name
  WHERE p.featured = TRUE
  GROUP BY p.id, p.title, p.tech_stack
  ORDER BY p.created_at DESC;

REFRESH MATERIALIZED VIEW portfolio.featured;`,

  figma: `// Figma.design — Design UI/UX  ⭐ Intermédiaire · 2 ans

/*
  Composants Figma pour TonyOS Portfolio
  ──────────────────────────────────────

  ▸ Design System
    ├── Colors
    │   ├── Primary:    #a855f7  (Purple 500)
    │   ├── Secondary:  #6366f1  (Indigo 500)
    │   ├── Background: #0f0f1a
    │   └── Text:       #e2e8f0
    │
    ├── Typography
    │   ├── Display:  Space Grotesk 800  (headlines)
    │   ├── Body:     Space Grotesk 400  (text)
    │   └── Code:     JetBrains Mono 400
    │
    └── Components
        ├── OS Window  (draggable, resizable)
        ├── Taskbar    (apps + profile + volume)
        ├── Desktop Icon
        └── Card 3D    (hover tilt effect)

  ▸ Prototypes
    └── TonyOS Desktop flow
        Start → Desktop → Open Window → Interact

  ▸ Handoff
    → Tokens exported to Tailwind config
    → Auto-layout → flexbox CSS
*/`,

  apiai: `// APIs_IA.js — Intégration d'APIs d'IA  ⭐ Intermédiaire · 1 an
import OpenAI from 'openai'
import Anthropic from '@anthropic-ai/sdk'

/* ── OpenAI ── */
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

async function generateBio(techStack) {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system',  content: 'Tu es un assistant qui génère des bios de développeurs.' },
      { role: 'user',    content: \`Stack : \${techStack.join(', ')}\` },
    ],
  })
  return completion.choices[0].message.content
}

/* ── Anthropic Claude ── */
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

async function reviewCode(code) {
  const message = await anthropic.messages.create({
    model: 'claude-opus-4-8',
    max_tokens: 1024,
    messages: [{ role: 'user', content: \`Review ce code :\n\n\${code}\` }],
  })
  return message.content[0].text
}

export { generateBio, reviewCode }`,

  react: `// React.jsx — Bibliothèque UI (Meta)  ⭐ Intermédiaire · 2 ans
import React, { useState, useEffect, useCallback } from 'react'

interface Props {
  title: string
  theme: 'dark' | 'light'
}

export function TonyComponent({ title, theme }: Props) {
  const [count, setCount] = useState<number>(0)

  useEffect(() => {
    document.title = \`\${title} · TonyOS\`
  }, [title])

  const handleClick = useCallback(() => {
    setCount(c => c + 1)
  }, [])

  return (
    <div className={\`card \${theme}\`}>
      <h1>{title}</h1>
      <button onClick={handleClick}>
        Interactions : {count}
      </button>
    </div>
  )
}

export default TonyComponent`,

  nextjs: `// Next.js.tsx — App Router (Vercel)  ⭐ Intermédiaire · 2 ans
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tony Cseresznyak · Portfolio',
  description: 'Développeur Full Stack React / Node.js',
  openGraph: { type: 'website', locale: 'fr_FR' },
}

async function fetchProjects() {
  const res = await fetch('/api/projects', { cache: 'no-store' })
  return res.json()
}

export default async function HomePage() {
  const projects = await fetchProjects()

  return (
    <main className="container">
      <h1>Tony Cseresznyak</h1>
      <ProjectGrid items={projects} />
    </main>
  )
}`,

  typescript: `// TypeScript.ts — Superset JS (Microsoft)  ⭐ Intermédiaire · 2 ans
type Status = 'active' | 'idle' | 'offline'

interface Developer {
  name: string
  role: string
  status: Status
  skills: string[]
  level: (tech: string) => number
}

const tony: Developer = {
  name:   'Tony Cseresznyak',
  role:   'Full Stack Developer',
  status: 'active',
  skills: ['React', 'Node.js', 'Laravel', 'TypeScript'],
  level: (tech) => techLevels[tech] ?? 70,
}

const techLevels: Record<string, number> = {
  React: 92, TypeScript: 84, Node: 80, Laravel: 76,
}

export { tony }`,

  vue: `// Vue.js.vue — Framework progressif  ⭐ Intermédiaire · 1 an
<template>
  <div class="card">
    <h2>{{ developer.name }}</h2>
    <p v-if="developer.available">Disponible ✅</p>
    <ul>
      <li v-for="skill in developer.skills" :key="skill">
        {{ skill }}
      </li>
    </ul>
    <button @click="contact">Contacter</button>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

const developer = reactive({
  name: 'Tony Cseresznyak',
  available: true,
  skills: ['React', 'Vue', 'Node.js'],
})

function contact() {
  window.open('mailto:tony.cseresznyak@cloud-campus.fr')
}
</script>`,

  tailwind: `/* Tailwind.css — Utility-first CSS  ⭐ Avancé · 3 ans */

/* Tony's component with Tailwind utilities */
.tony-card {
  @apply flex flex-col gap-4 p-6 rounded-2xl;
  @apply bg-white/10 backdrop-blur-lg border border-white/20;
  @apply shadow-xl hover:shadow-2xl transition-all duration-300;
}

.tony-badge {
  @apply inline-flex items-center gap-1.5 px-3 py-1;
  @apply rounded-full text-sm font-medium;
  @apply bg-purple-500/20 text-purple-300 border border-purple-500/30;
}

/* Custom gradient (outside Tailwind) */
.gradient-text {
  background: linear-gradient(135deg, #a855f7, #6366f1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}`,

  sass: `// Sass.scss — Préprocesseur CSS  ⭐ Avancé · 3 ans
$primary:   #a855f7;
$secondary: #6366f1;
$dark:      #0f0f1a;

@mixin glassmorphism($blur: 16px, $opacity: 0.12) {
  background: rgba(255, 255, 255, $opacity);
  backdrop-filter: blur($blur);
  border: 1px solid rgba(255, 255, 255, $opacity + 0.06);
}

.window {
  @include glassmorphism(20px, 0.1);
  border-radius: 14px;
  overflow: hidden;

  &__title {
    font-family: 'Space Grotesk', sans-serif;
    color: rgba(255, 255, 255, 0.9);
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 20px 60px rgba($primary, 0.25);
  }
}`,

  nodejs: `// Node.js.js — Runtime JS (OpenJS)  ⭐ Avancé · 3 ans
const express = require('express')
const { createServer } = require('http')
const { Server } = require('socket.io')

const app    = express()
const server = createServer(app)
const io     = new Server(server, { cors: { origin: '*' } })

// REST API
app.get('/api/developer', (req, res) => {
  res.json({
    name:   'Tony Cseresznyak',
    role:   'Full Stack Developer',
    open:   true,
    contact: 'tony.cseresznyak@cloud-campus.fr',
  })
})

// WebSocket
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id)
  socket.emit('welcome', { message: 'TonyOS Online' })
})

server.listen(3000, () => console.log('Server running on :3000'))`,

  laravel: `// Laravel.php — Framework PHP (Taylor Otwell)  ⭐ Intermédiaire · 2 ans
<?php

namespace App\\Http\\Controllers;

use App\\Models\\Project;
use Illuminate\\Http\\Request;
use Illuminate\\Http\\JsonResponse;

class ProjectController extends Controller
{
    public function index(): JsonResponse
    {
        $projects = Project::with('technologies')
            ->where('featured', true)
            ->latest()
            ->paginate(6);

        return response()->json($projects);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'required|string',
            'tech_stack'  => 'required|array',
        ]);

        return response()->json(Project::create($data), 201);
    }
}`,

  express: `// Express.js — Framework web minimaliste  ⭐ Intermédiaire · 2 ans
import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'

const app = express()
app.use(express.json())
app.use(cors())

// Middleware auth
const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ error: 'Non autorisé' })
  next()
}

// Routes
app.get('/api/profile', authMiddleware, (req, res) => {
  res.json({ name: 'Tony Cseresznyak', role: 'Full Stack Dev' })
})

app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
  console.error(err.message)
  res.status(500).json({ error: 'Erreur serveur' })
})

export default app`,

  php: `// PHP.php — Langage serveur  ⭐ Intermédiaire · 2 ans
<?php

declare(strict_types=1);

class Developer
{
    public function __construct(
        private readonly string $name,
        private readonly string $role,
        private array $skills = []
    ) {}

    public function addSkill(string $skill): self
    {
        $this->skills[] = $skill;
        return $this;
    }

    public function toArray(): array
    {
        return [
            'name'   => $this->name,
            'role'   => $this->role,
            'skills' => $this->skills,
        ];
    }
}

$tony = (new Developer('Tony Cseresznyak', 'Full Stack Dev'))
    ->addSkill('PHP')
    ->addSkill('Laravel')
    ->addSkill('MySQL');

echo json_encode($tony->toArray(), JSON_PRETTY_PRINT);`,

  mysql: `-- MySQL.sql — SGBDR relationnel  ⭐ Avancé · 3 ans

-- Base de données portfolio
CREATE DATABASE IF NOT EXISTS tony_portfolio CHARACTER SET utf8mb4;
USE tony_portfolio;

CREATE TABLE projects (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    title       VARCHAR(255) NOT NULL,
    description TEXT,
    repo_url    VARCHAR(512),
    featured    BOOLEAN DEFAULT FALSE,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_featured (featured)
);

CREATE TABLE technologies (
    id   INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(80) UNIQUE NOT NULL,
    icon VARCHAR(10)
);

-- Requête featured projects avec stack
SELECT p.title, GROUP_CONCAT(t.name SEPARATOR ', ') AS stack
FROM projects p
JOIN project_tech pt ON pt.project_id = p.id
JOIN technologies t  ON t.id = pt.tech_id
WHERE p.featured = 1
GROUP BY p.id
ORDER BY p.created_at DESC
LIMIT 6;`,

  mongodb: `// MongoDB.js — Base NoSQL (document)  ⭐ Intermédiaire · 2 ans
import mongoose from 'mongoose'

const projectSchema = new mongoose.Schema({
  title: {
    type: String, required: true, trim: true,
  },
  description: String,
  techStack: [String],
  featured:  { type: Boolean, default: false },
  repoUrl:   String,
  liveUrl:   String,
}, { timestamps: true })

projectSchema.index({ featured: -1, createdAt: -1 })

const Project = mongoose.model('Project', projectSchema)

// Requête typique
const featured = await Project
  .find({ featured: true })
  .sort({ createdAt: -1 })
  .limit(6)
  .lean()`,

  postgres_adv: `-- PostgreSQL.sql — SGBDR avancé  ⭐ Débutant+ · 1 an

-- Création schéma
CREATE SCHEMA IF NOT EXISTS portfolio;

CREATE TABLE portfolio.projects (
    id          SERIAL PRIMARY KEY,
    title       VARCHAR(255) NOT NULL,
    description TEXT,
    tech_stack  TEXT[],
    featured    BOOLEAN DEFAULT FALSE,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Vue matérialisée (featured)
CREATE MATERIALIZED VIEW portfolio.featured_projects AS
  SELECT id, title, tech_stack, created_at
  FROM portfolio.projects
  WHERE featured = TRUE
  ORDER BY created_at DESC;

REFRESH MATERIALIZED VIEW portfolio.featured_projects;`,

  docker: `# Docker.yaml — Conteneurisation  ⭐ Intermédiaire · 2 ans
version: '3.9'

services:
  frontend:
    build:
      context: ./client
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - API_URL=http://api:8000
    depends_on:
      - api

  api:
    build: ./server
    ports:
      - "8000:8000"
    environment:
      - DB_HOST=db
      - DB_NAME=tony_portfolio
    depends_on:
      - db

  db:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: \${MYSQL_ROOT_PASSWORD}
      MYSQL_DATABASE: tony_portfolio
    volumes:
      - db_data:/var/lib/mysql

volumes:
  db_data:`,

  git: `#!/bin/bash
# Git.sh — Contrôle de version  ⭐ Avancé · 3 ans

# Initialiser et configurer
git init
git config user.name  "Tony Cseresznyak"
git config user.email "tony.cseresznyak@cloud-campus.fr"

# Workflow feature branch
git checkout -b feat/vscode-skills
git add src/Components/OS/VSCodeSkills.jsx
git commit -m "feat(skills): add VSCode-themed skills component

- Activity bar with Explorer / Search / Extensions
- File tree: Frontend / Backend / Database / DevOps
- Syntax-highlighted code snippets per technology
- Proficiency bars and open file tabs"

# Rebase propre avant PR
git fetch origin main
git rebase origin/main

# Push et PR
git push --set-upstream origin feat/vscode-skills
gh pr create --title "feat: VSCode Skills component" --base main`,

  linux: `#!/bin/bash
# Linux.sh — Administration système  ⭐ Intermédiaire · 2 ans

# Déploiement automatisé (Debian/Ubuntu)
set -euo pipefail

echo "▶ Mise à jour système..."
sudo apt update && sudo apt upgrade -y

echo "▶ Installation Node.js 20..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo bash -
sudo apt install -y nodejs

echo "▶ Build application..."
cd /var/www/portfolio
npm ci --production
npm run build

echo "▶ Rechargement Nginx..."
sudo nginx -t && sudo systemctl reload nginx

echo "▶ PM2 restart..."
pm2 restart tony-portfolio --update-env

echo "✅ Déploiement réussi — $(date '+%Y-%m-%d %H:%M:%S')"`,
}

/* ─── Activities ─────────────────────────────────────────────── */
const ACTIVITIES = [
  { id: 'explorer',   icon: '📋', title: 'Explorateur' },
  { id: 'search',     icon: '🔍', title: 'Rechercher'  },
  { id: 'git',        icon: '⎇',  title: 'Git'         },
  { id: 'extensions', icon: '🧩', title: 'Extensions'  },
]

const TERMINAL_OUTPUT = `tony@portfolio:~$ git log --oneline -5
95a65fe feat: TonyOS desktop with resizable windows
4930297 feat: hobbies game
183f881 feat: VSCode skills replica
44cf0ef feat: mail app, CV viewer, SpotifyApp

tony@portfolio:~$ npm run dev
> portfolio-react@1.0.0 dev
> react-scripts start

Compiled successfully!
Local: http://localhost:3000

tony@portfolio:~$ █`

function TechLogo({ file, size = 14, className = '' }) {
  if (!file.logo) return <span className={`vsc-ext-emoji ${className}`}>📄</span>
  return (
    <img
      src={file.logo}
      alt={file.name}
      className={`vsc-tech-logo ${className}`}
      style={{
        width: size, height: size,
        filter: file.invert ? 'brightness(8) saturate(0)' : 'none',
      }}
      loading="lazy"
      onError={e => { e.target.style.display = 'none' }}
    />
  )
}

/* ─── Component ──────────────────────────────────────────────── */
function VSCodeSkills() {
  const [expandedFolders, setExpandedFolders] = useState(
    new Set(['frontend', 'backend', 'database', 'devops'])
  )
  const [openTabs,     setOpenTabs]     = useState(['react'])
  const [activeTab,    setActiveTab]    = useState('react')
  const [activeAct,    setActiveAct]    = useState('explorer')
  const [showTerminal, setShowTerminal] = useState(true)
  const [searchQuery,  setSearchQuery]  = useState('')

  const openFile = (id) => {
    setOpenTabs(prev => prev.includes(id) ? prev : [...prev, id])
    setActiveTab(id)
  }

  const closeTab = (id, e) => {
    e.stopPropagation()
    const next = openTabs.filter(t => t !== id)
    setOpenTabs(next)
    if (activeTab === id) setActiveTab(next[next.length - 1] ?? null)
  }

  const toggleFolder = (id) => {
    setExpandedFolders(prev => {
      const s = new Set(prev)
      s.has(id) ? s.delete(id) : s.add(id)
      return s
    })
  }

  const currentFile = activeTab ? ALL_FILES.find(f => f.id === activeTab) : null
  const currentFolder = currentFile
    ? FILE_TREE.find(f => f.files.some(fi => fi.id === currentFile.id))
    : null

  const searchResults = searchQuery
    ? ALL_FILES.filter(f =>
        f.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : []

  return (
    <div className="vsc-root">
      {/* ── Activity bar ── */}
      <div className="vsc-activity">
        {ACTIVITIES.map(act => (
          <button
            key={act.id}
            className={`vsc-act-btn${activeAct === act.id ? ' vsc-act-active' : ''}`}
            title={act.title}
            onClick={() => setActiveAct(a => a === act.id ? null : act.id)}
          >
            {act.icon}
          </button>
        ))}
        <div className="vsc-act-spacer" />
        <img src={avatarClindoeil} alt="Tony" className="vsc-act-avatar" title="Tony Cseresznyak" />
      </div>

      {/* ── Sidebar ── */}
      {activeAct && (
        <div className="vsc-sidebar">
          {activeAct === 'explorer' && (
            <>
              <div className="vsc-sidebar-hd">EXPLORATEUR</div>
              <div className="vsc-sidebar-sub">▾ TONY-PORTFOLIO</div>
              {FILE_TREE.map(folder => (
                <div key={folder.id}>
                  <button
                    className="vsc-folder-row"
                    onClick={() => toggleFolder(folder.id)}
                  >
                    <span className="vsc-fold-arrow">
                      {expandedFolders.has(folder.id) ? '▾' : '▸'}
                    </span>
                    <span className="vsc-fold-icon">📁</span>
                    <span className="vsc-fold-label">{folder.label}</span>
                  </button>
                  {expandedFolders.has(folder.id) && folder.files.map(file => (
                    <button
                      key={file.id}
                      className={`vsc-file-row${activeTab === file.id ? ' vsc-file-active' : ''}`}
                      onClick={() => openFile(file.id)}
                    >
                      <TechLogo file={file} size={20} />
                      <span className="vsc-file-name">{file.name}</span>
                      <span
                        className="vsc-file-dot"
                        style={{ background: file.color }}
                        title={`${file.level}%`}
                      />
                    </button>
                  ))}
                </div>
              ))}
            </>
          )}

          {activeAct === 'search' && (
            <>
              <div className="vsc-sidebar-hd">RECHERCHER</div>
              <input
                className="vsc-search-input"
                placeholder="Rechercher un fichier…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                autoFocus
              />
              {searchResults.map(file => (
                <button
                  key={file.id}
                  className="vsc-file-row"
                  onClick={() => { openFile(file.id); setActiveAct('explorer') }}
                >
                  <TechLogo file={file} size={14} />
                  <span className="vsc-file-name">{file.name}</span>
                  <span className="vsc-search-folder">{file.folder}</span>
                </button>
              ))}
            </>
          )}

          {activeAct === 'git' && (
            <>
              <div className="vsc-sidebar-hd">CONTRÔLE DE SOURCE</div>
              <div className="vsc-git-branch">⎇&nbsp; main</div>
              <div className="vsc-git-clean">✔ Aucune modification</div>
              <div className="vsc-sidebar-hd" style={{marginTop: 12}}>COMMITS RÉCENTS</div>
              {[
                'feat: VSCode skills replica',
                'feat: resizable windows',
                'feat: hobbies game',
                'feat: mail app + CV viewer',
              ].map((msg, i) => (
                <div key={i} className="vsc-git-commit">
                  <span className="vsc-git-dot" />
                  <span>{msg}</span>
                </div>
              ))}
            </>
          )}

          {activeAct === 'extensions' && (
            <>
              <div className="vsc-sidebar-hd">EXTENSIONS INSTALLÉES</div>
              {[
                { name: 'ES7+ React Snippets',    icon: '⚛', pub: 'dsznajder' },
                { name: 'Tailwind CSS IntelliSense', icon: '🌊', pub: 'bradlc' },
                { name: 'Laravel Blade Snippets', icon: '🔴', pub: 'onecentlin' },
                { name: 'GitLens',                icon: '⎇',  pub: 'eamodio' },
                { name: 'Prettier',               icon: '✨', pub: 'esbenp' },
                { name: 'Night Owl',              icon: '🦉', pub: 'sdras' },
              ].map((ext, i) => (
                <div key={i} className="vsc-ext-row">
                  <span className="vsc-ext-icon">{ext.icon}</span>
                  <div className="vsc-ext-info">
                    <div className="vsc-ext-name">{ext.name}</div>
                    <div className="vsc-ext-pub">{ext.pub}</div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      )}

      {/* ── Editor area ── */}
      <div className="vsc-editor-area">
        {/* Tab bar */}
        <div className="vsc-tabs-bar">
          {openTabs.map(tabId => {
            const f = ALL_FILES.find(fi => fi.id === tabId)
            if (!f) return null
            return (
              <div
                key={tabId}
                className={`vsc-tab${activeTab === tabId ? ' vsc-tab-active' : ''}`}
                onClick={() => setActiveTab(tabId)}
              >
                <TechLogo file={f} size={13} />
                <span className="vsc-tab-name">{f.name}</span>
                <button
                  className="vsc-tab-close"
                  onClick={e => closeTab(tabId, e)}
                >×</button>
              </div>
            )
          })}
        </div>

        {/* Breadcrumb */}
        {currentFile && (
          <div className="vsc-breadcrumb">
            <span>tony-portfolio</span>
            <span className="vsc-bc-sep">›</span>
            <span>{currentFolder?.label}</span>
            <span className="vsc-bc-sep">›</span>
            <span style={{ color: currentFile.color }}>{currentFile.name}</span>
          </div>
        )}

        {/* Code view */}
        <div className="vsc-code-wrap">
          {currentFile ? (
            <div className="vsc-code-inner">
              {/* Gutter */}
              <div className="vsc-gutter">
                {(SNIPPETS[currentFile.id] || '').split('\n').map((_, i) => (
                  <div key={i} className="vsc-ln">{i + 1}</div>
                ))}
              </div>
              {/* Code */}
              <pre className="vsc-code">
                <code>{SNIPPETS[currentFile.id] || `// Snippet à venir pour ${currentFile.name}`}</code>
              </pre>

              {/* Proficiency bar */}
              <div className="vsc-skill-badge">
                <div className="vsc-skill-badge-name" style={{ color: currentFile.color }}>
                  <TechLogo file={currentFile} size={16} />
                  {currentFile.name}
                </div>
                <div className="vsc-skill-bar-row">
                  <div className="vsc-skill-bar-bg">
                    <div
                      className="vsc-skill-bar-fill"
                      style={{ width: `${currentFile.level}%`, background: currentFile.color }}
                    />
                  </div>
                  <span className="vsc-skill-pct">{currentFile.level}%</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="vsc-welcome">
              <div className="vsc-welcome-icon">💻</div>
              <div className="vsc-welcome-title">TonyOS · Code Editor</div>
              <div className="vsc-welcome-sub">
                Sélectionnez un fichier dans l'explorateur
              </div>
              <div className="vsc-welcome-shortcuts">
                {ALL_FILES.slice(0, 6).map(f => (
                  <button key={f.id} className="vsc-welcome-chip" onClick={() => openFile(f.id)}
                    style={{ borderColor: f.color + '66', color: f.color }}>
                    <TechLogo file={f} size={13} />
                    {f.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Terminal panel */}
        {showTerminal && (
          <div className="vsc-terminal">
            <div className="vsc-term-header">
              <span className="vsc-term-tab-active">TERMINAL</span>
              <span className="vsc-term-tab">PROBLÈMES</span>
              <span className="vsc-term-tab">SORTIE</span>
              <div className="vsc-term-actions">
                <button onClick={() => setShowTerminal(false)} className="vsc-term-close">✕</button>
              </div>
            </div>
            <pre className="vsc-term-body">{TERMINAL_OUTPUT}</pre>
          </div>
        )}
      </div>

      {/* ── Status bar ── */}
      <div className="vsc-statusbar">
        <div className="vsc-status-l">
          <span className="vsc-status-item vsc-status-git">⎇ main</span>
          <span className="vsc-status-item">⚠ 0</span>
          <span className="vsc-status-item">⚡ 0</span>
        </div>
        <div className="vsc-status-r">
          {currentFile && (
            <span className="vsc-status-item">{currentFile.ext.toUpperCase()}</span>
          )}
          <span className="vsc-status-item">UTF-8</span>
          <span className="vsc-status-item vsc-status-user">Tony Cseresznyak</span>
        </div>
      </div>
    </div>
  )
}

export default VSCodeSkills
