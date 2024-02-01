import React from 'react'
import pokedex from '../images/pokedex.png'
import groupomania from '../images/groupomania.png'
import piiquante from '../images/piiquante.png'
import kanap from '../images/kanap.png'
import booki from '../images/booki.png'
import ohmyfood from '../images/ohmyfood.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faYoutube } from '@fortawesome/free-brands-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';

function Projets() {
      return (

            <div>
                  <div id='projets'>
                  {/* <div className='title'>
                              <h2> 03. Mes projets</h2>
                              <div className='line'></div>
                  </div> */}
                        <div className='projets-main'>
                              <div className='projets-card' data-aos="flip-up">
                                    <img className='projets-img' src={pokedex} alt="" />
                                    <div className='projets-description'>
                                          Un Pokedex first-gen réalisé sous Vue.JS en consommant l'API PokeAPI.<br/><br/> Affichage des 151 premiers pokemon, récupération et affichage de l'image, de l'id et du type du pokemon selectionné.
                                    </div>
                                    <div className='projets-icon'>
                                          <a href="https://pokedex-tony-cseresznyak.vercel.app/">
                                                <FontAwesomeIcon className='icon' icon={faUpRightFromSquare} />
                                          </a>
                                          <a href="https://github.com/TonyCse/Pokedex">
                                                <FontAwesomeIcon className='icon' icon={faGithub} />
                                          </a>
                                          <a href="https://www.youtube.com/watch?v=WTIMYAG9bks">
                                                <FontAwesomeIcon className='icon' icon={faYoutube} />
                                          </a>
                                    </div>
                              </div>
                              <div className='projets-card' data-aos="flip-up" data-aos-delay="300">
                                    <img className='projets-img' src={groupomania} alt="" />
                                    <div className='projets-description'>
                                          Groupomania est un réseau social d'entreprise avec lequel il est possible de:
                                          <br/> -Créer un compte
                                          <br/> -Modifier son compte
                                          <br/> -Partager des posts avec ou sans média
                                          <br/> -Supprimer son compte et ses posts
                                          <br/> Un compte modérateur est présent.
                                    </div>
                                    <div className='projets-icon'>
                                          <a href="https://github.com/TonyCse/Groupomania-P7">
                                                <FontAwesomeIcon className='icon' icon={faGithub} />
                                          </a>
                                          <a href="https://www.youtube.com/watch?v=kncL0AvyGTQ">
                                                <FontAwesomeIcon className='icon' icon={faYoutube} />
                                          </a>
                                    </div>
                              </div>
                              <div className='projets-card' data-aos="flip-up" data-aos-delay="600">
                                    <img className='projets-img' src={piiquante} alt="" />
                                    <div className='projets-description'>
                                          Piiquante est un site d'avis gastronomiques avec authentification de l'utilisateur par un pseudo et un mot de passe. <br/> Possibilité de poster des sauces et de les noter. <br/> Un système de like/dislike est dispo sur chaque sauces.
                                    </div>
                                    <div className='projets-icon'>
                                          <a href="https://github.com/TonyCse/Piiquante">
                                                <FontAwesomeIcon className='icon' icon={faGithub} />
                                          </a>
                                    </div>
                              </div>
                              <div className='projets-card' data-aos="flip-up" data-aos-delay="900">
                                    <img className='projets-img' src={kanap} alt="" />
                                    <div className='projets-description'>
                                          Kanap est un site d'e-commerce en JavaScript Vanilla avec la possibilité d'ajouter un ou plusieurs articles à son panier et de finaliser la commande. <br/> Un numéro de commande est généré.
                                    </div>
                                    <div className='projets-icon'>
                                          <a href="https://github.com/TonyCse/Kanap">
                                                <FontAwesomeIcon className='icon' icon={faGithub} />
                                          </a>
                                    </div>
                              </div>
                              <div className='projets-card' data-aos="flip-up" data-aos-delay="1200">
                                    <img className='projets-img' src={ohmyfood} alt="" />
                                    <div className='projets-description'>
                                         OhMyFood est un site de réservation de restaurant avec affichage du menu de chaque restaurant et des animations CSS.
                                    </div>
                                    <div className='projets-icon'>
                                          <a href="https://ohmyfood-tony.vercel.app/">
                                                <FontAwesomeIcon className='icon' icon={faUpRightFromSquare} />
                                          </a>
                                          <a href="https://github.com/TonyCse/OhMyFood">
                                                <FontAwesomeIcon className='icon' icon={faGithub} />
                                          </a>
                                    </div>
                              </div>
                              <div className='projets-card' data-aos="flip-up" data-aos-delay="1600">
                                    <img className='projets-img' src={booki} alt="" />
                                    <div className='projets-description'>
                                          Booki est un site de réservation d'hôtels ou d'hébergements indépendants.
                                    </div>
                                    <div className='projets-icon'>
                                          <a href="https://projet-booki.vercel.app/">
                                                <FontAwesomeIcon className='icon' icon={faUpRightFromSquare} />
                                          </a>
                                          <a href="https://github.com/TonyCse/Projet-Booki">
                                                <FontAwesomeIcon className='icon' icon={faGithub} />
                                          </a>
                                    </div>
                              </div>

                        </div>
                        <div className='footer'>
                              <div className='email-footer'>
                                    <a href="mailto:tonycseresznyak@hotmail.com">
                                          <h2>
                                          <FontAwesomeIcon className='icon-footer' icon={faEnvelope} />
                                                TonyCseresznyak@hotmail.com
                                          </h2>
                                    </a>
                              </div>
                              <div className='icon-footer'>
                                    <a href="https://github.com/TonyCse">
                                          <FontAwesomeIcon className='icon' icon={faGithub} />
                                    </a>
                                    <a href="https://www.linkedin.com/in/tony-cseresznyak/">
                                          <FontAwesomeIcon className='icon' icon={faLinkedin} />
                                    </a>
                                    <a href="https://www.youtube.com/channel/UCCkt7tnefsVbFLFuNkM09Rw">
                                          <FontAwesomeIcon className='icon' icon={faYoutube} />
                                    </a>
                              </div>
                              <div className='copyright-footer'>
                                    <p>Ce site a été développé avec <strong>Visual Studio Code</strong>, utilisant le framework <strong>React</strong>. Déployé avec <strong>Vercel</strong>.</p>
                                    <p>&copy; 2024 Tony Cseresznyak Portfolio.</p>
                              </div>
                        </div>
                  </div>
            </div>
      )
}

export default Projets;