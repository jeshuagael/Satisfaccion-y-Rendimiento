import { useEffect, useState } from 'react';
import './Noticias.css';

function NoticiasUser({ usuario, volver }) {
  const [noticias, setNoticias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarNoticias();
  }, []);

  const cargarNoticias = async () => {
    setLoading(true);
    try {
      const respuesta = await fetch('http://localhost:4500/api/noticias');
      const data = await respuesta.json();
      if (data.success) {
        setNoticias(data.data || []);
      }
    } catch (error) {
      console.error('Error cargando noticias:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="noticias-page">
      <div className="noticias-panel">
        <div className="noticias-header">
          <div>
            <p className="label-top">Noticias</p>
            <h1 className="titulo-serif">Novedades para {usuario?.rol}</h1>
            <p className="subtitulo">Aquí llegan todas las publicaciones creadas por el equipo administrativo.</p>
          </div>
          <div className="noticias-accesos">
            <button className="role-btn" onClick={volver}>← Volver</button>
          </div>
        </div>

        <div className="noticias-historial noticias-user-list">
          {loading ? (
            <p>Cargando noticias...</p>
          ) : noticias.length === 0 ? (
            <p>No hay noticias disponibles en este momento.</p>
          ) : (
            noticias.map((item) => (
              <article key={item.id} className="noticia-card">
                <div className="noticia-meta">
                  <div>
                    <p className="noticia-titulo">{item.titulo}</p>
                    <p className="noticia-autor">Publicado por {item.autor}</p>
                  </div>
                  <p className="noticia-fecha">{new Date(item.fecha).toLocaleDateString()}</p>
                </div>
                <p className="noticia-texto">{item.descripcion}</p>
                {item.imagenData && (
                  <img className="noticia-imagen" src={item.imagenData} alt="Noticia" />
                )}
              </article>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default NoticiasUser;
