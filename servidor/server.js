/**
 Servidor de Express para manejar todo el loguin y la autenticacion de los usuarios
 */

// importe express que es el servidor
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
// importe cors para las solicitudes
import cors from 'cors';
// cree una instancia al servidor de express, sease conecte el loguin a express
const app = express();
// este es el puerto donde el servidor funciona
const PORT = 4500;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const USUARIOS_FILE = path.join(__dirname, 'usuarios.json');

app.use(cors());
// esto es pa q el server entienda las solicitudes en el formato json
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
//Estos son los usuarios que tennemos jejejeje
const usuariosIniciales = [
    {id: 1, boleta: "20230001", password: "123", rol: "Alumno", nombre: "el Chom"},
    {id: 2, boleta: "20230002", password: "123", rol: "Alumno", nombre: "el Mateo"},
    {id: 3, boleta: "profesor", password: "456", rol: "Docente", nombre: "Don Baraja"},
    {id: 4, boleta: "lic", password: "456", rol: "Docente", nombre: "Don Edahi"},
    {id: 5, boleta: "admin01", password: "789", rol: "Administrador", nombre: "Admin"},
];
//Este es el metodo que carga los usuarios para enviarlos a cualquier pantalla que lo pida
const cargarUsuarios = () => {
    try {
        if (fs.existsSync(USUARIOS_FILE)) {
            const contenido = fs.readFileSync(USUARIOS_FILE, 'utf8');
            if (contenido) {
                return JSON.parse(contenido);
            }
        }
    } catch (error) {
        console.error('Error leyendo usuarios desde archivo:', error);
    }
    return usuariosIniciales;
};
//Esto guarda los usuarios que se registran y se envia a usuarios.json
const guardarUsuarios = (listaUsuarios) => {
    try {
        fs.writeFileSync(USUARIOS_FILE, JSON.stringify(listaUsuarios, null, 2), 'utf8');
    } catch (error) {
        console.error('Error guardando usuarios en archivo:', error);
    }
};
//Esto es la carpeta de noticias
const NOTICIAS_FILE = path.join(__dirname, 'noticias.json');
//Esto carga la noticia que haya en noticias.json
const cargarNoticias = () => {
    try {
        if (fs.existsSync(NOTICIAS_FILE)) {
            const contenido = fs.readFileSync(NOTICIAS_FILE, 'utf8');
            if (contenido) {
                return JSON.parse(contenido);
            }
        }
    } catch (error) {
        console.error('Error leyendo noticias desde archivo:', error);
    }
    return [];
};
//igual que en guardarUsuario este hace lo mismo
const guardarNoticias = (listaNoticias) => {
    try {
        fs.writeFileSync(NOTICIAS_FILE, JSON.stringify(listaNoticias, null, 2), 'utf8');
    } catch (error) {
        console.error('Error guardando noticias en archivo:', error);
    }
};
//Se crean los archivos para los docentes y las reseñas
const DOCENTES_FILE = path.join(__dirname, 'docentes.json');
const RESENAS_FILE = path.join(__dirname, 'resenas.json');
//Este carga a los docentes
const cargarDocentes = () => {
    try {
        if (fs.existsSync(DOCENTES_FILE)) {
            const contenido = fs.readFileSync(DOCENTES_FILE, 'utf8');
            if (contenido) return JSON.parse(contenido);
        }
    } catch (error) {
        console.error('Error leyendo docentes desde archivo:', error);
    }
    return [];
};
//guarda a los docentes
const guardarDocentes = (listaDocentes) => {
    try {
        fs.writeFileSync(DOCENTES_FILE, JSON.stringify(listaDocentes, null, 2), 'utf8');
    } catch (error) {
        console.error('Error guardando docentes en archivo:', error);
    }
};
//carga las reseñas
const cargarResenas = () => {
    try {
        if (fs.existsSync(RESENAS_FILE)) {
            const contenido = fs.readFileSync(RESENAS_FILE, 'utf8');
            if (contenido) return JSON.parse(contenido);
        }
    } catch (error) {
        console.error('Error leyendo reseñas desde archivo:', error);
    }
    return [];
};
//guarda las reseñas
const guardarResenas = (listaResenas) => {
    try {
        fs.writeFileSync(RESENAS_FILE, JSON.stringify(listaResenas, null, 2), 'utf8');
    } catch (error) {
        console.error('Error guardando reseñas en archivo:', error);
    }
};
//esto carga a los usuarios validando que el archivo exista y si no existe pues lo crea
const usuarios = cargarUsuarios();


