import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faYoutube } from '@fortawesome/free-brands-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { faLinkedin } from '@fortawesome/free-brands-svg-icons';


function Header() {
      return (
            <div data-aos="fade-up" id='main'>
                  <div className='home'>
                        <div className='name'>
                              <h2>Hello je m'appelle</h2>
                              <h1>Tony Cseresznyak</h1>
                              <h3>Développeur Web</h3>
                              <p className='details'>Je suis un développeur web junior full stack avec un penchant pour le front et une forte sensibilité à l'UX/UI design. <br/><br/> Actuellement je suis en recherche d'une alternance pour mon bac+4 Développeur web full stack avec <a className="details-link" href="https://cloud-campus.fr/developpeur-web-full-stack/"> Cloud Campus</a>.</p> 
                              <div className='home-link'>
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
                        </div>
                  </div>
            </div>
      )
}

export default Header;