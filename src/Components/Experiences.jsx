import React from 'react'
import Navbar from './Navbar'

function Experiences() {
      return (
            <div id='experiences'>
                  <Navbar/>
                  <div className='title'>
                        <h2> 02. Mon parcours</h2>
                        <div className='line'></div>
                  </div>
                  <div className='experiences-main'>
                        <h2>Experiences professionnelles</h2>
                        <div className='experiences-card'>
                              <div className='experiences-date'>
                                    Sept 2022 - Mar 2023
                              </div>
                              <div className='experiences-body'>
                                    <div className='experiences-body-title'>
                                          Stage Développeur Front-End · Habiteo · Paris
                                    </div>
                                    <div className='experiences-body-text'>
                                          Développer et optimiser l'ergonomie et la navigation de 3 applications web pour une start-up spécialisée dans l'innovation immobilière 3D.
                                    </div>
                                    <div className='experiences-body-footer'>
                                          <span>HTML/CSS/SCSS</span>
                                          <span>JavaScript</span>
                                          <span>Nodes.js</span>
                                          <span>Vue.js</span>
                                          <span>Vuetify</span>
                                    </div>
                              </div>
                        </div>
                        <div className='experiences-card'>
                              <div className='experiences-date'>
                                    Sept 2015 - Août 2022
                              </div>
                              <div className='experiences-body'>
                                    <div className='experiences-body-title'>
                                          Agent de sécurité · Procedo · Paris
                                    </div>
                                    <div className='experiences-body-text'>
                                          Contrôler et surveiller les accès d'un data center du ministère des finances.
                                    </div>
                              </div>
                        </div>
                        <h2>Formations</h2>
                        <div className='experiences-card'>
                              <div className='experiences-date'>
                                    2024-2026
                              </div>
                              <div className='experiences-body'>
                                    <div className='experiences-body-title'>
                                          Bac +4 Développeur Full Stack en alternance · Cloud Campus · Paris
                                    </div>
                                    <div className='experiences-body-text'>
                                          Cloud Campus https://cloud-campus.fr/
                                    </div>
                                    <div className='experiences-body-footer'>
                                          <span>Figma</span>
                                          <span>React.js</span>
                                          <span>PHP</span>
                                          <span>Laravel</span>
                                          <span>Docker</span>
                                    </div>
                              </div>
                        </div>
                        <div className='experiences-card'>
                              <div className='experiences-date'>
                                    Oct 2021 - Avril 2022
                              </div>
                              <div className='experiences-body'>
                                    <div className='experiences-body-title'>
                                          Bac +2 Développeur web · Openclassrooms · Paris
                                    </div>
                                    <div className='experiences-body-text'>
                                          Transformer une maquette en page web HTML/CSS <br/> Analyser et optimiser le SEO d'une application web <br/>Créer un site d'e-commerce en JavaScrip Vanilla <br/> Construire une API sécurisée via JWT <br/>Créer un réseau social d'entreprise avec Express.js et Vue.js
                                    </div>
                                    <div className='experiences-body-footer'>
                                          <span>HTML/CSS/SCSS</span>
                                          <span>JavaScript</span>
                                          <span>Nodes.js</span>
                                          <span>Vue.js</span>
                                          <span>Vuetify</span>
                                    </div>
                              </div>
                        </div>
                  </div>
            </div>
      )
}


export default Experiences;