if (!fs.existsSync(USUARIOS_FILE)) {
    guardarUsuarios(usuarios);
}

if (!fs.existsSync(NOTICIAS_FILE)) {
    guardarNoticias([]);
}

if (!fs.existsSync(DOCENTES_FILE)) {
    guardarDocentes([]);
}

if (!fs.existsSync(RESENAS_FILE)) {
    guardarResenas([]);
}
//Este es el que recibe el login que se registren los usuarios
app.post('/api/login', (req, res) => {
    // agarro las credenciales de la solicitud
    const { boleta, password, rol} = req.body;
    
    // busco un usuario que coincida
    const encontrado = usuarios.find(user =>
        user.boleta === boleta &&
        user.password === password &&
        user.rol === rol
    );
    
    // si coincide alguno. mando el usuario encontrado
    if (encontrado) {
        res.json({ success: true, usuario: encontrado });
    } else {
        // si no lo encuentro le mando un error
        res.status(401).json({success: false, message: "Credenciales Incorrectas"});
    }
});
//esto recibe el registro
app.post('/api/registro', (req, res) => {
    const { boleta, nombres, apellidoPaterno, apellidoMaterno, password, confirmarPassword, rol } = req.body;

    if (!boleta || !nombres || !apellidoPaterno || !apellidoMaterno || !password || !confirmarPassword || !rol) {
        return res.status(400).json({ success: false, message: 'Faltan campos obligatorios.' });
    }

    if (password !== confirmarPassword) {
        return res.status(400).json({ success: false, message: 'Las contraseñas no coinciden.' });
    }

    const existeUsuario = usuarios.some(user => user.boleta === boleta);
    if (existeUsuario) {
        return res.status(400).json({ success: false, message: 'Ya existe un usuario con ese número de boleta o trabajador.' });
    }

    const nuevoUsuario = {
        id: usuarios.length > 0 ? Math.max(...usuarios.map(user => Number(user.id))) + 1 : 1,
        boleta,
        password,
        rol,
        nombres,
        apellidoPaterno,
        apellidoMaterno,
        nombre: `${nombres} ${apellidoPaterno} ${apellidoMaterno}`.trim(),
    };

    usuarios.push(nuevoUsuario);
    guardarUsuarios(usuarios);

    res.json({ success: true, usuario: nuevoUsuario });
});
//esto manda los usuarios
app.get('/api/usuarios', (req, res) => {
    res.json({ success: true, data: usuarios });
});
//esto lo borra
app.delete('/api/usuarios/:id', (req, res) => {
    const id = Number(req.params.id);
    const index = usuarios.findIndex(user => user.id === id);
    if (index === -1) {
        return res.status(404).json({ success: false, message: 'Usuario no encontrado.' });
    }
    usuarios.splice(index, 1);
    guardarUsuarios(usuarios);
    res.json({ success: true });
});
//esto guarda las encuestas
app.post('/api/encuestas/guardar', (req, res) => {
    const { tipo, ...datos } = req.body;
    // Definimos el archivo según el tipo que venga del frontend
    let archivo = 'encuestas_general.json';
    if (tipo === "Baño") archivo = 'encuestas_bano.json';
    if (tipo === "Docente") archivo = 'encuestas_docentes.json';
    if (tipo === "Salón") archivo = 'encuestas_salones.json';
    if (tipo === "Laboratorio") archivo = 'encuestas_laboratorios.json';

    fs.readFile(archivo, 'utf8', (err, data) => {
        let lista = [];
        if (!err && data) lista = JSON.parse(data);
        
        lista.push({ ...datos, tipo, fecha: new Date().toISOString() });

        fs.writeFile(archivo, JSON.stringify(lista, null, 2), (err) => {
            if (err) return res.status(500).json({ success: false, message: "Error en disco" });
            res.json({ success: true, message: "Guardado en " + archivo });
        });
    });
});
// Ruta para obtener resultados de baños
app.get('/api/resultados/bano', (req, res) => {
    const archivo = 'encuestas_bano.json';

    fs.readFile(archivo, 'utf8', (err, data) => {
        if (err || !data) {
            // Si no hay datos, mandamos un array vacío pero con éxito
            return res.json({ success: true, data: [] });
        }

        const encuestas = JSON.parse(data);
        
        // Lógica para formatear datos para Recharts
        // Aquí sacamos el promedio de satisfacción general de todas las encuestas
        // Podrías profundizar más, pero por ahora mandamos el histórico
        const formatData = encuestas.map((e, index) => ({
            id: index,
            pregunta: `Encuesta ${index + 1}`,
            porcentaje: e.satisfaccion,
            usuario: e.nombre
        }));

        res.json({ success: true, data: formatData });
    });
});
// --- RUTA: GUARDAR ENCUESTA DOCENTE ---
app.post('/api/encuestas/docentes/guardar', (req, res) => {
    const nuevaEncuesta = req.body;
    const archivo = 'encuestas_docentes.json';

    fs.readFile(archivo, 'utf8', (err, data) => {
        let lista = [];
        if (!err && data) lista = JSON.parse(data);

        lista.push({ ...nuevaEncuesta, fecha: new Date().toISOString() });

        fs.writeFile(archivo, JSON.stringify(lista, null, 2), (err) => {
            if (err) return res.status(500).json({ success: false });
            res.json({ success: true });
        });
    });
});

