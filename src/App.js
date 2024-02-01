import React, {useState, useEffect} from 'react'
import Navbar from './Components/Navbar'
import Header from './Components/Header'
import Presentation from './Components/Presentation';
import Experiences from './Components/Experiences'
import Projets from './Components/Projets'
import LogoLoader from './Components/LogoLoader';
import 'aos/dist/aos.css';
import AOS from 'aos';


function App() {

  const [loading, setloading] = useState(false);
  useEffect(() => {
        AOS.init();
        setloading(true)
        setTimeout(() => {
              setloading(false)
        }, 3000)
  }, [])

  return (
    <div className="App">
      { 
            loading ?
            <div>
              <LogoLoader/>
            </div>
        : 
        <div>
          <Navbar/>
          <Header/>
          <Presentation/>
          <Experiences/>
          <Projets/>
        </div>
      }
    </div>
  );
}
export default App;