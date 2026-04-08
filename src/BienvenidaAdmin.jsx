import { useState } from 'react'
import "./Bienvenida.css";

/**
 * COMPONENTE BIENVENIDAADMIN
 * Qué hace: Renderiza la pantalla de bienvenida personalizada para administradores
 * Muestra un menú de navegación con opciones: Encuestas, Gráficas, Docentes, Noticias
 * Permite cerrar la sesión del usuario autenticado
 * 
 * Props:
 *   - Cerrar: función para cerrar la sesión del usuario
 *   - usuario: objeto con los datos del usuario autenticado (contiene: nombre, boleta, rol)
 * 
 * Retorna: JSX con la pantalla de bienvenida para Administradores
 */
function BienvenidaAdmin({ Cerrar, usuario}) {
    // Estado: Controla si se abre/cierra la sección de Encuestas
    const [Encuesta, setEncuesta] = useState(false)
    
    // Estado: Controla si se abre/cierra la sección de Gráficas
    const [Graficas, setGraficas] = useState(false)
    
    // Estado: Controla si se abre/cierra la sección de Docentes
    const [Docentes, setDocentes] = useState(false)
    
    // Estado: Controla si se abre/cierra la sección de Noticias
    const [Noticias, setNoticias] = useState(false)

    return (
        <div className="pantalla-bienvenida-admin">
            {/* MENÚ LATERAL IZQUIERDO */}
            <div className="lado-izk">
                {/* Botón: Abrir sección de Encuestas */}
                <button onClick={() => setEncuesta(true)}>Encuestas</button>
                
                {/* Botón: Abrir sección de Gráficas */}
                <button onClick={() => setGraficas(true)}>Graficas</button>
                
                {/* Botón: Abrir sección de Docentes */}
                <button onClick={() => setDocentes(true)}>Docentes</button>
                
                {/* Botón: Abrir sección de Noticias */}
                <button onClick={() => setNoticias(true)}>Noticias</button>
                
                {/* Botón: Cerrar sesión del usuario */}
                <button onClick={Cerrar}>Cerrar Sesion</button>
            </div>

            {/* CONTENIDO PRINCIPAL DERECHO */}
            <div className="lado-del">
                {/* Saludo personalizado con el nombre del usuario */}
                <h1> Bienvenid@ ({usuario?.nombre}) </h1>
            </div>
        </div>
    )
}

export default BienvenidaAdmin;
