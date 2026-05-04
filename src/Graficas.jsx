import { useState } from 'react'
import './App.css'
import GraficaBano from './Grafica_Bano.jsx' 
import GraficaDocentes from './Grafica_Docentes.jsx'
import GraficaSalones from './Grafica_Salones.jsx'
import GraficaLaboratorios from './Graficas_Laboratorios.jsx' 
//Este es el menu donde estan todos los botones para entrar a las graficas
function Graficas({ usuario, volver, irARespuestas }) {
    const [graficaActiva, setGraficaActiva] = useState(null);

    if (graficaActiva === "Baño") return <GraficaBano usuario={usuario} regresar={() => setGraficaActiva(null)} />;
    if (graficaActiva === "Salones") return <GraficaSalones usuario={usuario} regresar={() => setGraficaActiva(null)} />;
    if (graficaActiva === "Docentes") return <GraficaDocentes usuario={usuario} regresar={() => setGraficaActiva(null)} />;
    if (graficaActiva === "Laboratorios") return <GraficaLaboratorios usuario={usuario} regresar={() => setGraficaActiva(null)} />;

    return (
        <div className="pantalla-login">
            <div className="lado-izq">
                <p className="label-top">Visualización de Datos</p>
                <h1 className="titulo-serif">Estadísticas</h1>
                <div className="linea-dorada"></div>
                
                <div className="botones-menu" style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
           
                    <button className="btn-principal" onClick={() => setGraficaActiva("Baño")}>📊 Gráficas de Baños</button>
                    <button className="btn-principal" onClick={() => setGraficaActiva("Salones")}>📊 Gráficas de Salones</button>
                    <button className="btn-principal" onClick={() => setGraficaActiva("Docentes")}>📊 Gráficas de Docentes</button>
                    <button className="btn-principal" onClick={() => setGraficaActiva("Laboratorios")}>📊 Gráficas de Laboratorios</button>
                    
                    {usuario?.rol === "Administrador" && (
                        <button className="btn-principal" onClick={irARespuestas}>📋 Gestionar Encuestas</button>
                    )}

                    <button className="role-btn" onClick={volver} style={{ marginTop: '20px' }}>⬅ Regresar al Panel</button>
                </div>
            </div>

            <div className="lado-der">
                <div className="contenido-derecha">
                    <h1 className="titulo-serif-grande">Análisis de <br /> Resultados</h1>
                    <p className="descripcion">Consulta los porcentajes de satisfacción obtenidos a través de las evaluaciones del plantel.</p>
                </div>
            </div>
        </div>
    );
}

export default Graficas;