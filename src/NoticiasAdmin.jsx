import { useEffect, useState } from 'react';
import './Noticias.css';
//El menu de noticias es similar al menu de Usuarios
function NoticiasAdmin({ usuario, volver }) {
  const [tab, setTab] = useState('crear');
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [imagenData, setImagenData] = useState('');
  const [preview, setPreview] = useState('');
  const [noticias, setNoticias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    cargarNoticias();
  }, []);
  //Esto carga las noticias que hayan en el servidor 
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
//esto carga la imagen si es que hay
  const handleImagen = (event) => {
    const file = event.target.files[0];
    if (!file) {
      setImagenData('');
      setPreview('');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImagenData(reader.result);
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };
//esto previene que se agregue una noticia sin descripcion
  const guardarNoticia = async () => {
    if (!descripcion.trim()) {
      setMensaje('Por favor escribe una descripción antes de publicar.');
      return;
    }
    //Esto crea una nuevaNoticia
    const nuevaNoticia = {
      titulo: titulo.trim() || `Publicación de ${usuario?.nombre}`,
      descripcion: descripcion.trim(),
      imagenData,
      autor: usuario?.nombre || 'Administrador',
    };

    try {
      const respuesta = await fetch('http://localhost:4500/api/noticias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevaNoticia),
      });
      if (!respuesta.ok) {
        const errorText = await respuesta.text();
        console.error('Error response:', respuesta.status, errorText);
        setMensaje('Error al conectar con el servidor. Intenta con una imagen más pequeña.');
        return;
      }
      const data = await respuesta.json();
      if (data.success) {
        setMensaje('Noticia publicada correctamente.');
        setTitulo('');
        setDescripcion('');
        setImagenData('');
        setPreview('');
        setTab('historial');
        cargarNoticias();
      } else {
        setMensaje(data.message || 'No se pudo publicar la noticia.');
      }
    } catch (error) {
      console.error('Error publicando noticia:', error);
      setMensaje('Error al conectar con el servidor.');
    }
  };
  //Este codigo borra la noticia del servidor
  const borrarNoticia = async (id) => {
    try {
      const respuesta = await fetch(`http://localhost:4500/api/noticias/${id}`, {
        method: 'DELETE',
      });
      const data = await respuesta.json();
      if (data.success) {
        cargarNoticias();
      }
    } catch (error) {
      console.error('Error borrando noticia:', error);
    }
  };
//Aqui esta toda la logica que dibuja la pagina
  return (
    <div className="noticias-page">
      <div className="noticias-panel">
        <div className="noticias-header">
          <div>
            <p className="label-top">Noticias Admin</p>
            <h1 className="titulo-serif">Gestiona tus publicaciones</h1>
            <p className="subtitulo">Desde aquí puedes crear noticias, adjuntar fotos y ver el historial de publicaciones.</p>
          </div>
          <div className="noticias-accesos">
            <button className="role-btn" onClick={volver}>← Volver</button>
          </div>
        </div>
        {/*Este es el menu de crear o ver historia*/}
        <div className="noticias-menu">
          <button className={`role-btn ${tab === 'crear' ? 'active' : ''}`} onClick={() => setTab('crear')}>Nueva noticia</button>
          <button className={`role-btn ${tab === 'historial' ? 'active' : ''}`} onClick={() => setTab('historial')}>Historial</button>
        </div>

        {tab === 'crear' ? (
          <div className="noticias-formulario">
            <label>
              Título opcional
              <input
                type="text"
                placeholder="Título de la publicación"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
              />
            </label>
            <label>
              Descripción
              <textarea
                rows={5}
                placeholder="Escribe aquí la noticia, una actualización o información para la comunidad"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
              />
            </label>
            <label className="imagen-input-label">
              Adjuntar imagen
              <input type="file" accept="image/*" onChange={handleImagen} />
            </label>
            {preview && (
              <div className="noticias-preview">
                <p>Vista previa de la imagen:</p>
                <img src={preview} alt="Vista previa" />
              </div>
            )}
            <button className="btn-principal" onClick={guardarNoticia}>Publicar noticia</button>
            {mensaje && <p className="mensaje-noticia">{mensaje}</p>}
          </div>
        ) : (
          <div className="noticias-historial">
            {loading ? (
              <p>Cargando noticias...</p>
            ) : noticias.length === 0 ? (
              <p>No hay noticias publicadas todavía.</p>
            ) : (
              noticias.map((item) => (
                <article key={item.id} className="noticia-card">
                  <div className="noticia-meta">
                    <div>
                      <p className="noticia-titulo">{item.titulo}</p>
                      <p className="noticia-autor">Publicado por {item.autor}</p>
                    </div>
                    <button className="btn-borrar" onClick={() => borrarNoticia(item.id)}>Borrar</button>
                  </div>
                  <p className="noticia-texto">{item.descripcion}</p>
                  {item.imagenData && (
                    <img className="noticia-imagen" src={item.imagenData} alt="Adjunta" />
                  )}
                  <p className="noticia-fecha">{new Date(item.fecha).toLocaleString()}</p>
                </article>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default NoticiasAdmin;
