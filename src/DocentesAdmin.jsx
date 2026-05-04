import { useEffect, useState } from 'react';
import './Docentes.css';
//Importamos y declaramos todo para agregar y recibir los datos
function DocentesAdmin({ usuario, volver }) {
  const [tab, setTab] = useState('nuevo');
  const [nombre, setNombre] = useState('');
  const [carreras, setCarreras] = useState('');
  const [materias, setMaterias] = useState('');
  const [fotoData, setFotoData] = useState('');
  const [preview, setPreview] = useState('');
  const [docentes, setDocentes] = useState([]);
  const [resenas, setResenas] = useState([]);
  const [selectedDocente, setSelectedDocente] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [loading, setLoading] = useState(true);
  // hacemos llamamos un metodo llamado cargarTodo
  useEffect(() => {
    cargarTodo();
  }, []);
  //Esto carga los docentes y sus reseñas para que aparezcan bien
  const cargarTodo = async () => {
    setLoading(true);
    await Promise.all([cargarDocentes(), cargarResenas()]);
    setLoading(false);
  };
  //esto hace una conexion directa a servidor.js donde pide los docentes que hay y le lelgan en forma de const data
  const cargarDocentes = async () => {
    try {
      const respuesta = await fetch('http://localhost:4500/api/docentes');
      const data = await respuesta.json();
      if (data.success) setDocentes(data.data || []);
    } catch (error) {
      console.error('Error cargando docentes:', error);
    }
  };
  //Esto hace lo mismo que arriba solo que con las reseñas
  const cargarResenas = async () => {
    try {
      const respuesta = await fetch('http://localhost:4500/api/resenas');
      const data = await respuesta.json();
      if (data.success) setResenas(data.data || []);
    } catch (error) {
      console.error('Error cargando reseñas:', error);
    }
  };
  //Para eliminarDocente manda una peticion al servidor para eliminarlo de ahi
  const eliminarDocente = async (id) => {
    try {
      const respuesta = await fetch(`http://localhost:4500/api/docentes/${id}`, {
        method: 'DELETE',
      });
      const data = await respuesta.json();
      if (data.success) {
        if (selectedDocente?.id === id) {
          setSelectedDocente(null);
        }
        cargarTodo();
      }
    } catch (error) {
      console.error('Error eliminando docente:', error);
    }
  };
  //Para editar docente, aqui no hay nada que conexte a la API simplemente te reenvia a la pestaña de agregar profes pero con editar profes
  const editarDocente = (docente) => {
    setSelectedDocente(docente);
    setNombre(docente.nombre || '');
    setCarreras(docente.carreras?.join(', ') || '');
    setMaterias(docente.materias?.join(', ') || '');
    setFotoData(docente.fotoData || '');
    setPreview(docente.fotoData || '');
    setTab('nuevo');
    setMensaje('');
  };
  //Simplemente cancela la edicion jajaja
  const cancelarEdicion = () => {
    setSelectedDocente(null);
    setNombre('');
    setCarreras('');
    setMaterias('');
    setFotoData('');
    setPreview('');
    setMensaje('');
    setTab('nuevo');
  };
//Esto guarda la foto en el servidor
  const handleFoto = (event) => {
    const file = event.target.files[0];
    if (!file) {
      setFotoData('');
      setPreview('');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setFotoData(reader.result);
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };
//Esto guarda al docente en el servidor y aparte revisa que no hayan errores 
  const guardarDocente = async () => {
    if (!nombre.trim() || !materias.trim()) {
      setMensaje('El nombre y las materias son obligatorias.');
      return;
    }
    //Despliega la infromacion de los docentes
    const docentePayload = {
      nombre: nombre.trim(),
      carreras: carreras.split(',').map((item) => item.trim()).filter(Boolean),
      materias: materias.split(',').map((item) => item.trim()).filter(Boolean),
      fotoData,
      creadoPor: usuario?.nombre || 'Administrador',
    };
    // usa un try para recibir los datos del servidor dependiendo de que docente selecciono para que llegue la informacion
    try {
      const url = selectedDocente ? `http://localhost:4500/api/docentes/${selectedDocente.id}` : 'http://localhost:4500/api/docentes';
      const method = selectedDocente ? 'PUT' : 'POST';
      const respuesta = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(docentePayload),
      });
      const data = await respuesta.json();
      if (data.success) {
        setMensaje(selectedDocente ? 'Docente actualizado correctamente.' : 'Docente guardado correctamente.');
        setNombre('');
        setCarreras('');
        setMaterias('');
        setFotoData('');
        setPreview('');
        setSelectedDocente(null);
        setTab('historial');
        cargarTodo();
      } else {
        setMensaje(data.message || 'No se pudo guardar el docente.');
      }
    } catch (error) {
      console.error('Error guardando docente:', error);
      setMensaje('Error al conectar con el servidor.');
    }
  };
  //Esto hace lo mismo que el de eliminar docente
  const eliminarResena = async (id) => {
    try {
      const respuesta = await fetch(`http://localhost:4500/api/resenas/${id}`, {
        method: 'DELETE',
      });
      const data = await respuesta.json();
      if (data.success) {
        cargarTodo();
      }
    } catch (error) {
      console.error('Error eliminando reseña:', error);
    }
  };
