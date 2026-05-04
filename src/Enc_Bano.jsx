import { useState } from 'react'
import './App.css'

function FormularioEncuestaBano({ usuario, regresar }) {
    const tipo = "Encuesta Baño";
    const [respuestas, setRespuestas] = useState({});
    const [comentarios, setComentarios] = useState("");
     // no hay mucha logica aqui, si quieres cambiar o agregar preguntas agregalas desde aqui el demas codigo es lo mismo
    const preguntas = [
        "¿Qué tan limpio consideras que está el piso del baño?",
        "¿Hay suficiente papel higiénico disponible?",
        "¿Funcionan correctamente las llaves de agua de los lavabos?",
        "¿El jabón de manos está disponible siempre?",
        "¿Qué tan funcional es el sistema de descarga de los inodoros?",
        "¿La iluminación dentro del baño es adecuada?",
        "¿Hay botes de basura suficientes y con espacio?",
        "¿Qué tan funcional es el seguro de las puertas de los cubículos?",
        "¿Se perciben olores desagradables con frecuencia?",
        "¿Funcionan los secadores de manos o hay toallas de papel?",
        "¿El espejo se encuentra limpio y en buen estado?",
        "¿Qué tan rápida es la reparación cuando reportas una fuga?",
        "¿Hay ganchos para colgar mochilas en las puertas?",
        "¿Consideras que el espacio es suficiente para la demanda de alumnos?",
        "¿Hay señalética clara (Hombres/Mujeres/Discapacitados)?",
        "¿Qué tan accesible es el baño para personas con discapacidad?",
        "¿Se nota que el personal de limpieza pasa frecuentemente?",
        "¿Hay divisiones (mingitorios) con suficiente privacidad?",
        "¿La ventilación natural o artificial es eficiente?",
        "¿Cómo calificarías la satisfacción general con este servicio?"
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
            alert("Por favor, responde todas las preguntas antes de enviar.");
            return;
        }

        const sumaTotal = respondidas.reduce((a, b) => a + b, 0);
        const maximoPosible = preguntas.length * 5;
        const porcentajeSatisfaccion = ((sumaTotal / maximoPosible) * 100).toFixed(2);

        const datosFinales = {
            boleta: usuario.boleta,
            nombre: usuario.nombre,
            tipo: tipo,
            respuestas: respuestas,
            comentarios: comentarios,
            satisfaccion: parseFloat(porcentajeSatisfaccion)
        };
        //Esto manda los resultados a la base de datos
        try {
            const respuesta = await fetch('http://localhost:4500/api/encuestas/guardar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datosFinales)
            });

            const resultado = await respuesta.json();

            if (resultado.success) {
                alert(`¡Gracias ${usuario.nombre}! Datos guardados. Satisfacción: ${porcentajeSatisfaccion}%`);
                regresar();
            } else {
                alert("Error al guardar: " + resultado.message);
            }
        } catch (error) {
            console.error("Error en la conexión:", error);
            alert("No se pudo conectar con el servidor para guardar la encuesta.");
        }
    };

    return (
        <div className="lado-der" style={{ width: '100vw', minHeight: '100vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            
            
            <div style={{ maxWidth: '800px', width: '90%', marginTop: '50px' }}>
                <button className="role-btn" onClick={regresar} style={{ color: 'black', borderColor: 'white', cursor: 'pointer' }}>⬅ Volver al Menú</button>
                <h1 className="titulo-serif-grande" style={{ fontSize: '3rem', marginTop: '20px' }}>{tipo}</h1>
                <div className="linea-dorada"></div>
                <p><strong>Estudiante:</strong> {usuario.nombre} | <strong>Boleta:</strong> {usuario.boleta}</p>
            </div>

            
            <div className="glass-card" style={{ 
                position: 'relative', 
                width: '90%', 
                maxWidth: '800px', 
                margin: '90px 0', 
                padding: '40px', 
                display: 'block',
                zIndex: 1 
            }}>
                
                
                <div className="dot-decor" style={{ pointerEvents: 'none', zIndex: 0 }}></div>

                <div style={{ position: 'relative', zIndex: 10 }}>
                    {preguntas.map((p, index) => (
                        <div key={index} style={{ marginBottom: '30px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '15px' }}>
                            <p style={{ fontSize: '1.1rem', marginBottom: '15px', color: 'white' }}>{index + 1}. {p}</p>
                            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                                <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>Muy Mal</span>
                                {[1, 2, 3, 4, 5].map(num => (
                                    <label key={num} style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'white' }}>
                                        <input 
                                            type="radio" 
                                            name={`preg-${index}`} 
                                            value={num} 
                                            onChange={(e) => manejarCambio(index, e.target.value)}
                                            required
                                            style={{ cursor: 'pointer' }}
                                        />
                                        {num}
                                    </label>
                                ))}
                                <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>Excelente</span>
                            </div>
                        </div>
                    ))}

                    <div style={{ marginTop: '20px' }}>
                        <p style={{ fontSize: '1.1rem', color: 'white' }}>21. ¿Algún comentario adicional?</p>
                        <textarea 
                            style={{ 
                                width: '100%', 
                                minHeight: '100px', 
                                marginTop: '10px', 
                                borderRadius: '8px', 
                                color: 'black',
                                padding: '10px', 
                                background: 'rgba(255,255,255,0.9)',
                                border: 'none'
                            }}
                            placeholder="Escribe aquí tus observaciones..."
                            value={comentarios}
                            onChange={(e) => setComentarios(e.target.value)}
                        />
                    </div>

                    <button className="btn-principal" onClick={enviarEncuesta} style={{ width: '100%', marginTop: '30px', backgroundColor: '#b38e5d', fontWeight: 'bold' }}>
                        Enviar Evaluación Baño
                    </button>
                </div>
            </div>
        </div>
    );
}

export default FormularioEncuestaBano;