import './App.css' // Uso el css de App que es  el diseño global y lo que tiene los temas
// importamos las funciones para ir a otras pestañas
function BienvenidaAdmin({ cerrar, usuario, irAEncuestas, irAGraficas, irADocentes, irANoticias, irAUsuarios }) {
    return (
        <div className="pantalla-login"> {/* tema de la pantalla izquierda*/}
            
            {/* esto es el lado izquierdo con los botones */}
            <div className="lado-izq">
                <p className="label-top">Panel Admin</p>
                <h1 className="titulo-serif">Bienvenido, {usuario?.nombre}!</h1> {/* toma del usuario su nombre*/}
                <div className="linea-dorada"></div>
                
                <p className="subtitulo">Selecciona una opcion</p>
                {/* Los botones para las acciones */}
                <div className="botones-menu" style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
                    <button className="btn-principal" onClick={irAEncuestas}>📝 Encuestas</button>
                    <button className="btn-principal" onClick={irAGraficas}>📊 Gráficas</button>
                    <button className="btn-principal" onClick={irADocentes}>👨‍🏫 Docentes</button>
                    <button className="btn-principal" onClick={irAUsuarios}>👥 Usuarios</button>
                    <button className="btn-principal" onClick={irANoticias}>📰 Noticias</button>
                    
                    {/* Este es el boton para cerrar la sesion*/}
                    <button className="role-btn" onClick={cerrar} style={{ marginTop: '20px', borderColor: '#b38e5d', color: '#6C1D45' }}>
                        Cerrar Sesión
                    </button>
                </div>
            </div>

            {/* Lado derech con la foto qe querias */}
            <div className="lado-der">
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

           
        </div>
    )
}

export default BienvenidaAdmin;