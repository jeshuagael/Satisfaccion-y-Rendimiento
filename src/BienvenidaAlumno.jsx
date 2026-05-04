import './App.css' // Importante: Usar el CSS global para heredar el diseño

function BienvenidaAlumno({ cerrar, usuario, irAEncuestas, irAGraficas, irADocentes, irANoticias }) {
    return (
        <div className="pantalla-login">
            

            <div className="lado-izq">
                <p className="label-top">Panel del Estudiante</p>
                <h1 className="titulo-serif">Bienvenido, {usuario?.nombre}!</h1>
                <div className="linea-dorada"></div>
                
                <p className="subtitulo">Selecciona una opción para continuar con tu seguimiento académico.</p>

                <div className="botones-menu" style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
                    <button className="btn-principal" onClick={irAEncuestas}>📝 Encuestas</button>
                    <button className="btn-principal" onClick={irAGraficas}>📊 Gráficas</button>
                    <button className="btn-principal" onClick={irADocentes}>👨‍🏫 Docentes</button>
                    <button className="btn-principal" onClick={irANoticias}>📰 Noticias</button>
                    
                    <button className="role-btn" onClick={cerrar} style={{ marginTop: '20px', borderColor: '#b38e5d', color: '#6C1D45' }}>
                        Cerrar Sesión
                    </button>
                </div>
            </div>
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

export default BienvenidaAlumno;