import React from 'react'
import iconyoutube from '../images/youtube-projet.png'
import icongithub from '../images/github-projet.png'
import Navbar from './Navbar'


function Header() {
      return (
            <div id='main'>
                        <Navbar/>
                  <div className='home'>
                        <div className='name'>
                              <h2>Hello je m'appelle</h2>
                              <h1>Tony Cseresznyak</h1>
                              <h3>Développeur Web</h3>
                              <p className='details'>Je suis un développeur web junior full stack avec un penchant pour le front et une forte sensibilité à l'UX/UI design. <br/><br/> Actuellement je suis en recherche d'une alternance pour mon bac+4 Développeur web full stack avec <a className="details-link" href="https://cloud-campus.fr/developpeur-web-full-stack/"> Cloud Campus</a>.</p> 
                              <div className='home-link'>
                                    <a href="https://www.youtube.com/channel/UCCkt7tnefsVbFLFuNkM09Rw">
                                          <img src={iconyoutube} alt='youtube'/> 
                                    </a>
                                    <a href="https://github.com/TonyCse">
                                          <img src={icongithub} alt='github'/>
                                    </a>
                              </div>
                        </div>
                  </div>
            </div>
      )
}

export default Header;