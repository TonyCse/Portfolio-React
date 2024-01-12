import React from 'react'
import pokedex from '../images/pokedex.png'
import groupomania from '../images/groupomania.png'
import piiquante from '../images/piiquante.png'
import kanap from '../images/kanap.png'
import booki from '../images/booki.png'
import ohmyfood from '../images/ohmyfood.png'
import iconyoutube from '../images/youtube-projet.png'
import icongithub from '../images/github-projet.png'
import iconlink from '../images/link-projet.png'

function Projets() {
      return (
            <div id='projets'>
                 <div className='title'>
                        <h2> 03. Mes projets</h2>
                        <div className='line'></div>
                  </div>
                  <div className='projets-main'>
                        <div className='projets-card'>
                              <div>
                                    <img src={pokedex} alt="" />
                              </div>
                        </div>
                        <div className='projets-card'>
                              <img src={groupomania} alt="" />
                        </div>
                        <div className='projets-card'>
                              <img src={piiquante} alt="" />
                        </div>
                        <div className='projets-card'>
                              <img src={kanap} alt="" />
                        </div>
                        <div className='projets-card'>
                              <img src={ohmyfood} alt="" />
                        </div>
                        <div className='projets-card'>
                              <img src={booki} alt="" />
                        </div>
                  </div>
            </div>
      )
}

export default Projets;