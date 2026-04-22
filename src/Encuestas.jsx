import { useState } from 'react'
import './App.css'

// PASO 1: Importar correctamente asignando un nombre al componente
import FormularioBano from './Enc_Bano.jsx' 
import FormularioDoc from './Enc_Doc.jsx'
import FormularioLab from './Enc_Lab.jsx'
import FormularioSalones from './Enc_Salones.jsx'

function Encuestas({ usuario, volver }) {
    const [encuestaActiva, setEncuestaActiva] = useState(null);

    // PASO 2: Lógica para mostrar el archivo correspondiente según el botón pulsado
    if (encuestaActiva === "Baño") return <FormularioBano usuario={usuario} regresar={() => setEncuestaActiva(null)} />;
    if (encuestaActiva === "Salones") return <FormularioSalones usuario={usuario} regresar={() => setEncuestaActiva(null)} />;
    if (encuestaActiva === "Docentes") return <FormularioDoc usuario={usuario} regresar={() => setEncuestaActiva(null)} />;
    if (encuestaActiva === "Laboratorios") return <FormularioLab usuario={usuario} regresar={() => setEncuestaActiva(null)} />;

    return (
        <div className="pantalla-login">
            <div className="lado-izq">
                <p className="label-top">Cuestionarios</p>
                <h1 className="titulo-serif">Evaluación</h1>
                <div className="linea-dorada"></div>
                
                <div className="botones-menu" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <button className="btn-principal" onClick={() => setEncuestaActiva("Baño")}>🧻 Encuesta de Baños</button>
                    <button className="btn-principal" onClick={() => setEncuestaActiva("Salones")}>🏫 Encuesta de Salones</button>
                    <button className="btn-principal" onClick={() => setEncuestaActiva("Docentes")}>👨‍🏫 Encuesta de Docentes</button>
                    <button className="btn-principal" onClick={() => setEncuestaActiva("Laboratorios")}>🧪 Encuesta de Laboratorios</button>
                    
                    <button className="role-btn" onClick={volver} style={{ marginTop: '20px' }}>⬅ Regresar al Panel</button>
                </div>
            </div>

            <div className="lado-der">
                <div className="contenido-derecha">
                </div>
            </div>
        </div>
    );
}

export default Encuestas;