//Este es para cuando seleccionemos un docente
  const seleccionaDocente = (docente) => {
    setSelectedDocente(docente);
    setTab('historial');
  };
  //se calcula el promedio de estrellas de si le dieron 2 estrellas y 5 estrellas pues cual sea la media de estas
  const calcularEstrellas = (docenteId) => {
    const reseñas = resenas.filter((r) => Number(r.docenteId) === Number(docenteId));
    if (reseñas.length === 0) return { promedio: 0, total: 0 };
    const suma = reseñas.reduce((acc, item) => acc + Number(item.estrellas), 0);
    return { promedio: Number((suma / reseñas.length).toFixed(1)), total: reseñas.length };
  };
  //Aqui esta todo el diseño de la pantalla
  return (
    <div className="docentes-page">
      <div className="docentes-panel">
        <div className="docentes-header">
          <div>
            <p className="label-top">Docentes Admin</p>
            <h1 className="titulo-serif">Gestiona los profesores</h1>
            <p className="subtitulo">Crea perfiles de docentes y revisa su historial de reseñas en tiempo real.</p>
          </div>
          <div className="docentes-actions">
            <button className="role-btn" onClick={volver}>← Volver</button>
          </div>
        </div>

        <div className="docentes-menu">
          {/* Aqui son lo9 botones para añadir maestro o ver el historial*/}
          <button className={`role-btn ${tab === 'nuevo' ? 'active' : ''}`} onClick={() => { setTab('nuevo'); setSelectedDocente(null); setMensaje(''); }}>Agregar docente</button>
          <button className={`role-btn ${tab === 'historial' ? 'active' : ''}`} onClick={() => setTab('historial')}>Historial</button>
        </div>
        {/* si se eligio agregar docente entonces muestra los input para registrarlo*/}
        {tab === 'nuevo' ? (
          <div className="docentes-formulario">
            <label>
              Nombre del profesor
              <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ej. Ing. Luis Pérez" />
            </label>
            <label>
              Carrera(s)
              <input type="text" value={carreras} onChange={(e) => setCarreras(e.target.value)} placeholder="Ej. Mecatrónica, Sistemas" />
            </label>
            <label>
              Materias
              <input type="text" value={materias} onChange={(e) => setMaterias(e.target.value)} placeholder="Ej. Cálculo, Física" />
            </label>
            <label className="imagen-input-label">
              Foto del docente
              {/* Esto es para enviar la foto */}
              <input type="file" accept="image/*" onChange={handleFoto} />
            </label>
            {preview && (
              <div className="docentes-preview">
                <p>Vista previa de la foto:</p>
                <img src={preview} alt="Vista previa docente" />
              </div>
            )}
            <button className="btn-principal" onClick={guardarDocente}>{selectedDocente ? 'Actualizar docente' : 'Guardar docente'}</button>
            {selectedDocente && (
              <button className="role-btn" onClick={cancelarEdicion}>Cancelar edición</button>
            )}
            {mensaje && <p className="mensaje-docente">{mensaje}</p>}
          </div>
        ) : ( 
          <div className="docentes-historial"> {/* Esto es por si se eligio historial */}
            {loading ? (
              <p>Cargando historial de docentes...</p>
            ) : (
              <div className="docentes-grid">
                <div className="docentes-lista">
                  {docentes.length === 0 ? (
                    <p>No hay docentes registrados todavía.</p>
                  ) : (
                    docentes.map((docente) => {
                      const { promedio, total } = calcularEstrellas(docente.id);
                      return (
                        <button
                          key={docente.id}
                          className={`docente-card ${selectedDocente?.id === docente.id ? 'selected' : ''}`}
                          onClick={() => seleccionaDocente(docente)}
                        >
                          <div className="docente-card-top">
                            <div>
                              <p className="docente-nombre">{docente.nombre}</p>
                              <p className="docente-meta">{docente.carreras.join(', ')}</p>
                            </div>
                            <div className="docente-estrellas">{promedio > 0 ? `${promedio} ⭐` : 'Sin reseñas'}</div>
                          </div>
                          <p className="docente-materias">{docente.materias.join(', ')}</p>
                          <p className="docente-count">{total} reseña(s)</p>
                        </button>
                      );
                    })
                  )}
                </div>
                {/* Esto es dentro del historial y se ve toda la informacion de los docentes */}
                <div className="docente-detalle-panel">
                  {!selectedDocente ? (
                    <div className="docente-detalle-vacio">
                      <p>Selecciona un docente para ver su historial y borrar reseñas.</p>
                    </div>
                  ) : (
                    <div className="docente-detalle">
                      <div className="docente-detalle-header">
                        {selectedDocente.fotoData ? <img src={selectedDocente.fotoData} alt={selectedDocente.nombre} /> : <div className="docente-sin-foto">Sin foto</div>}
                        <div>
                          <h2>{selectedDocente.nombre}</h2>
                          <p>Carreras: {selectedDocente.carreras.join(', ')}</p>
                          <p>Materias: {selectedDocente.materias.join(', ')}</p>
                        </div>
                      </div>
                      <div className="docente-reseñas-section">
                        <h3>Reseñas</h3>
                        {resenas.filter((r) => Number(r.docenteId) === Number(selectedDocente.id)).length === 0 ? (
                          <p>No hay reseñas para este profesor.</p>
                        ) : (
                          resenas
                            .filter((r) => Number(r.docenteId) === Number(selectedDocente.id))
                            .map((reseña) => (
                              <div key={reseña.id} className="reseña-card">
                                <div className="reseña-top">
                                  <p className="reseña-titulo">{reseña.titulo}</p>
                                  <span className="reseña-estrellas">{reseña.estrellas} ⭐</span>
                                </div>
                                <p className="reseña-texto">{reseña.descripcion}</p>
                                <button className="btn-borrar" onClick={() => eliminarResena(reseña.id)}>Eliminar reseña</button>
                              </div>
                            ))
                        )}
                      </div>
                      <div className="docente-detalle-acciones">
                        <button className="btn-principal" onClick={() => editarDocente(selectedDocente)}>Editar docente</button>
                        <button className="btn-borrar" onClick={() => eliminarDocente(selectedDocente.id)}>Eliminar docente</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default DocentesAdmin;
