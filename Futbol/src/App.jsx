import './App.css'
import Menu1 from './components/Menu'
import Buscador from './components/Buscador'

function App() {
  return (
    <div className="app-layout">
      <Menu1 />

      <main className="main-content">
        <div className="cubito">
          <Buscador />
        </div>
      </main>
    </div>
  )
}

export default App