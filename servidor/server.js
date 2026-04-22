/**
 Servidor de Express para manejar todo el loguin y la autenticacion de los usuarios
 */

// importe express que es el servidor
import express from 'express';
import fs from 'fs';
// importe cors para las solicitudes
import cors from 'cors';
// cree una instancia al servidor de express, sease conecte el loguin a express
const app = express();
// este es el puerto donde el servidor funciona
const PORT = 4500;
app.use(cors());
// esto es pa q el server entienda las solicitudes en el formato json
app.use(express.json());
// creo el array de usuarios con sus datos pa autenticar 
const usuarios = [
    {id: 1, boleta: "20230001", password: "123", rol: "Alumno", nombre: "el Chom"},
        {id: 1.2, boleta: "20230002", password: "123", rol: "Alumno", nombre: "el Mateo"},

    {id: 2, boleta: "profesor", password: "456", rol: "Docente", nombre: "Don Baraja"},
        {id: 2.2, boleta: "lic", password: "456", rol: "Docente", nombre: "Don Edahi"},

    {id: 3, boleta: "admin01", password: "789", rol: "Administrador", nombre: "Admin"},
];

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
//estoy iniciando el servidor en el puerto que se definio arriba y ya
app.listen(PORT, () => {
    console.log(`Servidor Corriendo en http://localhost:${PORT}`);
});