// --- RUTA: OBTENER RESULTADOS DOCENTES ---
app.get('/api/resultados/docentes', (req, res) => {
    const archivo = 'encuestas_docentes.json';

    fs.readFile(archivo, 'utf8', (err, data) => {
        if (err || !data) return res.json({ success: true, data: [] });

        const encuestas = JSON.parse(data);
        
        // Formateamos para la gráfica
        const formatData = encuestas.map((e, index) => ({
            id: index,
            pregunta: `Evaluación ${index + 1}`,
            porcentaje: e.satisfaccion,
            estudiante: e.nombre
        }));

        res.json({ success: true, data: formatData });
    });
});
// --- RUTA: GUARDAR ENCUESTA SALONES ---
app.post('/api/encuestas/salones/guardar', (req, res) => {
    const nuevaEncuesta = req.body;
    const archivo = 'encuestas_salones.json';

    fs.readFile(archivo, 'utf8', (err, data) => {
        let lista = [];
        if (!err && data) lista = JSON.parse(data);
        lista.push({ ...nuevaEncuesta, fecha: new Date().toISOString() });

        fs.writeFile(archivo, JSON.stringify(lista, null, 2), (err) => {
            if (err) return res.status(500).json({ success: false });
            res.json({ success: true });
        });
    });
});

// --- RUTA: OBTENER RESULTADOS SALONES ---
app.get('/api/resultados/salones', (req, res) => {
    const archivo = 'encuestas_salones.json';

    fs.readFile(archivo, 'utf8', (err, data) => {
        if (err || !data) return res.json({ success: true, data: [] });
        const encuestas = JSON.parse(data);
        
        const formatData = encuestas.map((e, index) => ({
            id: index,
            pregunta: `Salón Eval. ${index + 1}`,
            porcentaje: e.satisfaccion
        }));
        res.json({ success: true, data: formatData });
    });
});
// --- RUTA: OBTENER Y ELIMINAR ENCUESTAS CONTESTADAS ---
app.get('/api/admin/encuestas/:tipo', (req, res) => {
    const { tipo } = req.params;
    const archivos = {
        bano: 'encuestas_bano.json',
        docentes: 'encuestas_docentes.json',
        salones: 'encuestas_salones.json',
        laboratorios: 'encuestas_laboratorios.json'
    };
    
    const archivo = archivos[tipo];
    if (!archivo) return res.status(400).json({ success: false, message: 'Tipo inválido' });

    fs.readFile(archivo, 'utf8', (err, data) => {
        if (err || !data) return res.json({ success: true, data: [] });
        const encuestas = JSON.parse(data);
        res.json({ success: true, data: encuestas });
    });
});

