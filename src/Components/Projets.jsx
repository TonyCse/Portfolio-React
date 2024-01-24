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
import Navbar from './Navbar'

function Projets() {
      return (

            <div>
                  <Navbar/>
                  <div id='projets'>
                  <div className='title'>
                              <h2> 03. Mes projets</h2>
                              <div className='line'></div>
                        </div>
                        <div className='projets-main'>
                              <div className='projets-card'>
                                    <img className='projets-img' src={pokedex} alt="" />
                                    <div className='projets-description'>
                                          Un Pokedex first-gen réalisé sous Vue.JS en consommant l'API PokeAPI.<br/><br/> Affichage des 151 premiers pokemon, récupération et affichage de l'image, de l'id et du type du pokemon selectionné.
                                    </div>
                                    <div className='projets-icon'>
                                          <a href="https://pokedex-tony-cseresznyak.vercel.app/">
                                                <img className='projets-icon-resize' src={iconlink} alt="iconlink" />
                                          </a>
                                          <a href="https://github.com/TonyCse/Pokedex">
                                                <img className='projets-icon-link' src={icongithub} alt="icon-github" />
                                          </a>
                                          <a href="https://www.youtube.com/watch?v=WTIMYAG9bks">
                                                <img className='projets-icon-link' src={iconyoutube} alt="iconyoutube" />
                                          </a>
                                    </div>
                              </div>
                              <div className='projets-card'>
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
                                                <img className='projets-icon-link' src={icongithub} alt="icon-github" />
                                          </a>
                                          <a href="https://www.youtube.com/watch?v=kncL0AvyGTQ">
                                                <img className='projets-icon-link' src={iconyoutube} alt="iconyoutube" />
                                          </a>
                                    </div>
                              </div>
                              <div className='projets-card'>
                                    <img className='projets-img' src={piiquante} alt="" />
                                    <div className='projets-description'>
                                          Piiquante est un site d'avis gastronomiques avec authentification de l'utilisateur par un pseudo et un mot de passe. <br/> Possibilité de poster des sauces et de les noter. <br/> Un système de like/dislike est dispo sur chaque sauces.
                                    </div>
                                    <div className='projets-icon'>
                                          <a href="https://github.com/TonyCse/Piiquante">
                                                <img className='projets-icon-link' src={icongithub} alt="icon-github" />
                                          </a>
                                    </div>
                              </div>
                              <div className='projets-card'>
                                    <img className='projets-img' src={kanap} alt="" />
                                    <div className='projets-description'>
                                          Kanap est un site d'e-commerce en JavaScript Vanilla avec la possibilité d'ajouter un ou plusieurs articles à son panier et de finaliser la commande. <br/> Un numéro de commande est généré.
                                    </div>
                                    <div className='projets-icon'>
                                          <a href="https://github.com/TonyCse/Kanap">
                                                <img className='projets-icon-link' src={icongithub} alt="icon-github" />
                                          </a>
                                    </div>
                              </div>
                              <div className='projets-card'>
                                    <img className='projets-img' src={ohmyfood} alt="" />
                                    <div className='projets-description'>
                                         OhMyFood est un site de réservation de restaurant avec affichage du menu de chaque restaurant et des animations CSS.
                                    </div>
                                    <div className='projets-icon'>
                                          <a href="https://github.com/TonyCse/OhMyFood">
                                                <img className='projets-icon-link' src={icongithub} alt="icon-github" />
                                          </a>
                                          <a href="https://ohmyfood-tony.vercel.app/">
                                                <img className='projets-icon-resize' src={iconlink} alt="iconlink" />
                                          </a>
                                    </div>
                              </div>
                              <div className='projets-card'>
                                    <img className='projets-img' src={booki} alt="" />
                                    <div className='projets-description'>
                                          Booki est un site de réservation d'hôtels ou d'hébergements indépendants.
                                    </div>
                                    <div className='projets-icon'>
                                          <a href="https://github.com/TonyCse/Projet-Booki">
                                                <img className='projets-icon-link' src={icongithub} alt="icon-github" />
                                          </a>
                                          <a href="https://projet-booki.vercel.app/">
                                                <img className='projets-icon-resize' src={iconlink} alt="iconlink" />
                                          </a>
                                    </div>
                              </div>
                        </div>
                  </div>
            </div>
      )
}

export default Projets;