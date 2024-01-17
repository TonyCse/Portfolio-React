import React, {useState} from 'react'
import logo from '../images/logo.png'
import { Link } from 'react-router-dom'
function Navbar() {

      const [nav,setnav] = useState(false);

      const changeBackground = () => {
            if (window.scrollY >= 50) {
                  setnav(true)
            }
            else {
                  setnav(false)
            }
      }
      window.addEventListener('scroll', changeBackground)

      return (
            <div id='#'>
                  <nav className={nav ? " nav active" : "nav"}>
                              <Link to="/">

                                    <img className='logo' src={logo} alt=''/>
                              </Link>
                        <input className='menu-btn' type='checkbox' id='menu-btn'/>
                        <label className='menu-icon' for='menu-btn'>
                              <span className='nav-icon'></span>
                        </label>
                        <ul className='menu'>
                              <li><Link to="/AboutMe">01. À propos de moi</Link></li>
                              <li><Link to='/Experiences'>02. Mon parcours</Link></li>
                              <li><Link to='/Projets'>03. Mes projets</Link></li>
                        </ul>
                  </nav>
            </div>
      )
}

export default Navbar;