import { useState } from 'react'
import './App.css' // Importante: Usar el CSS global para heredar el diseño

function BienvenidaDocente({ cerrar, usuario, irAEncuestas, irAGraficas }) {
    const [Docentes, setDocentes] = useState(false)
    const [Noticias, setNoticias] = useState(false)

    return (
        <div className="pantalla-login"> {/* Esta clase activa el Flexbox del login */}
            
            {/* LADO IZQUIERDO: Panel de botones */}
            <div className="lado-izq">
                <p className="label-top">Panel Docente</p>
                <h1 className="titulo-serif">Bienvenido, {usuario?.nombre}!</h1>
                <div className="linea-dorada"></div>
                
                <p className="subtitulo">Selecciona una opción</p>

                <div className="botones-menu" style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
                    <button className="btn-principal" onClick={irAEncuestas}>📝 Encuestas</button>
                    <button className="btn-principal" onClick={irAGraficas}>📊 Gráficas</button>
                    <button className="btn-principal" onClick={() => setDocentes(true)}>👨‍🏫 Docentes</button>
                    <button className="btn-principal" onClick={() => setNoticias(true)}>📰 Noticias</button>
                    
                    {/* Botón de cerrar sesión con estilo diferente */}
                    <button className="role-btn" onClick={cerrar} style={{ marginTop: '20px', borderColor: '#b38e5d', color: '#6C1D45' }}>
                        Cerrar Sesión
                    </button>
                </div>
            </div>

            {/* LADO DERECHO: El fondo guinda institucional */}
            <div className="lado-der">
                <div className="menu-icon">
                    <span></span><span></span><span></span>
                </div>
                
                <div className="contenido-derecha">
                    <h1 className="titulo-serif-grande">Bienvenid@ <br /> al Panel</h1>
                    <p className="descripcion">Sistema de Evaluación para el Seguimiento del Desempeño Académico del CECyT 5.</p>
                </div>

                <div className="glass-card">
                    <div className="dot-decor"></div>
                    <div className="textos-card">
                        <p>Usuario: <strong>{usuario?.nombre}</strong></p>
                        <p>ID: {usuario?.boleta}</p>
                    </div>
                </div>
            </div>

            <div className="VersionTag">v1.4.1</div>
        </div>
    )
}

export default BienvenidaDocente;