import { useState } from 'react'
import "./Registro.css";
//La pantalla de registro es sencilla no hay mucha ciencia en este
function Registro({ volver }) {
  const [boleta, setBoleta] = useState("");
  const [nombres, setNombres] = useState("");
  const [apellidoPaterno, setApellidoPaterno] = useState("");
  const [apellidoMaterno, setApellidoMaterno] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [rol, setRol] = useState("Alumno");
  const [loading, setLoading] = useState(false);
//Este funciona igual que el de ManejarLogin los dos previenen que no se llenen los campos y que todo se mande al servidor
  const manejarRegistro = async (event) => {
    event.preventDefault();

    if (!boleta.trim() || !nombres.trim() || !apellidoPaterno.trim() || !apellidoMaterno.trim() || !password || !confirmPassword) {
      alert("Por favor completa todos los campos.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);

    try {
      const respuesta = await fetch('http://localhost:4500/api/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          boleta,
          nombres,
          apellidoPaterno,
          apellidoMaterno,
          password,
          confirmarPassword: confirmPassword,
          rol,
        }),
      });
      //Esto valida los datos y manda errores o soluciones en caso de que todo se cumpla
      const datos = await respuesta.json();

      if (datos.success) {
        alert('Registro completado correctamente. Ya puedes iniciar sesión.');
        volver();
      } else {
        alert(datos.message || 'Ocurrió un error en el registro.');
      }
    } catch (error) {
      console.error('Error al registrar:', error);
      alert('No se pudo conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };
  //Esta es toda la logica del registro, utiliza el mismo estilo que Login
  return (
    <div className="pantalla-login">
      <div className="lado-izq">
        <p className="label-top">Registro</p>
        <h1>Crear Cuenta</h1>
        <div className="linea-dorada"></div>
        <p className="subtitulo">Completa tus datos institucionales para crear tu cuenta.</p>

        <form onSubmit={manejarRegistro}>
          <div className="input-group">
            <label htmlFor="boleta">Boleta / Trabajador</label>
            <input
              id="boleta"
              type="text"
              placeholder="Ej. 20230001 o TRAB123"
              value={boleta}
              onChange={(e) => setBoleta(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label htmlFor="nombres">Nombre(s)</label>
            <input
              id="nombres"
              type="text"
              placeholder="Nombre(s)"
              value={nombres}
              onChange={(e) => setNombres(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label htmlFor="apellidoPaterno">Apellido Paterno</label>
            <input
              id="apellidoPaterno"
              type="text"
              placeholder="Apellido Paterno"
              value={apellidoPaterno}
              onChange={(e) => setApellidoPaterno(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label htmlFor="apellidoMaterno">Apellido Materno</label>
            <input
              id="apellidoMaterno"
              type="text"
              placeholder="Apellido Materno"
              value={apellidoMaterno}
              onChange={(e) => setApellidoMaterno(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label htmlFor="confirmPassword">Confirmar Contraseña</label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="Confirmar Contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <p>Seleccionar rol</p>
          <div className="botones-roles">
            <button
              type="button"
              className={`role-btn ${rol === 'Alumno' ? 'active' : ''}`}
              onClick={() => setRol('Alumno')}
            >👨‍🎓 Alumno</button>
            <button
              type="button"
              className={`role-btn ${rol === 'Docente' ? 'active' : ''}`}
              onClick={() => setRol('Docente')}
            >🎓 Docente</button>
          </div>

          <button type="submit" className="btn-principal" disabled={loading}>
            {loading ? 'Registrando...' : 'Registrarme'}
          </button>

          <a href="#" className="registro_pass" onClick={volver}>Volver al inicio</a>
        </form>
      </div>

      <div className="lado-der">
        <div className="menu-icon">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div className="contenido-derecha">
          <h1 className="titulo-serif-grande">Rendimiento <br /> y Satisfacción</h1>
          <p className="descripcion">Sistema de Evaluación para el Seguimiento del Desempeño Académico y la Satisfacción Estudiantil</p>
        </div>
        <div className="glass-card">
          <div className="dot-decor"></div>
          <div className="textos-card">
            <p>Centro de Estudios Cientificos y Tecnologicos N.º 5</p>
            <p><strong>"Benito Juarez" - IPN</strong></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Registro;