app.delete('/api/admin/encuestas/:tipo/:index', (req, res) => {
    const { tipo, index } = req.params;
    const archivos = {
        bano: 'encuestas_bano.json',
        docentes: 'encuestas_docentes.json',
        salones: 'encuestas_salones.json',
        laboratorios: 'encuestas_laboratorios.json'
    };
    
    const archivo = archivos[tipo];
    if (!archivo) return res.status(400).json({ success: false, message: 'Tipo inválido' });

    fs.readFile(archivo, 'utf8', (err, data) => {
        if (err || !data) return res.status(404).json({ success: false, message: 'No hay datos' });
        
        let encuestas = JSON.parse(data);
        const idx = parseInt(index, 10);
        
        if (idx >= 0 && idx < encuestas.length) {
            encuestas.splice(idx, 1);
            fs.writeFile(archivo, JSON.stringify(encuestas, null, 2), (err) => {
                if (err) return res.status(500).json({ success: false, message: 'Error guardando' });
                res.json({ success: true, message: 'Eliminada correctamente' });
            });
        } else {
            res.status(400).json({ success: false, message: 'Índice inválido' });
        }
    });
});

// --- RUTA: GUARDAR ENCUESTA LABORATORIOS ---
app.post('/api/encuestas/laboratorios/guardar', (req, res) => {
    const nuevaEncuesta = req.body;
    const archivo = 'encuestas_laboratorios.json';

    fs.readFile(archivo, 'utf8', (err, data) => {
        let lista = [];
        if (!err && data) lista = JSON.parse(data);
        lista.push({ ...nuevaEncuesta, fecha: new Date().toISOString() });

        fs.writeFile(archivo, JSON.stringify(lista, null, 2), (err) => {
            if (err) return res.status(500).json({ success: false });
            res.json({ success: true });
        });
    });
});

// --- RUTA: OBTENER RESULTADOS LABORATORIOS ---
app.get('/api/resultados/laboratorios', (req, res) => {
    const archivo = 'encuestas_laboratorios.json';

    fs.readFile(archivo, 'utf8', (err, data) => {
        if (err || !data) return res.json({ success: true, data: [] });
        
        try {
            const encuestas = JSON.parse(data);
            
            // IMPORTANTE: Aseguramos que 'porcentaje' sea un número real
            const formatData = encuestas.map((e, index) => ({
                id: index,
                pregunta: `Evaluación ${index + 1}`,
                porcentaje: Number(e.satisfaccion) || 0 // Si no hay dato, ponemos 0
            }));

            res.json({ success: true, data: formatData });
        } catch {
            res.json({ success: true, data: [] });
        }
    });
});

app.get('/api/noticias', (req, res) => {
    try {
        const noticias = cargarNoticias();
        res.json({ success: true, data: noticias });
    } catch (error) {
        console.error('Error obteniendo noticias:', error);
        res.status(500).json({ success: false, message: 'Error obteniendo noticias.' });
    }
});

app.post('/api/noticias', (req, res) => {
    const { titulo, descripcion, imagenData, autor } = req.body;
    if (!descripcion || !descripcion.trim()) {
        return res.status(400).json({ success: false, message: 'La descripción es obligatoria.' });
    }

    const noticias = cargarNoticias();
    const nuevoId = noticias.length > 0 ? Math.max(...noticias.map((item) => Number(item.id))) + 1 : 1;
    const nuevaNoticia = {
        id: nuevoId,
        titulo: titulo && titulo.trim() ? titulo.trim() : `Noticia ${nuevoId}`,
        descripcion: descripcion.trim(),
        imagenData: imagenData || '',
        autor: autor || 'Administrador',
        fecha: new Date().toISOString(),
    };

    noticias.unshift(nuevaNoticia);
    guardarNoticias(noticias);
    res.json({ success: true, data: nuevaNoticia });
});

app.delete('/api/noticias/:id', (req, res) => {
    const id = Number(req.params.id);
    const noticias = cargarNoticias();
    const filtradas = noticias.filter((item) => Number(item.id) !== id);
    if (filtradas.length === noticias.length) {
        return res.status(404).json({ success: false, message: 'Noticia no encontrada.' });
    }

    guardarNoticias(filtradas);
    res.json({ success: true });
});

