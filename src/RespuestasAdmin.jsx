import { useEffect, useState } from 'react';
import './Noticias.css';
//RespuestasAdmin y UsuariosAdmin son lo mismo pero cambiando la peticion del servidor y ya
function RespuestasAdmin({ usuario, volver }) {
  const [tipoSeleccionado, setTipoSeleccionado] = useState('bano');
  const [encuestas, setEncuestas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarEncuestas();
  }, [tipoSeleccionado]);
//Esto carga las encuestas que hay desde el servidor para mostrarlas dentro de esta pantalla
  const cargarEncuestas = async () => {
    setLoading(true);
    try {
      const respuesta = await fetch(`http://localhost:4500/api/admin/encuestas/${tipoSeleccionado}`);
      const data = await respuesta.json();
      if (data.success) {
        setEncuestas(data.data || []);
      }
    } catch (error) {
      console.error('Error cargando encuestas:', error);
    } finally {
      setLoading(false);
    }
  };
//esto borra la encuesta del servidor si es lo que queremos
  const borrarEncuesta = async (index) => {
    try {
      const respuesta = await fetch(`http://localhost:4500/api/admin/encuestas/${tipoSeleccionado}/${index}`, {
        method: 'DELETE',
      });
      const data = await respuesta.json();
      if (data.success) {
        cargarEncuestas();
      }
    } catch (error) {
      console.error('Error borrando encuesta:', error);
    }
  };
//Esto ya es todo lo visual que hay
  return (
    <div className="noticias-page">
      <div className="noticias-panel">
        <div className="noticias-header">
          <div>
            <p className="label-top">Respuestas Admin</p>
            <h1 className="titulo-serif">Gestiona Encuestas Contestadas</h1>
            <p className="subtitulo">Desde aquí puedes ver y eliminar las respuestas de las encuestas.</p>
          </div>
          <div className="noticias-accesos">
            <button className="role-btn" onClick={volver}>← Volver</button>
          </div>
        </div>

        <div className="noticias-menu" style={{ display: 'flex', gap: '10px', overflowX: 'auto' }}>
          <button className={`role-btn ${tipoSeleccionado === 'bano' ? 'active' : ''}`} onClick={() => setTipoSeleccionado('bano')}>Baños</button>
          <button className={`role-btn ${tipoSeleccionado === 'docentes' ? 'active' : ''}`} onClick={() => setTipoSeleccionado('docentes')}>Docentes</button>
          <button className={`role-btn ${tipoSeleccionado === 'salones' ? 'active' : ''}`} onClick={() => setTipoSeleccionado('salones')}>Salones</button>
          <button className={`role-btn ${tipoSeleccionado === 'laboratorios' ? 'active' : ''}`} onClick={() => setTipoSeleccionado('laboratorios')}>Laboratorios</button>
        </div>

        <div className="noticias-historial">
          {loading ? (
            <p>Cargando respuestas...</p>
          ) : encuestas.length === 0 ? (
            <p>No hay encuestas contestadas todavía en esta categoría.</p>
          ) : (
            encuestas.map((item, index) => (
              <article key={index} className="noticia-card">
                <div className="noticia-meta">
                  <div>
                    <p className="noticia-titulo">Respuesta #{index + 1} - {item.tipo || 'Encuesta'}</p>
                    <p className="noticia-autor">Satisfacción: {item.satisfaccion}%</p>
                    
                    {item.docenteId && <p className="noticia-autor">ID Docente Evaluado: {item.docenteId}</p>}
                  </div>
                  <button className="btn-borrar" onClick={() => borrarEncuesta(index)}>Borrar</button>
                </div>
                <div className="noticia-texto">
                  {Object.entries(item).map(([key, value]) => {
                    if (['tipo', 'fecha', 'satisfaccion', 'nombre', 'docenteId'].includes(key)) return null;
                    return (
                      <p key={key} style={{ margin: '5px 0' }}>
                        <strong>{key}:</strong> {String(value)}
                      </p>
                    );
                  })}
                </div>
                {item.fecha && <p className="noticia-fecha">{new Date(item.fecha).toLocaleString()}</p>}
              </article>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default RespuestasAdmin;
