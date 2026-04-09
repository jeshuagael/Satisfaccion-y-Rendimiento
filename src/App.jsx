import { useState } from 'react' //importamos el useState para el manejo de estados en el componente //creamos una Base de Datos Local para los usuarios
import Bienvenida from './Bienvenida.jsx'
import './App.css' //importamos el diseño
import BienvenidaAlumno from './BienvenidaAlumno.jsx' // importamos las pantallas de bienvenida para cada rol
import BienvenidaDocente from './BienvenidaDocente.jsx'
import BienvenidaAdmin from './BienvenidaAdmin.jsx'
function App() {
  // almacena los datos del usuario autenticado (null si no hay sesión iniciada)
  const [usuarioLogueado, setUsuarioLogueado] = useState(null)
  
  // almacena el input del usuario ingresado en el campo de boleta
  const [usuarioInput, setUsuarioInput] = useState("")
  
  // almacena el input de la contraseña ingresada
  const [passsInput, setPassInput] = useState("")
  
  // almacena el rol seleccionado ("Alumno", "Docente" o "Administrador")
  const [rolSeleccionado, setRolSeleccionado] = useState("Alumno")
  /* manejarLogin es una funcion que valida las credenciales del usuario con la BDD
  busca en la BDD si algun usuario coincide  y si encuentra coinicidencia te manda a la pantalla, si no esta muestra error*/
  const manejarLogin = async () => {
    try { {/*esto es el manejo de errores pero cambie el metodo de manejarLogin para conectarlo al server jaja*/}
      const respuesta = await fetch('http://localhost:3000/api/login', { /* esto es la configuracion del servidor, aqui el metodo agarra los inputs y los manda
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

 //este es la logica que muestra topa la pagina
  return ( 
    <> 
      {usuarioLogueado ? ( 
        // si el usuario esta logueado, muestra la pantalla dependiendo de su rol
        usuarioLogueado.rol === "Alumno" ? (
          <BienvenidaAlumno usuario={usuarioLogueado} cerrar ={() => setUsuarioLogueado(null)} />
        ) : usuarioLogueado.rol === "Docente" ? (
          <BienvenidaDocente usuario={usuarioLogueado} cerrar ={() => setUsuarioLogueado(null)} />
        ) : (
          <BienvenidaAdmin usuario={usuarioLogueado} cerrar ={() => setUsuarioLogueado(null)} />
        )
      ) : ( 
        // si no hay una sesion iniciada entonces se muestra la pantalla de login
        <div className="pantalla-login" >
          <div className="lado-izq"> 
            <p className="label-top">Acceso al sistema </p>
            <h1>Inicio de Sesión</h1> 
            <div className="linea-dorada"></div>
            <p className="subtitulo">Ingresa tus credenciales institucionales para continuar </p>
            <div className="Selector de roles"></div>
            <p>Ingresar Como</p>
            
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
            
            {/* como pusiste tu texto dorado de recuperar contraseña lo puse aqui tambien péro no te manda nada */}
            <a href="#" className="olvido-pass">¿Olvidaste tu contraseña?</a> 
            
            {/* este boton llama a la funcion de manejarLogin y decide si lanzarte a la otra pantalla o directamente mandarte alaverga*/}
            <button className="btn-principal" onClick={manejarLogin}>Iniciar Sesión</button> 
          </div>
          
          {/* Aqui no hay nada que te interese ndms lo del menu*/}
          <div className="lado-der"> 
            {/* icono del menu el span es ndms para el palito we no te preocupes por el*/}
            <div className="menu-icon">
              <span></span>
              <span></span>
              <span></span>
            </div>
            
            {/* aqui esta todo lo decorativo, sistema de rendimiento y blah blah blah */}
            <div className="contenido-derecha">
              <h1 className="titulo-serif-grande">Rendimiento <br /> y Satisfacción</h1>
              <p className="descripcion">Sistema de Evaluación para el Seguimiento del Desempeño Académico y la Satisfacción Estudiantil</p>
            </div>
           
            
            <div className="glass-card">
              <div className="dot-decor"></div>
              <p>Centro de Estudios Cientificos y Tecnologicos N.º 5</p>
              <p><strong>"Benito Juarez" - IPN</strong></p>
             </div>
          </div>
        </div>
      )}
      
      {/*la etiqueta de la version, ya la actualice w jaja ya es la 1.3.4 porque lo estuve actualizando todo el dia*/}
      <div className="VersionTag">v1.4.1</div>
    </>
  )

}

export default App;
