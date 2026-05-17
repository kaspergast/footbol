import './menue.css'
function Menu1() {
  const toggleTheme = () => {
    document.body.classList.toggle('dark-theme');
  };

  return (
    <>
      <nav className="menu1">
        <div className="nav_menu">
          <p>top club soccer</p>
          <h2>Dashboard de jugadores</h2>
          <p>gestiona tus favoritas, analiza estadisticas y descubre talentos</p>
        </div>
        <div className="boton_action">
          <button className="boton_de_cambio" onClick={toggleTheme}><p>cambio de tema</p></button>
        </div>

      </nav>
    </>
  )
}
export default Menu1