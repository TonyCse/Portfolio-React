import React, {useState, useEffect} from 'react'
import PulseLoader from "react-spinners/PulseLoader";
import Navbar from './Components/Navbar'
import Header from './Components/Header'
import Presentation from './Components/Presentation';
import Experiences from './Components/Experiences'
import Projets from './Components/Projets'
import logo from './images/logo.png'

function App() {

  const [loading, setloading] = useState(false);

  useEffect(() => {
        setloading(true)
        setTimeout(() => {
              setloading(false)
        }, 3000)
  }, [])

  return (
    <div className="App">
      { 
            loading ?
            <div className='chargement'> 
              <img src={logo} alt=''/>
              <h2>Chargement</h2>
              <PulseLoader
                    color={"#5bb1ab"}
                    loading={loading}
                    size={30}
              />
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