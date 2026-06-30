import React from 'react'
import {
  SiHtml5, SiJavascript, SiTypescript, SiReact,
  SiNextdotjs, SiNodedotjs, SiExpress, SiPhp, SiLaravel,
  SiPostgresql, SiMongodb, SiGit, SiGithub, SiDocker, SiOpenai,
  SiFigma, SiTailwindcss, SiPrisma, SiMysql,
} from 'react-icons/si'
import { DiCss3 } from 'react-icons/di'

const ROW1 = [
  { icon: SiHtml5,        label: 'HTML',          color: '#E34F26' },
  { icon: DiCss3,         label: 'CSS',            color: '#1572B6' },
  { icon: SiJavascript,   label: 'JavaScript',     color: '#F7DF1E' },
  { icon: SiTypescript,   label: 'TypeScript',     color: '#3178C6' },
  { icon: SiReact,        label: 'React.js',       color: '#61DAFB' },
  { icon: SiNextdotjs,    label: 'Next.js',        color: '#ffffff' },
  { icon: SiTailwindcss,  label: 'Tailwind CSS',   color: '#38BDF8' },
  { icon: SiFigma,        label: 'Figma',          color: '#F24E1E' },
  { icon: SiNodedotjs,    label: 'Node.js',        color: '#3C873A' },
]

const ROW2 = [
  { icon: SiExpress,    label: 'Express.js',   color: '#888888' },
  { icon: SiPhp,        label: 'PHP',          color: '#8892be' },
  { icon: SiLaravel,    label: 'Laravel',      color: '#FF2D20' },
  { icon: SiPostgresql, label: 'PostgreSQL',   color: '#4169E1' },
  { icon: SiMysql,      label: 'MySQL',        color: '#4479A1' },
  { icon: SiMongodb,    label: 'MongoDB',      color: '#47A248' },
  { icon: SiPrisma,     label: 'Prisma',       color: '#5A67D8' },
  { icon: SiGit,        label: 'Git',          color: '#F05032' },
  { icon: SiGithub,     label: 'GitHub',       color: '#ffffff' },
  { icon: SiDocker,     label: 'Docker',       color: '#2496ED' },
  { icon: SiOpenai,     label: 'APIs IA',      color: '#a476ff' },
]

function TechItem({ icon: Icon, label, color }) {
  return (
    <li className="mq-item">
      <Icon className="mq-logo" style={{ color }} aria-hidden="true" />
      <span className="mq-label">{label}</span>
    </li>
  )
}

function MarqueeBelt() {
  const row1 = [...ROW1, ...ROW1]
  const row2 = [...ROW2, ...ROW2]

  return (
    <div className="marquee-outer" aria-label="Stack technique" role="list">
      <div className="marquee-row">
        <ul className="marquee-track mq-fwd" aria-hidden="true">
          {row1.map((tech, i) => <TechItem key={i} {...tech} />)}
        </ul>
      </div>
      <div className="marquee-row">
        <ul className="marquee-track mq-rev" aria-hidden="true">
          {row2.map((tech, i) => <TechItem key={i} {...tech} />)}
        </ul>
      </div>
    </div>
  )
}

export default MarqueeBelt
