import './App.css'
import Menu1 from './components/Menu'

function App() {
  return (
    <div className="app-layout">
      {/* Tu menú/banner dorado se queda arriba fijo */}
      <Menu1 />

      {/* Este nuevo contenedor se encargará de centrar lo que metas ahí */}
      <main className="main-content">
        <div className="cubito"></div>
      </main>
    </div>
  )
}

export default App