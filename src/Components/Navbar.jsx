import React, {useState} from 'react'
import logo from '../images/logo.png'
import {Link} from 'react-scroll'

function Navbar() {

      const [nav] = useState(false);


      return (
            <nav className={nav ? " nav active" : "nav"}>
                  <Link to='#' className='logo'>
                        <img src={logo} alt=''/>
                  </Link>
                  <input className='menu-btn' type='checkbox' id='menu-btn'/>
                  <label className='menu-icon' htmlFor='menu-btn'>
                        <span className='nav-icon'></span>
                  </label>
                  <ul className='menu'>
                        <li><Link to='presentation'>01. À propos de moi</Link></li>
                        <li><Link to='experiences'>02. Expériences / Formations</Link></li>
                        <li><Link to='projets'>03. Mes projets</Link></li>
                  </ul>
            </nav>
      )
}

export default Navbar;