import React from 'react'
import pokedex from '../images/pokedex.png'
import groupomania from '../images/groupomania.png'
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
                                    <img src={pokedex} alt="" />
                              <div className='projets-body'>
                                    <div className='projets-text'>
                                          <h2>Pokedex</h2>
                                          <p>Un Pokedex first-gen réalisé sous Vue.JS en consommant l'API https://pokeapi.co/. <br/> Affichage des 151 premiers pokemon, récupération et affichage de l'image, de l'id et du type du pokemon selectionné. </p>
                                          <div className='projets-footer'>
                                                <img src={iconyoutube} alt="iconyoutube"/> <img src={icongithub} alt="icongithub"/> <img src={iconlink} alt="iconlink"/>
                                          </div>
                                    </div>
                              </div>
                        </div>
                        <div className='projets-card'>
                                    <img src={groupomania} alt="" />
                              <div className='projets-body'>
                                    <h2>Groupomania</h2>
                                    <p>Groupomania est un réseau social d'entreprise avec lequel il est possible de :
                                          <br /> -Créer un compte avec un pseudo, un email et un mot de passe.
                                          <br />-Modifier son compte (son pseudo, son email, son mot de passe).
                                          <br />-Partager des posts avec ou sans média (jpeg,jpg,png,gif).
                                          <br />-Supprimer son compte et ses posts.
                                          <br /><br />
                                          Un compte Admin est également présent, avec la possibilité de supprimer les posts des autres utilisateurs.
                                    </p>
                                    <img src={iconyoutube} alt="iconyoutube"/> <img src={icongithub} alt="icongithub"/> <img src={iconlink} alt="iconlink"/>
                              </div>
                        </div>
                        <div className='projets-card'>
                                    <img src={pokedex} alt="" />
                              <div className='projets-body'>
                                    <h2>Pokedex</h2>
                                    <p>Un Pokedex first-gen réalisé sous Vue.JS en consommant l'API https://pokeapi.co/. <br/> Affichage des 151 premiers pokemon, récupération et affichage de l'image, de l'id et du type du pokemon selectionné. </p>
                                    <img src={iconyoutube} alt="iconyoutube"/> <img src={icongithub} alt="icongithub"/> <img src={iconlink} alt="iconlink"/>
                              </div>
                        </div>
                  </div>
            </div>
      )
}

export default Projets;