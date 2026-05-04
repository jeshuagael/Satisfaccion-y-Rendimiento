import React, { useState, useContext } from 'react' //importamos el useState para el manejo de estados en el componente //creamos una Base de Datos Local para los usuarios
import Bienvenida from './Bienvenida.jsx'
import './App.css' //importamos el diseño
import BienvenidaAlumno from './BienvenidaAlumno.jsx' // importamos las pantallas de bienvenida para cada rol
import BienvenidaDocente from './BienvenidaDocente.jsx'
import BienvenidaAdmin from './BienvenidaAdmin.jsx'
import Encuestas from './Encuestas.jsx'
import Graficas from './Graficas.jsx'
import NoticiasAdmin from './NoticiasAdmin.jsx'
import NoticiasUser from './NoticiasUser.jsx'
import DocentesAdmin from './DocentesAdmin.jsx'
import DocentesUser from './DocentesUser.jsx'
import UsuariosAdmin from './UsuariosAdmin.jsx'
import Registro from './Registro.jsx'
import RespuestasAdmin from './RespuestasAdmin.jsx'
import { ThemeContext } from './Tema.jsx'
 // Contexto global de tema para alternar entre claro y oscuro
function App() {
  // almacena los datos del usuario autenticado (null si no hay sesión iniciada)
  const [usuarioLogueado, setUsuarioLogueado] = useState(() => {
    const guardado = localStorage.getItem('sesionUsuario');
    return guardado ? JSON.parse(guardado) : null;
  });
  // almacena el input del usuario ingresado en el campo de boleta
  const [usuarioInput, setUsuarioInput] = useState("")
  const [vistaActual, setVistaActual] = useState("inicio");
  
  // almacena el input de la contraseña ingresada
  const [passsInput, setPassInput] = useState("")
  
  // almacena el rol seleccionado ("Alumno", "Docente" o "Administrador")
  const [rolSeleccionado, setRolSeleccionado] = useState("Alumno")
  /* manejarLogin es una funcion que valida las credenciales del usuario con la BDD
  busca en la BDD si algun usuario coincide  y si encuentra coinicidencia te manda a la pantalla, si no esta muestra error*/
  
  const manejarLogin = async () => {
    try { {/*esto es el manejo de errores pero cambie el metodo de manejarLogin para conectarlo al server jaja*/}
      const respuesta = await fetch('http://localhost:4500/api/login', { /* esto es la configuracion del servidor, aqui el metodo agarra los inputs y los manda
        directo al servidor para validar los datos*/
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          boleta: usuarioInput,
          password: passsInput,
          rol: rolSeleccionado
        })
      });
      {/*aqui ya se reciben los datos por parte del servidor */}
      const datos = await respuesta.json();
      {/*si los datos  que se recibieron son verdaderos ps ya envia a la otra pantalla */}
      if (datos.success) {
        localStorage.setItem('sesionUsuario', JSON.stringify(datos.usuario));
        setUsuarioLogueado(datos.usuario);
      } else { /* si no son verdaderos mandan el mensaje de error*/
        alert(datos.message);
      }
    } catch (error) { /* en caso de tener el error pues lo agarra para que no se vaya todo a la fregada y mannda error de server */
      console.error("Error en la conexion luego lo arreglo: ", error);
      alert("No se pudo conectar al server");
    }
  };
  /* la funcion seleccionarRol hace que el usuario cambie de roles 
  y registra la seleccion en la consola la debug console
  recibe el rol y no  retorna nada nadamas actualiza el rol*/
  const seleccionarRol = (rol) => {
    setRolSeleccionado(rol)
    console.log('Rol Seleccionado:', rol)
  }
  /* la funcion de cerrarSesion quita al usuario de la pestaña para cuando quiera darle en regresar no pueda hacer nada que se cierre su sesion completamente*/
  const cerrarSesion = () => {
    localStorage.removeItem('sesionUsuario');
    setUsuarioLogueado(null);
    setVistaActual("inicio");
  };

  // aqui hice el tema claro u oscuro esto es global para todas las pantallas
  const { EsOscuro, toggleTheme } = useContext(ThemeContext);
  // aqui tenemos unos booleanos para mandar a una pantalla dependiendo del rol
  return ( 
    <>  {/* Este es el boton de los modos si oscuro o claro, saque los emiojis de PiliApp xdd busca la pagina*/}
      <button className="theme-toggle" onClick={toggleTheme} aria-label="Cambiar tema">
        {EsOscuro ? '🌙' : '☀️'}
        <span className="theme-toggle-text">{EsOscuro ? 'Oscuro' : 'Claro'}</span>
      </button>
      {usuarioLogueado ? ( 
        /* la navegacion de las pantallas  */
        vistaActual === "encuestas" ? (
          <Encuestas 
            usuario={usuarioLogueado} 
            volver={() => setVistaActual("inicio")} 
            cerrar={cerrarSesion} 
          />
        ) : vistaActual === "graficas" ? (
          <Graficas 
            usuario={usuarioLogueado} 
            volver={() => setVistaActual("inicio")} 
            cerrar={cerrarSesion} 
            irARespuestas={() => setVistaActual("respuestasAdmin")}
          />
        ) : vistaActual === "noticiasAdmin" ? (
          <NoticiasAdmin
            usuario={usuarioLogueado}
            volver={() => setVistaActual("inicio")}
            cerrar={cerrarSesion}
          />
        ) : vistaActual === "noticiasUser" ? (
          <NoticiasUser
            usuario={usuarioLogueado}
            volver={() => setVistaActual("inicio")}
            cerrar={cerrarSesion}
          />
        ) : vistaActual === "docentesAdmin" ? (
          <DocentesAdmin
            usuario={usuarioLogueado}
            volver={() => setVistaActual("inicio")}
            cerrar={cerrarSesion}
          />
        ) : vistaActual === "usuariosAdmin" ? (
          <UsuariosAdmin
            usuario={usuarioLogueado}
            volver={() => setVistaActual("inicio")}
            cerrar={cerrarSesion}
          />
        ) : vistaActual === "respuestasAdmin" ? (
          <RespuestasAdmin
            usuario={usuarioLogueado}
            volver={() => setVistaActual("inicio")}
            cerrar={cerrarSesion}
          />
        ) : vistaActual === "docentesUser" ? (
          <DocentesUser
            usuario={usuarioLogueado}
            volver={() => setVistaActual("inicio")}
            cerrar={cerrarSesion}
          />
        ) : (
          /* Menu segun el rol */
          usuarioLogueado.rol === "Alumno" ? (
            <BienvenidaAlumno 
              usuario={usuarioLogueado} 
              cerrar={cerrarSesion} 
              irAEncuestas={() => setVistaActual("encuestas")}
              irAGraficas={() => setVistaActual("graficas")}
              irADocentes={() => setVistaActual("docentesUser")}
              irANoticias={() => setVistaActual("noticiasUser")}
            />
          ) : usuarioLogueado.rol === "Docente" ? (
            <BienvenidaDocente
              usuario={usuarioLogueado} 
              cerrar={cerrarSesion} 
              irAEncuestas={() => setVistaActual("encuestas")}
              irAGraficas={() => setVistaActual("graficas")} 
              irANoticias={() => setVistaActual("noticiasUser")}
              irADocentes={() => setVistaActual("docentesUser")}
            />
          ) : (
            <BienvenidaAdmin 
              usuario={usuarioLogueado} 
              cerrar={cerrarSesion} 
              irAEncuestas={() => setVistaActual("encuestas")}
              irAGraficas={() => setVistaActual("graficas")} 
              irANoticias={() => setVistaActual("noticiasAdmin")}
              irADocentes={() => setVistaActual("docentesAdmin")}
              irAUsuarios={() => setVistaActual("usuariosAdmin")}
            />
          )
        )
          ) :  vistaActual === 'Registro' ? (
            <Registro volver={() => setVistaActual("inicio")} />
          ) : (
        // si no hay una sesion iniciada entonces se muestra la pantalla de login
        <div className="pantalla-login" >
          <div className="lado-izq"> 
            <p className="label-top"> Proyecto </p>
            <h1>Inicio de Sesión</h1> 
            <div className="linea-dorada"></div>
            <p className="subtitulo">Ingresa tus credenciales institucionales para continuar </p>
            <div className="Selector de roles"></div>
            <p>Ingresar Como: </p>
            
            {/* aqui empiezan los botones de seleccion de rol */}
            <div className="botones-roles">
              {/*aqui se seleccionan los roles como el de alumno*/}
              <button 
                className={`role-btn ${rolSeleccionado === "Alumno" ? "active" : ""}`}
                onClick={() => seleccionarRol("Alumno")}
              >👨‍🎓 Alumno</button>
              
              {/* aqui se selecciona el rol de docente */}
              <button 
                className={`role-btn ${rolSeleccionado === "Docente" ? "active" : ""}`}
                onClick={() => seleccionarRol("Docente")}
              > 🎓 Docente</button>
              
              {/* aqui se selecciona el rol de admin */}
              <button 
                className={`role-btn ${rolSeleccionado === "Administrador" ? "active" : ""}`}
                onClick={() => seleccionarRol("Administrador")}
              > 🔧 Administrador</button>
            </div>
            
            {/* lo del formulario del login, lo que me pediste*/}
            {/* aqui esta el input del usuario, aqui es donde se registra el numero de usuario el nombre o lo q quieras w*/}
            <div className="input-group">
              <label>Usuario</label>
              <input type="text" placeholder="Ej. 123456789" value={usuarioInput} onChange={(e) => setUsuarioInput(e.target.value)} />
            </div>
            
            {/* contraseña, aqui igual se implementa todo este show del pasguord*/}
            <div className="input-group">
              <label>Contraseña</label>
              <input type="password" placeholder="********" value={passsInput} onChange={(e) => setPassInput(e.target.value)} />
            </div>
            
            <button className="btn-principal" onClick={manejarLogin}>Iniciar Sesión</button> 
            { /* El link para Registrarse*/}
            <a href="#" className="registro-pass" onClick={() => setVistaActual('Registro')}>Registrate</a>
          </div>
          
          <div className="lado-der"> 
            {/* aqui esta todo lo decorativo, sistema de rendimiento y blah blah blah */}
            <div className="contenido-derecha">
              <h1 className="titulo-serif-grande">Rendimiento <br /> y Satisfacción</h1>
              <p className="descripcion">Sistema de Evaluación para el Seguimiento del Desempeño Académico y la Satisfacción Estudiantil</p>
            </div>
           
            {/* El GlassCard con informacion que querias */}
            <div className="glass-card">
              <div className="dot-decor"></div>
              <p>Centro de Estudios Cientificos y Tecnologicos N.º 5</p>
              <p><strong>"Benito Juarez" - IPN</strong></p>
             </div>
          </div>
        </div>
      )}
      
      {/*la etiqueta de la version, ya la actualice w jaja ya es la 1.3.4 porque lo estuve actualizando todo el dia*/}
      <div className="VersionTag">v1.3.0</div>
    </>
  )

}

export default App;
