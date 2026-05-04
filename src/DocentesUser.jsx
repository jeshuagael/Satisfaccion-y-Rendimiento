import { useEffect, useMemo, useState } from 'react';
import './Docentes.css';
//Este codigo solo carga la parte de historial que carga en DocentesAdmin
function DocentesUser({ usuario, volver }) {
  const [docentes, setDocentes] = useState([]);
  const [resenas, setResenas] = useState([]);
  const [selected, setSelected] = useState(null);
  const [mostrar, setMostrar] = useState('info');
  const [tituloResena, setTituloResena] = useState('');
  const [descripcionResena, setDescripcionResena] = useState('');
  const [estrellas, setEstrellas] = useState(5);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const [docentesResp, resenasResp] = await Promise.all([
        fetch('http://localhost:4500/api/docentes'),
        fetch('http://localhost:4500/api/resenas'),
      ]);
      const docentesJson = await docentesResp.json();
      const resenasJson = await resenasResp.json();
      if (docentesJson.success) setDocentes(docentesJson.data || []);
      if (resenasJson.success) setResenas(resenasJson.data || []);
    } catch (error) {
      console.error('Error cargando datos de docentes:', error);
    }
  };

  const revisarDocente = (docente) => {
    setSelected(docente);
    setMostrar('info');
    setMensaje('');
  };

  const resenasPorDocente = useMemo(() => {
    if (!selected) return [];
    return resenas.filter((item) => Number(item.docenteId) === Number(selected.id));
  }, [selected, resenas]);

  const promedioEstrellas = useMemo(() => {
    if (!selected) return 0;
    const lista = resenasPorDocente;
    if (lista.length === 0) return 0;
    return Number((lista.reduce((sum, item) => sum + Number(item.estrellas), 0) / lista.length).toFixed(1));
  }, [resenasPorDocente, selected]);

  const crearResena = async () => {
    if (!selected) return;
    if (!tituloResena.trim() || !descripcionResena.trim()) {
      setMensaje('Título y descripción son obligatorios.');
      return;
    }

    const nuevaResena = {
      docenteId: selected.id,
      titulo: tituloResena.trim(),
      descripcion: descripcionResena.trim(),
      estrellas,
      autor: 'Anónimo',
      fecha: new Date().toISOString(),
    };

    try {
      const respuesta = await fetch('http://localhost:4500/api/resenas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevaResena),
      });
      const data = await respuesta.json();
      if (data.success) {
        setMensaje('Reseña guardada.');
        setTituloResena('');
        setDescripcionResena('');
        setEstrellas(5);
        cargarDatos();
      } else {
        setMensaje(data.message || 'No se pudo guardar la reseña.');
      }
    } catch (error) {
      console.error('Error guardando reseña:', error);
      setMensaje('Error al conectar con el servidor.');
    }
  };
  //Esto carga solo historial de docentes admin 
  return (
    <div className="docentes-page">
      <div className="docentes-panel">
        <div className="docentes-header">
          <div>
            <p className="label-top">Docentes</p>
            <h1 className="titulo-serif">Conoce a tu plantilla docente</h1>
            <p className="subtitulo">Selecciona un profesor para ver su información y añadir reseñas anonymas.</p>
          </div>
          <div className="docentes-actions">
            <button className="role-btn" onClick={volver}>← Volver</button>
          </div>
        </div>

        <div className="docentes-grid">
          <div className="docentes-lista">
            {docentes.length === 0 ? (
              <p>No hay docentes registrados todavía.</p>
            ) : (
              docentes.map((docente) => {
                const lista = resenas.filter((item) => Number(item.docenteId) === Number(docente.id));
                const promedio = lista.length > 0 ? Number((lista.reduce((sum, item) => sum + Number(item.estrellas), 0) / lista.length).toFixed(1)) : 0;
                return (
                  <button key={docente.id} className={`docente-card ${selected?.id === docente.id ? 'selected' : ''}`} onClick={() => revisarDocente(docente)}>
                    <div className="docente-card-header">
                      <div>
                        <p className="docente-nombre">{docente.nombre}</p>
                        <p className="docente-meta">{docente.carreras.join(', ')}</p>
                      </div>
                      <p className="docente-estrellas">{promedio > 0 ? `${promedio} ⭐` : 'Sin reseñas'}</p>
                    </div>
                    <p className="docente-materias">{docente.materias.join(', ')}</p>
                  </button>
                );
              })
            )}
          </div>
          {/* esto enseña la foto y toda la informacion*/}
          <div className="docente-detalle-panel">
            {!selected ? (
              <div className="docente-detalle-vacio">
                <p>Selecciona un docente para ver más información.</p>
              </div>
            ) : (
              <div className="docente-detalle">
                <div className="docente-detalle-header">
                  {selected.fotoData ? <img src={selected.fotoData} alt={selected.nombre} /> : <div className="docente-sin-foto">Sin foto</div>}
                  <div>
                    <h2>{selected.nombre}</h2>
                    <p>Carreras: {selected.carreras.join(', ')}</p>
                    <p>Materias: {selected.materias.join(', ')}</p>
                    <p>Promedio: {promedioEstrellas > 0 ? `${promedioEstrellas} / 5` : 'No hay reseñas aún'}</p>
                  </div>
                </div>

                <div className="docente-opciones">
                  <button className={`role-btn ${mostrar === 'ver' ? 'active' : ''}`} onClick={() => setMostrar('ver')}>Ver reseñas</button>
                  <button className={`role-btn ${mostrar === 'resenar' ? 'active' : ''}`} onClick={() => setMostrar('resenar')}>Reseñar</button>
                </div>

                {mostrar === 'info' && (
                  <div className="docente-info">
                    <p>En esta sección verás el perfil del docente con su carrera, materias y promedio de reseñas.</p>
                  </div>
                )}

                {mostrar === 'ver' && (
                  <div className="docente-resenas-lista">
                    {resenasPorDocente.length === 0 ? (
                      <p>No hay reseñas para este docente.</p>
                    ) : (
                      resenasPorDocente.map((item) => (
                        <div key={item.id} className="reseña-card usuario">
                          <div className="reseña-top">
                            <p className="reseña-titulo">{item.titulo}</p>
                            <span className="reseña-estrellas">{item.estrellas} ⭐</span>
                          </div>
                          <p className="reseña-texto">{item.descripcion}</p>
                        </div>
                      ))
                    )}
                  </div>
                )}
                {/* si quiere reseñar pues muestra la parte de las reseñas*/}
                {mostrar === 'resenar' && (
                  <div className="docente-formulario-resena">
                    <label>
                      Nombre de la reseña
                      <input value={tituloResena} onChange={(e) => setTituloResena(e.target.value)} placeholder="Título de la reseña" />
                    </label>
                    <label>
                      Descripción
                      <textarea value={descripcionResena} onChange={(e) => setDescripcionResena(e.target.value)} placeholder="Tu opinión sobre el docente" rows={5} />
                    </label>
                    <label>
                      Calificación
                      <select value={estrellas} onChange={(e) => setEstrellas(Number(e.target.value))}>
                        {[5, 4, 3, 2, 1].map((valor) => (
                          <option key={valor} value={valor}>{valor} estrella{valor > 1 ? 's' : ''}</option>
                        ))}
                      </select>
                    </label>
                    <button className="btn-principal" onClick={crearResena}>Enviar reseña</button>
                    {mensaje && <p className="mensaje-docente">{mensaje}</p>}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DocentesUser;
