import { useState } from 'react'
import data from './BDD.json'
import Bienvenida from './Bienvenida.jsx'
import './App.css'
import BienvenidaAlumno from './BienvenidaAlumno.jsx'
import BienvenidaDocente from './BienvenidaDocente.jsx'
import BienvenidaAdmin from './BienvenidaAdmin.jsx'

/**
 * COMPONENTE APP
 * Qué hace: Renderiza la pantalla principal de login y gestiona la autenticación de usuarios
 * Renderiza diferentes vistas según el rol del usuario (Alumno, Docente, Admin)
 * Controla el estado de login, las credenciales y el rol seleccionado
 * 
 * Props: Ninguno (es el componente raíz)
 * Retorna: JSX con la pantalla de login o las pantallas de bienvenida según el estado
 */
function App() {
  // Estado: Almacena los datos del usuario autenticado (null si no hay sesión iniciada)
  const [usuarioLogueado, setUsuarioLogueado] = useState(null)
  
  // Estado: Almacena el input del usuario ingresado en el campo de boleta
  const [usuarioInput, setUsuarioInput] = useState("")
  
  // Estado: Almacena el input de la contraseña ingresada
  const [passsInput, setPassInput] = useState("")
  
  // Estado: Almacena el rol seleccionado ("Alumno", "Docente" o "Administrador")
  const [rolSeleccionado, setRolSeleccionado] = useState("Alumno")

  /**
   * FUNCIÓN: manejarLogin
   * Qué hace: Valida las credenciales del usuario contra la base de datos
   * Busca en la BDD un usuario que coincida con boleta, contraseña y rol
   * Si encuentra coincidencia, autentica al usuario; si no, muestra un error
   * 
   * Recibe: Nada (utiliza los estados: usuarioInput, passsInput, rolSeleccionado)
   * Retorna: Nada (actualiza el estado usuarioLogueado o muestra una alerta)
   */
  const manejarLogin = () => {
    const encontrado = data.usuarios.find(user =>
      user.boleta === usuarioInput &&
      user.password === passsInput &&
      user.rol === rolSeleccionado
    )
    if (encontrado) {
      setUsuarioLogueado(encontrado)
    } else {
      alert(`credenciales incorrectas para el rol de ${rolSeleccionado}`);
    }
  };

  /**
   * FUNCIÓN: seleccionarRol
   * Qué hace: Actualiza el rol seleccionado y registra la selección en consola
   * Permite al usuario cambiar entre roles (Alumno, Docente, Administrador)
   * 
   * Recibe: rol (string) - El rol a seleccionar
   * Retorna: Nada (actualiza el estado rolSeleccionado)
   */
  const seleccionarRol = (rol) => {
    setRolSeleccionado(rol)
    console.log('Rol Seleccionado:', rol)
  }

  /**
   * RENDERIZADO PRINCIPAL
   * Qué hace: Renderiza la UI basada en el estado de autenticación
   * Si el usuario está autenticado: muestra la pantalla de bienvenida según su rol
   * Si no está autenticado: muestra la pantalla de login con formulario
   * 
   * Retorna: JSX con la pantalla de login o bienvenida
   */
  return ( 
    <> 
      {usuarioLogueado ? ( 
        // SI EL USUARIO ESTÁ AUTENTICADO: mostrar pantalla de bienvenida según su rol
        usuarioLogueado.rol === "Alumno" ? (
          <BienvenidaAlumno usuario={usuarioLogueado} cerrar ={() => setUsuarioLogueado(null)} />
        ) : usuarioLogueado.rol === "Docente" ? (
          <BienvenidaDocente usuario={usuarioLogueado} cerrar ={() => setUsuarioLogueado(null)} />
        ) : (
          <BienvenidaAdmin usuario={usuarioLogueado} cerrar ={() => setUsuarioLogueado(null)} />
        )
      ) : ( 
        // SI NO HAY SESIÓN INICIADA: mostrar pantalla de login
        <div className="pantalla-login" >
          <div className="lado-izq"> 
            <p className="label-top">Acceso al sistema </p>
            <h1>Inicio de Sesión</h1> 
            <div className="linea-dorada"></div>
            <p className="subtitulo">Ingresa tus credenciales institucionales para continuar </p>
            <div className="Selector de roles"></div>
            <p>Ingresar Como</p>
            
            {/* BOTONES DE SELECCIÓN DE ROL */}
            <div className="botones-roles">
              {/* Botón: Seleccionar rol Alumno */}
              <button 
                className={`role-btn ${rolSeleccionado === "Alumno" ? "active" : ""}`}
                onClick={() => seleccionarRol("Alumno")}
              >👨‍🎓 Alumno</button>
              
              {/* Botón: Seleccionar rol Docente */}
              <button 
                className={`role-btn ${rolSeleccionado === "Docente" ? "active" : ""}`}
                onClick={() => seleccionarRol("Docente")}
              > 🎓 Docente</button>
              
              {/* Botón: Seleccionar rol Administrador */}
              <button 
                className={`role-btn ${rolSeleccionado === "Administrador" ? "active" : ""}`}
                onClick={() => seleccionarRol("Administrador")}
              > 🔧 Administrador</button>
            </div>
            
            {/* FORMULARIO DE LOGIN */}
            {/* Input: Campo de usuario (boleta) */}
            <div className="input-group">
              <label>Usuario</label>
              <input type="text" placeholder="Ej. 123456789" value={usuarioInput} onChange={(e) => setUsuarioInput(e.target.value)} />
            </div>
            
            {/* Input: Campo de contraseña */}
            <div className="input-group">
              <label>Contraseña</label>
              <input type="password" placeholder="********" value={passsInput} onChange={(e) => setPassInput(e.target.value)} />
            </div>
            
            {/* Enlace: Recuperar contraseña (no funcional) */}
            <a href="#" className="olvido-pass">¿Olvidaste tu contraseña?</a> 
            
            {/* Botón: Enviar formulario de login */}
            <button className="btn-principal" onClick={manejarLogin}>Iniciar Sesión</button> 
          </div>
          
          {/* LADO DERECHO: PANEL DECORATIVO CON INFORMACIÓN */}
          <div className="lado-der"> 
            {/* Icono del menú */}
            <div className="menu-icon">
              <span></span>
              <span></span>
              <span></span>
            </div>
            
            {/* Contenido decorativo e información del sistema */}
            <div className="contenido-derecha">
              <h1 className="titulo-serif-grande">Rendimiento <br /> y Satisfacción</h1>
              <p className="descripcion">Sistema de Evaluación para el Seguimiento del Desempeño Académico y la Satisfacción Estudiantil</p>
            </div>
           
            {/* Tarjeta de información de la institución */}
            <div className="glass-card">
              <div className="dot-decor"></div>
              <p>Centro de Estudios Cientificos y Tecnologicos N.º 5</p>
              <p><strong>"Benito Juarez" - IPN</strong></p>
             </div>
          </div>
        </div>
      )}
      
      {/* ETIQUETA DE VERSIÓN */}
      <div className="VersionTag">v1.3.4</div>
    </>
  )

}

export default App;
