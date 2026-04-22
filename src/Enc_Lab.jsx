import { useState } from 'react'
import './App.css'

function FormularioEncuestaSalones({ tipo, usuario, regresar }) {
    // Estado para guardar las respuestas (1-5) y el comentario de texto
    const [respuestas, setRespuestas] = useState({});
    const [comentarios, setComentarios] = useState("");

    // Listado de preguntas sobre infraestructura del CECyT 5
    const preguntas = [
        "¿El salón cuenta con suficiente iluminación para las clases?",
        "¿Las butacas se encuentran en buen estado y son suficientes?",
        "¿El pizarrón está limpio y es funcional?",
        "¿La ventilación del salón es adecuada durante el día?",
        "¿El salón se encuentra limpio al momento de ingresar?",
        "¿El tamaño del salón es adecuado para el número de alumnos?",
        "¿Las ventanas abren y cierran correctamente?",
        "¿Existen suficientes contactos eléctricos para los alumnos?",
        "¿El salón cuenta con cortinas o persianas funcionales?",
        "¿Hay botes de basura suficientes en el aula?",
        "¿Las paredes y techos se encuentran en buen estado (sin humedad)?",
        "¿Se cuenta con proyector o pantalla funcional en el aula?",
        "¿El ruido exterior interfiere con el desarrollo de la clase?",
        "¿La señal de Wi-Fi llega con buena intensidad al salón?",
        "¿El escritorio y silla del docente están en buen estado?",
        "¿La puerta del salón cuenta con chapa o seguro funcional?",
        "¿Se realiza mantenimiento preventivo a las instalaciones del aula?",
        "¿Existe señalética de rutas de evacuación dentro del salón?",
        "¿Cómo calificarías la comodidad general del mobiliario?",
        "En general, ¿cómo calificarías el estado físico de tu salón de clases?"
    ];

    const manejarCambio = (preguntaIndex, valor) => {
        setRespuestas({ ...respuestas, [preguntaIndex]: parseInt(valor) });
    };

    const enviarEncuesta = async () => {
    const respondidas = Object.values(respuestas);
    
    // Validar que se respondieron las 20 preguntas
    if (respondidas.length < 20) {
        alert("Por favor, responde todas las preguntas del laboratorio.");
        return;
    }

    const sumaTotal = respondidas.reduce((a, b) => a + b, 0);
    const maximoPosible = 20 * 5; // 100 puntos
    const porcentajeSatisfaccion = ((sumaTotal / maximoPosible) * 100).toFixed(2);

    const datosFinales = {
        boleta: usuario.boleta,
        nombre: usuario.nombre,
        tipo: "Laboratorio", // <--- DEBE SER IGUAL AL DEL SERVER
        respuestas: respuestas,
        comentarios: comentarios,
        satisfaccion: parseFloat(porcentajeSatisfaccion) // Lo mandamos como número
    };

    try {
        const respuesta = await fetch('http://localhost:4500/api/encuestas/laboratorios/guardar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datosFinales)
        });

        const resultado = await respuesta.json();

        if (resultado.success) {
            alert(`¡Encuesta guardada con éxito! Satisfacción: ${porcentajeSatisfaccion}%`);
            regresar(); // Volver al menú
        } else {
            alert("El servidor recibió los datos pero no pudo guardarlos.");
        }
    } catch (error) {
        console.error("Error en el envío:", error);
        alert("No se pudo conectar con el servidor. Revisa que el server.js esté corriendo.");
    }
};

    return (
        <div className="lado-der" style={{ width: '100vw', minHeight: '100vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            
            {/* Cabecera con datos del usuario */}
            <div style={{ maxWidth: '800px', width: '90%', marginTop: '50px' }}>
                <button className="role-btn" onClick={regresar} style={{ color: 'black', borderColor: 'white', cursor: 'pointer' }}>⬅ Volver al Menú</button>
                <h1 className="titulo-serif-grande" style={{ fontSize: '3rem', marginTop: '20px' }}>Encuesta Laboratorios</h1>
                <div className="linea-dorada"></div>
                <p>Categoría: <strong>{tipo}</strong> | Alumno: <strong>{usuario.nombre}</strong></p>
            </div>

            {/* Contenedor Glassmorphism */}
            <div className="glass-card" style={{ position: 'relative', width: '90%', maxWidth: '800px', margin: '90px 0', padding: '40px', display: 'block', zIndex: 1 }}>
                
                {/* SOLUCIÓN AL CÍRCULO: pointerEvents: none para que no estorbe los clics */}
                <div className="dot-decor" style={{ pointerEvents: 'none', zIndex: 0 }}></div>

                {/* Capa de contenido arriba del diseño decorativo */}
                <div style={{ position: 'relative', zIndex: 10 }}>
                    {preguntas.map((p, index) => (
                        <div key={index} style={{ marginBottom: '30px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '15px' }}>
                            <p style={{ fontSize: '1.1rem', marginBottom: '15px', color: 'white' }}>{index + 1}. {p}</p>
                            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                                <span style={{ fontSize: '0.8rem', opacity: 0.7, color: 'white' }}>Pésimo</span>
                                {[1, 2, 3, 4, 5].map(num => (
                                    <label key={num} style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'white' }}>
                                        <input 
                                            type="radio" 
                                            name={`preg-salon-${index}`} 
                                            value={num} 
                                            onChange={(e) => manejarCambio(index, e.target.value)} 
                                            required 
                                            style={{ cursor: 'pointer' }}
                                        />
                                        {num}
                                    </label>
                                ))}
                                <span style={{ fontSize: '0.8rem', opacity: 0.7, color: 'white' }}>Excelente</span>
                            </div>
                        </div>
                    ))}

                    <p style={{ fontSize: '1.1rem', color: 'white', marginTop: '20px' }}>21. Reportes adicionales (opcional):</p>
                    <textarea 
                        style={{ width: '100%', minHeight: '100px', marginTop: '10px', borderRadius: '8px', color: 'black', padding: '10px', background: 'rgba(255,255,255,0.9)', border: 'none' }}
                        placeholder="Ej. La ventana del fondo no cierra, faltan butacas..."
                        value={comentarios}
                        onChange={(e) => setComentarios(e.target.value)}
                    />

                    <button className="btn-principal" onClick={enviarEncuesta} style={{ width: '100%', marginTop: '30px', backgroundColor: '#b38e5d', color: '#4a1030', fontWeight: 'bold' }}>
                        Enviar Evaluación de Salones
                    </button>
                </div>
            </div>
            
        </div>
    );
}

export default FormularioEncuestaSalones;