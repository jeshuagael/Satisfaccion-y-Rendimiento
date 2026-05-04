import { useEffect, useState } from 'react';
import './Noticias.css';

function UsuariosAdmin({ usuario, volver,
 }) {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    setLoading(true);
    setMensaje('');

    try {
      const respuesta = await fetch('http://localhost:4500/api/usuarios');
      const data = await respuesta.json();
      if (data.success) {
        setUsuarios(data.data || []);
      } else {
        setMensaje('No se pudieron cargar los usuarios.');
      }
    } catch (error) {
      console.error('Error cargando usuarios:', error);
      setMensaje('Error de conexión al servidor.');
    } finally {
      setLoading(false);
    }
  };

  const borrarUsuario = async (id) => {
    const confirmacion = window.confirm('¿Estás seguro de que deseas eliminar este usuario?');
    if (!confirmacion) return;

    try {
      const respuesta = await fetch(`http://localhost:4500/api/usuarios/${id}`, {
        method: 'DELETE',
      });
      const data = await respuesta.json();
      if (data.success) {
        cargarUsuarios();
      } else {
        setMensaje(data.message || 'No se pudo eliminar el usuario.');
      }
    } catch (error) {
      console.error('Error eliminando usuario:', error);
      setMensaje('Error de conexión al servidor.');
    }
  };

  return (
    <div className="noticias-page">
      <div className="noticias-panel">
        <div className="noticias-header">
          <div>
            <p className="label-top">Usuarios Admin</p>
            <h1 className="titulo-serif">Gestiona los usuarios registrados</h1>
            <p className="subtitulo">Revisa la base de usuarios y elimina cuentas cuando sea necesario.</p>
          </div>
          <div className="noticias-accesos">
            <button className="role-btn" onClick={volver}>← Volver</button>
          </div>
        </div>

        <div className="noticias-historial">
          {loading ? (
            <p>Cargando usuarios...</p>
          ) : usuarios.length === 0 ? (
            <p>No hay usuarios registrados todavía.</p>
          ) : (
            usuarios.map((item) => (
              <article key={item.id} className="noticia-card">
                <div className="noticia-meta">
                  <div>
                    <p className="noticia-titulo">{item.nombre || item.boleta}</p>
                    <p className="noticia-autor">Rol: {item.rol}</p>
                  </div>
                  <button className="btn-borrar" onClick={() => borrarUsuario(item.id)}>
                    Eliminar
                  </button>
                </div>
                <p className="noticia-texto">ID: {item.id} · Boleta/Trabajador: {item.boleta}</p>
              </article>
            ))
          )}
        </div>

        {mensaje && <p className="mensaje-noticia">{mensaje}</p>}
      </div>
    </div>
  );
}

export default UsuariosAdmin;