app.get('/api/docentes', (req, res) => {
    try {
        const docentes = cargarDocentes();
        res.json({ success: true, data: docentes });
    } catch (error) {
        console.error('Error obteniendo docentes:', error);
        res.status(500).json({ success: false, message: 'Error obteniendo docentes.' });
    }
});

app.post('/api/docentes', (req, res) => {
    const { nombre, carreras, materias, fotoData, creadoPor } = req.body;
    if (!nombre || !materias || materias.length === 0) {
        return res.status(400).json({ success: false, message: 'El nombre y las materias son obligatorias.' });
    }

    const docentes = cargarDocentes();
    const nuevoId = docentes.length > 0 ? Math.max(...docentes.map((item) => Number(item.id))) + 1 : 1;
    const nuevoDocente = {
        id: nuevoId,
        nombre: nombre.trim(),
        carreras: Array.isArray(carreras) ? carreras : [],
        materias: Array.isArray(materias) ? materias : [],
        fotoData: fotoData || '',
        creadoPor: creadoPor || 'Administrador',
        fecha: new Date().toISOString(),
    };

    docentes.push(nuevoDocente);
    guardarDocentes(docentes);
    res.json({ success: true, data: nuevoDocente });
});

app.put('/api/docentes/:id', (req, res) => {
    const id = Number(req.params.id);
    const { nombre, carreras, materias, fotoData, creadoPor } = req.body;
    const docentes = cargarDocentes();
    const index = docentes.findIndex((docente) => Number(docente.id) === id);
    if (index === -1) {
        return res.status(404).json({ success: false, message: 'Docente no encontrado.' });
    }

    docentes[index] = {
        ...docentes[index],
        nombre: nombre.trim(),
        carreras: Array.isArray(carreras) ? carreras : [],
        materias: Array.isArray(materias) ? materias : [],
        fotoData: fotoData || '',
        creadoPor: creadoPor || docentes[index].creadoPor,
    };

    guardarDocentes(docentes);
    res.json({ success: true, data: docentes[index] });
});

app.delete('/api/docentes/:id', (req, res) => {
    const id = Number(req.params.id);
    const docentes = cargarDocentes();
    const filtrados = docentes.filter((item) => Number(item.id) !== id);
    if (filtrados.length === docentes.length) {
        return res.status(404).json({ success: false, message: 'Docente no encontrado.' });
    }

    guardarDocentes(filtrados);
    res.json({ success: true });
});

app.get('/api/resenas', (req, res) => {
    try {
        const resenas = cargarResenas();
        res.json({ success: true, data: resenas });
    } catch (error) {
        console.error('Error obteniendo rese�as:', error);
        res.status(500).json({ success: false, message: 'Error obteniendo rese�as.' });
    }
});

app.post('/api/resenas', (req, res) => {
    const { docenteId, titulo, descripcion, estrellas, autor } = req.body;
    if (!docenteId || !titulo || !descripcion || !estrellas) {
        return res.status(400).json({ success: false, message: 'Todos los campos son obligatorios.' });
    }

    const resenas = cargarResenas();
    const nuevoId = resenas.length > 0 ? Math.max(...resenas.map((item) => Number(item.id))) + 1 : 1;
    const nuevaResena = {
        id: nuevoId,
        docenteId: Number(docenteId),
        titulo: titulo.trim(),
        descripcion: descripcion.trim(),
        estrellas: Number(estrellas),
        autor: autor || 'An�nimo',
        fecha: new Date().toISOString(),
    };

    resenas.push(nuevaResena);
    guardarResenas(resenas);
    res.json({ success: true, data: nuevaResena });
});

app.delete('/api/resenas/:id', (req, res) => {
    const id = Number(req.params.id);
    const resenas = cargarResenas();
    const filtradas = resenas.filter((item) => Number(item.id) !== id);
    if (filtradas.length === resenas.length) {
        return res.status(404).json({ success: false, message: 'Rese�a no encontrada.' });
    }

    guardarResenas(filtradas);
    res.json({ success: true });
});
//estoy iniciando el servidor en el puerto que se definio arriba y ya
app.listen(PORT, () => {
    console.log(`Servidor Corriendo en http://localhost:${PORT}`);
});