import React from 'react'
import photo from '../images/photoCV.jpg'
import Navbar from './Navbar'

function Presentation() {
      return (
            <div>
                  <Navbar/>
                  <div id='presentation'>
                        <div className='title'>
                              <h2> 01. À propos de moi</h2>
                              <div className='line'></div>
                        </div>
                        <div className='about-main'>
                              <div className='about-photo'>
                                    <img src={photo} alt="me"/>
                              </div>
                              <p> 
                                    Bonjour ! Je m'appelle Tony, j'ai 29 ans et j'habite en région parisienne. En 2020, sur mon temps libre, je commence à me former en autodidacte au développement web et ça commence vraiment à me plaire, je me pose alors la question " Pourquoi ne pas en faire mon métier ? ". <br/><br/>
                                    Aimant depuis tout petit résoudre des casses-têtes et des énigmes me voilà aux anges devant toutes ces ERROR qui s'affichent dans ma console ( ça fait pas trop zinzin ça va ? ) <br/><br/>
                                    Je décide donc de laisser ces 7 années en tant qu'agent de sécu derrière moi et je me lance dans une formation où je ressors diplômé d'un bac+2 développeur web. <br/>
                                    Avance rapide jusqu'à aujourd'hui où ma priorité est de me former un maximum et de devenir un couteau Suisse du développement web. C'est pourquoi je cherche actuellement une alternance afin de décrocher dans un premier temps le bac+4 développeur full-stack et ensuite le bac+5 expert en cybersécurité ( la continuité d'agent de sécu mais dans un ordinateur au final non ? ).<br/><br/>
                                    Quand je ne suis pas devant VSCode j'essaye tant bien que mal de me hisser en haut du ladder de ce jeu tellement reposant et zen qu'est LEAGUE OF LEGENDS, sinon je joue à des triples A tels que Avatar: Frontiers of Pandora, Cyberpunk 2077, Marvel's Spider-Man. Je lis également des mangas, Akira, Berserk, Vagabond, One Piece et tant d'autres. <br/><br/><br/>
                              </p>
                        </div>
                  </div>
            </div>
      )
}


export default Presentation;