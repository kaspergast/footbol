import './buscador.css';
import { useState, useMemo } from "react";
import jugadoresData from './jugadores.json';

function Buscador() {
    const [busqueda, setBusqueda] = useState("");
    const [historial, setHistorial] = useState([]);
    const [favoritos, setFavoritos] = useState([]);
    
    const [paginaActual, setPaginaActual] = useState(1);
    const [filasPorPagina, setFilasPorPagina] = useState(5);
    
    const [colorFilas, setColorFilas] = useState(null); // 'pares' | 'impares' | null
    const [jugadorSeleccionado, setJugadorSeleccionado] = useState(null);

    // Derived states
    const jugadoresFiltrados = useMemo(() => {
        if (!busqueda.trim()) return jugadoresData;
        return jugadoresData.filter(j => 
            j.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
            j.club.toLowerCase().includes(busqueda.toLowerCase()) ||
            j.posicion.toLowerCase().includes(busqueda.toLowerCase())
        );
    }, [busqueda]);

    const totalJugadores = jugadoresFiltrados.length;
    
    const promedioGoles = useMemo(() => {
        if (totalJugadores === 0) return 0;
        const totalGoles = jugadoresFiltrados.reduce((sum, j) => sum + j.goles, 0);
        return (totalGoles / totalJugadores).toFixed(1);
    }, [jugadoresFiltrados, totalJugadores]);

    const promedioEdad = useMemo(() => {
        if (totalJugadores === 0) return 0;
        const totalEdad = jugadoresFiltrados.reduce((sum, j) => sum + j.edad, 0);
        return Math.round(totalEdad / totalJugadores);
    }, [jugadoresFiltrados, totalJugadores]);

    const maxGoleador = useMemo(() => {
        if (totalJugadores === 0) return "-";
        const max = jugadoresFiltrados.reduce((prev, current) => (prev.goles > current.goles) ? prev : current);
        return max.nombre;
    }, [jugadoresFiltrados, totalJugadores]);

    // Pagination
    const paginasTotales = Math.ceil(totalJugadores / filasPorPagina);
    const startIndex = (paginaActual - 1) * filasPorPagina;
    const jugadoresPaginados = jugadoresFiltrados.slice(startIndex, startIndex + filasPorPagina);

    // Handlers
    const handleSearch = (e) => {
        const val = e.target.value;
        setBusqueda(val);
        setPaginaActual(1); // Reset page on search
    };

    const handleSearchSubmit = (e) => {
        if (e.key === 'Enter' && busqueda.trim() !== "") {
            if (!historial.includes(busqueda.trim())) {
                setHistorial(prev => [busqueda.trim(), ...prev].slice(0, 5));
            }
        }
    };

    const toggleFavorito = (e, nombre) => {
        e.stopPropagation(); // prevent modal opening
        setFavoritos(prev => 
            prev.includes(nombre) 
                ? prev.filter(f => f !== nombre)
                : [...prev, nombre]
        );
    };

    const limpiarFiltro = () => {
        setBusqueda("");
        setPaginaActual(1);
    };

    const limpiarHistorial = () => {
        setHistorial([]);
    };

    const aplicarColor = (tipo) => setColorFilas(tipo);

    return (
        <div className="dashboard-container">
            {/* SEARCH BAR */}
            <div className="search-bar-row">
                <div className="search-input-wrapper">
                    <i className="bi bi-search search-icon"></i>
                    <input 
                        type="text" 
                        placeholder="Buscar jugadores por nombre, club o posición..." 
                        value={busqueda}
                        onChange={handleSearch}
                        onKeyDown={handleSearchSubmit}
                    />
                    {busqueda && <i className="bi bi-x clear-icon" onClick={limpiarFiltro}></i>}
                </div>
                <button className="btn-limpiar" onClick={limpiarFiltro}>Limpiar</button>
            </div>

            {/* STATS CARDS */}
            <div className="stats-row">
                <div className="stat-card highlight">
                    <span className="stat-label">JUGADORES EN TABLA</span>
                    <span className="stat-value huge">{totalJugadores}</span>
                    <span className="stat-subbadge">Favoritos: {favoritos.length}</span>
                </div>
                <div className="stat-card">
                    <span className="stat-label">PROMEDIO DE GOLES</span>
                    <span className="stat-value">{promedioGoles}</span>
                </div>
                <div className="stat-card">
                    <span className="stat-label">PROMEDIO DE EDAD</span>
                    <span className="stat-value">{promedioEdad} años</span>
                </div>
                <div className="stat-card">
                    <span className="stat-label">MÁXIMO GOLEADOR</span>
                    <span className="stat-value nombre-goleador">{maxGoleador}</span>
                </div>
                <div className="stat-card historial-card">
                    <div className="historial-header">
                        <span className="stat-label">HISTORIAL DE BÚSQUEDA</span>
                        <button className="btn-historial-clear" onClick={limpiarHistorial}>Limpiar</button>
                    </div>
                    <div className="historial-chips">
                        {historial.length === 0 && <span className="no-history">Presiona Enter al buscar...</span>}
                        {historial.map((h, i) => (
                            <span key={i} className="chip" onClick={() => { setBusqueda(h); setPaginaActual(1); }}>{h}</span>
                        ))}
                    </div>
                </div>
            </div>

            {/* ACTIONS ROW */}
            <div className="actions-row">
                <button className={`btn-action ${colorFilas === 'pares' ? 'active' : ''}`} onClick={() => aplicarColor('pares')}>Pintar filas pares</button>
                <button className={`btn-action ${colorFilas === 'impares' ? 'active' : ''}`} onClick={() => aplicarColor('impares')}>Pintar filas impares</button>
                <button className="btn-action-clear" onClick={() => aplicarColor(null)}>Limpiar color</button>
            </div>

            {/* DATA TABLE */}
            <div className="table-container">
                <table className="jugadores-table">
                    <thead>
                        <tr>
                            <th>FAV</th>
                            <th>JUGADOR <i className="bi bi-arrow-down-up"></i></th>
                            <th>CLUB <i className="bi bi-arrow-down-up"></i></th>
                            <th>POSICIÓN <i className="bi bi-arrow-down-up"></i></th>
                            <th>PAÍS <i className="bi bi-arrow-down-up"></i></th>
                            <th>EDAD <i className="bi bi-arrow-down-up"></i></th>
                            <th>GOLES <i className="bi bi-arrow-down-up"></i></th>
                            <th>ASISTENCIAS <i className="bi bi-arrow-down-up"></i></th>
                            <th>RATING <i className="bi bi-arrow-down-up"></i></th>
                        </tr>
                    </thead>
                    <tbody>
                        {jugadoresPaginados.length === 0 ? (
                            <tr><td colSpan="9" className="no-results">No se encontraron jugadores.</td></tr>
                        ) : (
                            jugadoresPaginados.map((jugador, index) => {
                                // Para pintar pares/impares empezamos contando desde 1 visualmente en la tabla.
                                const isPar = (index + 1) % 2 === 0;
                                const isImpar = (index + 1) % 2 !== 0;
                                let rowClass = "";
                                if (colorFilas === 'pares' && isPar) rowClass = "row-highlight";
                                if (colorFilas === 'impares' && isImpar) rowClass = "row-highlight";

                                const isFav = favoritos.includes(jugador.nombre);

                                return (
                                    <tr key={index} className={rowClass} onClick={() => setJugadorSeleccionado(jugador)}>
                                        <td className="fav-col">
                                            <button className={`star-btn ${isFav ? 'favorited' : ''}`} onClick={(e) => toggleFavorito(e, jugador.nombre)}>
                                                {isFav ? '★' : '☆'}
                                            </button>
                                        </td>
                                        <td className="jugador-col">{jugador.nombre}</td>
                                        <td>{jugador.club}</td>
                                        <td>{jugador.posicion}</td>
                                        <td>{jugador.pais}</td>
                                        <td>{jugador.edad}</td>
                                        <td>{jugador.goles}</td>
                                        <td>{jugador.asistencias}</td>
                                        <td>{jugador.rating}</td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* PAGINATION */}
            <div className="pagination-row">
                <div className="rows-per-page">
                    <span>MOSTRAR</span>
                    <select value={filasPorPagina} onChange={(e) => { setFilasPorPagina(Number(e.target.value)); setPaginaActual(1); }}>
                        <option value={5}>5 por página</option>
                        <option value={10}>10 por página</option>
                        <option value={20}>20 por página</option>
                    </select>
                </div>
                <div className="pagination-controls">
                    <button disabled={paginaActual === 1} onClick={() => setPaginaActual(1)}>«</button>
                    <button disabled={paginaActual === 1} onClick={() => setPaginaActual(p => p - 1)}>‹</button>
                    
                    {Array.from({length: paginasTotales}).map((_, i) => {
                        const pageNum = i + 1;
                        if (pageNum === 1 || pageNum === paginasTotales || (pageNum >= paginaActual - 1 && pageNum <= paginaActual + 1)) {
                            return (
                                <button key={pageNum} className={paginaActual === pageNum ? 'active-page' : ''} onClick={() => setPaginaActual(pageNum)}>
                                    {pageNum}
                                </button>
                            );
                        } else if (pageNum === paginaActual - 2 || pageNum === paginaActual + 2) {
                            return <span key={pageNum} className="dots">...</span>;
                        }
                        return null;
                    })}

                    <button disabled={paginaActual === paginasTotales || paginasTotales === 0} onClick={() => setPaginaActual(p => p + 1)}>›</button>
                    <button disabled={paginaActual === paginasTotales || paginasTotales === 0} onClick={() => setPaginaActual(paginasTotales)}>»</button>
                </div>
            </div>

            {/* MODAL */}
            {jugadorSeleccionado && (
                <div className="modal-overlay" onClick={() => setJugadorSeleccionado(null)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2 className="modal-name">{jugadorSeleccionado.nombre}</h2>
                            <button className="btn-close-icon" onClick={() => setJugadorSeleccionado(null)}>✕</button>
                        </div>
                        
                        <div className="modal-top-actions">
                            <span className="modal-badge">{jugadorSeleccionado.posicion}</span>
                            <button className={`btn-modal-fav ${favoritos.includes(jugadorSeleccionado.nombre) ? 'is-fav' : ''}`} 
                                    onClick={() => toggleFavorito({stopPropagation:()=>{}}, jugadorSeleccionado.nombre)}>
                                {favoritos.includes(jugadorSeleccionado.nombre) ? '★ Favorito' : '☆ Favorito'}
                            </button>
                        </div>

                        <div className="modal-grid">
                            <div className="modal-info-block">
                                <span className="m-label">Club</span>
                                <span className="m-value">{jugadorSeleccionado.club}</span>
                            </div>
                            <div className="modal-info-block">
                                <span className="m-label">País</span>
                                <span className="m-value">{jugadorSeleccionado.pais}</span>
                            </div>
                            <div className="modal-info-block">
                                <span className="m-label">Edad</span>
                                <span className="m-value">{jugadorSeleccionado.edad} años</span>
                            </div>
                            <div className="modal-info-block">
                                <span className="m-label">Goles</span>
                                <span className="m-value">{jugadorSeleccionado.goles}</span>
                            </div>
                            <div className="modal-info-block">
                                <span className="m-label">Asistencias</span>
                                <span className="m-value">{jugadorSeleccionado.asistencias}</span>
                            </div>
                        </div>

                        <div className="modal-rating-section">
                            <span className="m-label">Rating</span>
                            <span className="m-rating-huge">{jugadorSeleccionado.rating}</span>
                        </div>

                        <div className="modal-footer">
                            <button className="btn-modal-cerrar" onClick={() => setJugadorSeleccionado(null)}>Cerrar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Buscador;