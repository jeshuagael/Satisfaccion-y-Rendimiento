import { useState } from 'react'
import "./Bienvenida.css";

function Bienvenida({ Cerrar}) {
    const [Encuesta, setEncuesta] = useState(false)
    const [Graficas, setGraficas] = useState(false)
    const [Docentes, setDocentes] = useState(false)
    const [Noticias, setNoticias] = useState(false)
return (
 

      <div className="pantalla-bienvenida">
        <div className="lado-izk">
            <button onClick={() => setEncuesta(true)}>Encuestas</button>
            <button onClick={() => setGraficas(true)}>Graficas</button>
            <button onClick={() => setDocentes(true)}>Docentes</button>
            <button onClick={() => setNoticias(true)}>Noticias</button>
            <button onClick={Cerrar}>Cerrar Sesion</button>

  </div>
        <div className="lado-del">
          <h1> Bienvenid@ </h1>
        </div>
      </div>
)
}

export default Bienvenida;
