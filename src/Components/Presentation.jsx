import React from 'react'
import photo from '../images/photoCV.jpg'

function Presentation() {
      return (
            <div>
                  <div id='presentation'>
                        {/* <div className='title'>
                              <h2> 01. À propos de moi</h2>
                              <div className='line'></div>
                        </div> */}
                        <div className='about-main'>
                              <div className='about-photo'>
                                    <img src={photo} alt="me"/>
                              </div>
                              <div className='about-text'>
                                    <p> 
                                          Bonjour ! Je m'appelle Tony, j'ai 29 ans et j'habite en région parisienne. En 2020, sur mon temps libre, je commence à me former en autodidacte au développement web et ça commence vraiment à me plaire. Je me pose alors la question : "Pourquoi ne pas en faire mon métier ?" <br/><br/>
                                          Aimant depuis tout petit résoudre des casses-têtes et des énigmes, me voilà aux anges devant toutes ces erreurs qui s'affichent dans ma console. Je décide donc de laisser ces 7 années en tant qu'agent de sécurité derrière moi, et je me lance dans une formation où je ressors diplômé d'un bac+2 en développement web.<br/><br/>
                                          Avance rapide jusqu'à aujourd'hui où ma priorité est de me former un maximum et de devenir un couteau suisse du développement web. C'est pourquoi je cherche actuellement une alternance afin de décrocher, dans un premier temps, le bac+4 développeur full-stack et ensuite le bac+5 expert en cybersécurité.<br/><br/>
                                          Quand je ne suis pas devant VSCode, je me balade dans la faille de l'invocateur. Sinon, je joue à des triples A tels que Avatar: Frontiers of Pandora, Cyberpunk 2077, Marvel's Spider-Man. Je lis également des mangas : Akira, Berserk, Vagabond, One Piece, et tant d'autres. <br/><br/><br/>
                                    </p>
                              </div>
                        </div>
                  </div>
            </div>
      )
}


export default Presentation;