import { useState } from 'react'
import './App.css'

function FormularioEncuestaDoc({ usuario, regresar }) {
    const [respuestas, setRespuestas] = useState({});
    const [comentarios, setComentarios] = useState("");

    const preguntas = [
        "¿Qué tan satisfecho estás con la claridad de las explicaciones de tus docentes?",
        "¿Los docentes muestran dominio sobre los temas que imparten?",
        "¿Consideras que el método de enseñanza de tus profesores es efectivo?",
        "¿Recibes retroalimentación clara sobre tus tareas y exámenes?",
        "¿Los docentes fomentan la participación activa en clase?",
        "¿Existe respeto mutuo entre docentes y alumnos en el aula?",
        "¿Qué tan puntuales son tus profesores para iniciar la clase?",
        "¿Los docentes cumplen con el programa de estudios oficial?",
        "¿Se resuelven tus dudas de manera satisfactoria durante la sesión?",
        "¿La relación entre teoría y práctica es la adecuada?",
        "¿Qué tan accesible es el material didáctico que proporcionan?",
        "¿Consideras justa la forma de evaluación de tus profesores?",
        "¿Los docentes utilizan herramientas tecnológicas para las clases?",
        "¿Qué tan motivado te sientes por tus profesores para seguir aprendiendo?",
        "¿Sientes que los docentes están actualizados en su área profesional?",
        "¿El ambiente en el salón de clases es propicio para el aprendizaje?",
        "¿Tus profesores están disponibles para asesorías fuera de clase?",
        "¿Consideras que la carga de trabajo (tareas) es equilibrada?",
        "¿Qué tan satisfecho estás con la organización general de tus materias?",
        "En general, ¿cómo calificarías el desempeño de tu plantilla docente?"
    ];

    const manejarCambio = (preguntaIndex, valor) => {
        setRespuestas({
            ...respuestas,
            [preguntaIndex]: parseInt(valor)
        });
    };

    const enviarEncuesta = async () => {
        const respondidas = Object.values(respuestas);
        if (respondidas.length < preguntas.length) {
            alert("Por favor, responde todas las preguntas para calcular el porcentaje.");
            return;
        }

        const sumaTotal = respondidas.reduce((a, b) => a + b, 0);
        const maximoPosible = preguntas.length * 5;
        const porcentajeSatisfaccion = ((sumaTotal / maximoPosible) * 100).toFixed(2);

        const datosFinales = {
            boleta: usuario.boleta,
            nombre: usuario.nombre,
            tipo: "Docente",
            respuestas: respuestas,
            comentarios: comentarios,
            satisfaccion: parseFloat(porcentajeSatisfaccion)
        };

        try {
            // Enviamos a la ruta de docentes que configuramos en el server
            const respuesta = await fetch('http://localhost:4500/api/encuestas/docentes/guardar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datosFinales)
            });

            const resultado = await respuesta.json();

            if (resultado.success) {
                alert(`¡Gracias ${usuario.nombre}! Evaluación guardada. Satisfacción: ${porcentajeSatisfaccion}%`);
                regresar();
            } else {
                alert("Error al guardar en el servidor.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("No se pudo conectar con el servidor.");
        }
    };

    return (
        <div className="lado-der" style={{ width: '100vw', minHeight: '100vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            
            {/* Cabecera */}
            <div style={{ maxWidth: '800px', width: '90%', marginTop: '50px' }}>
                <button className="role-btn" onClick={regresar} style={{ color: 'black', borderColor: 'white', cursor: 'pointer' }}>⬅ Volver al Menú</button>
                <h1 className="titulo-serif-grande" style={{ fontSize: '3rem', marginTop: '20px' }}>Encuesta Docente</h1>
                <div className="linea-dorada"></div>
                <p><strong>Estudiante:</strong> {usuario.nombre} | <strong>Rol:</strong> {usuario.rol}</p>
            </div>

            {/* Contenedor con solución al círculo estorboso */}
            <div className="glass-card" style={{ 
                position: 'relative', 
                width: '90%', 
                maxWidth: '800px', 
                margin: '90px 0', 
                padding: '40px', 
                display: 'block',
                zIndex: 1
            }}>
                
                {/* El círculo decorativo ahora no bloquea los clics */}
                <div className="dot-decor" style={{ pointerEvents: 'none', zIndex: 0 }}></div>

                {/* Preguntas en una capa superior */}
                <div style={{ position: 'relative', zIndex: 10 }}>
                    {preguntas.map((p, index) => (
                        <div key={index} style={{ marginBottom: '30px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '15px' }}>
                            <p style={{ fontSize: '1.1rem', marginBottom: '15px', color: 'white' }}>{index + 1}. {p}</p>
                            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                                <span style={{ fontSize: '0.8rem', opacity: 0.7, color: 'white' }}>Insatisfecho</span>
                                {[1, 2, 3, 4, 5].map(num => (
                                    <label key={num} style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'white' }}>
                                        <input 
                                            type="radio" 
                                            name={`preg-doc-${index}`} 
                                            value={num} 
                                            onChange={(e) => manejarCambio(index, e.target.value)}
                                            required
                                            style={{ cursor: 'pointer' }}
                                        />
                                        {num}
                                    </label>
                                ))}
                                <span style={{ fontSize: '0.8rem', opacity: 0.7, color: 'white' }}>Muy Satisfecho</span>
                            </div>
                        </div>
                    ))}

                    <div style={{ marginTop: '20px' }}>
                        <p style={{ fontSize: '1.1rem', color: 'white' }}>21. ¿Alguna sugerencia académica?</p>
                        <textarea 
                            style={{ 
                                width: '100%', 
                                minHeight: '100px', 
                                marginTop: '10px', 
                                borderRadius: '8px', 
                                padding: '10px', 
                                color: 'black',
                                background: 'rgba(255,255,255,0.9)', 
                                border: 'none' 
                            }}
                            placeholder="Escribe aquí tus comentarios sobre la enseñanza..."
                            value={comentarios}
                            onChange={(e) => setComentarios(e.target.value)}
                        />
                    </div>

                    <button className="btn-principal" onClick={enviarEncuesta} style={{ width: '100%', marginTop: '30px', backgroundColor: '#b38e5d', fontWeight: 'bold' }}>
                        Enviar Evaluación Docente
                    </button>
                </div>
            </div>
           
        </div>
    );
}

export default FormularioEncuestaDoc;