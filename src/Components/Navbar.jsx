import React, {useState} from 'react'
import logo from '../images/logo.png'
import {Link, animateScroll as scroll} from 'react-scroll';

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
                              <img className='logo' src={logo} alt=''/>
                        <input className='menu-btn' type='checkbox' id='menu-btn'/>
                        <label className='menu-icon' for='menu-btn'>
                              <span className='nav-icon'></span>
                        </label>
                        <ul className='menu'>
                              <li><Link to='about'>01. À propos de moi</Link></li>
                              <li><Link to='experiences'>02. Mon parcours</Link></li>
                              <li><Link to='projets'>03. Mes projets</Link></li>
                        </ul>
                  </nav>
            </div>
      )
}

export default Navbar;