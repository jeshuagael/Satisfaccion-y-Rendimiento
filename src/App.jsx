import { useState } from 'react'
import Bienvenida from './Bienvenida.jsx'
import './App.css'
/* si quieresw meter botones mete el import de hasta arriba de la linea 1 y despues*/
function App() {
  const [Sesion, setSesion] = useState(false) 
  /* Metes este const dentro de los corchetes [Nombre de variable , setNombre de variable] y lo pones en falso wey*/
  /* No me deja comentar abajo pero en la linea 22 esta como declarar un boton*/
  return ( 
    <> 
      {Sesion ? ( /* Aqui en Sesion dice pregunta sobre el estado de Sesion, el codigo pregunta si Sesion es verdadero, en caso de ser
      verdadero le dice al programa que lance la pantalla de Bienvenida que es <Bienvenida Cerrar = () {} dentro de los corchetes puedes poner lo que quieras, yo puse el
      console.log("") que es lo que imprime en la consola para saber si si jalaba*/
        <Bienvenida Cerrar={() => { // Cerrar es la funcion de la clase de Bienvenida.jsx
          console.log("El Boton Funciona");
          setSesion(false); //y se declara que es falso para que no vuelva a mostrar la pantalla hasta que se lo pidamos
        }} />
      ) : ( // Aqui entra la otra condicion que es en caso de que Sesion sea falso ps que se muestre esta pantalla
        // Aqui se cumple la categoria de los estados "Booleanos" para q lo anotes 
        <div className="pantalla-login" >
          <div className="lado-izq"> 
            <h1>Inicio de Sesión</h1> 
            <input type="text" placeholder='Usuario' /> 
            <input type="password" placeholder='Contraseña' /> 
            <button onClick={() => setSesion(true)}>Iniciar Sesión</button> 
          </div>
          <div className="lado-der"> 
            <h1>Bienvenido a la Página de Rendimiento y Satisfacción</h1>
            <h1>Centro de Estudios Científicos y Tecnológicos Número 5 "Benito Juárez"</h1>
            <h1>CECYT 5</h1>
          </div>
        </div>
      )}
      <div className="VersionTag">v0.0.2</div>
    </>
  )
}

export default App;
