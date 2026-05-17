import './buscador.css'

function Buscador() {
    return (
        <div className="buscador">
            <input type="text" placeholder="buscar" />
            <button className="boton_de_busqueda"><i className="bi bi-search"></i></button>
        </div>
    )
}
export default Buscador