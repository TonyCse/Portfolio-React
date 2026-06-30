import React from 'react'
import MarqueeBelt from './MarqueeBelt'

function Skills() {
  return (
    <section id="skills" aria-labelledby="skills-title" data-aos="fade-up" data-aos-duration="800">
      <div className="skills-wrapper">
        <div className="section-header">
          <span className="section-idx" aria-hidden="true">02</span>
          <h2 id="skills-title" className="section-title">Stack &amp; Outils</h2>
        </div>
      </div>

      <MarqueeBelt />
    </section>
  )
}

export default Skills
