import Navbar from './Components/Navbar'
import Header from './Components/Header'
import Presentation from './Components/Presentation';
import Experiences from './Components/Experiences'
import Projets from './Components/Projets'

function App() {
  return (
    <div className="App">
      <Navbar/>
      <Header/>
      <Presentation/>
      <Experiences/>
      <Projets/>
    </div>
  );
}

export default App;