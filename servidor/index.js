/**
 * Servidor de Autenticación - Rendimiento y Satisfacción
 * 
 * Este archivo configura un servidor Express que maneja la autenticación de usuarios.
 * Soporta tres roles: Alumno, Docente y Administrador.
 * 
 * Endpoint disponible:
 * - POST /api/login: Valida credenciales de usuario
 */

// Importa el framework Express para crear el servidor web
import express from 'express';
// Importa CORS para permitir solicitudes desde diferentes orígenes
import cors from 'cors';

// Crea una instancia de la aplicación Express
const app = express();
// Puerto en el que escucha el servidor
const PORT = 3000;

// Middleware que permite solicitudes desde diferentes orígenes (CORS)
app.use(cors());
// Middleware que parsea las solicitudes JSON al cuerpo de la solicitud
app.use(express.json());

/**
 * Array de usuarios de prueba con diferentes roles
 * 
 * Estructura de cada usuario:
 * - id: Identificador único del usuario
 * - boleta: Número de boleta o usuario para login
 * - password: Contraseña del usuario
 * - rol: Tipo de usuario (Alumno, Docente, Administrador)
 * - nombre: Nombre completo del usuario
 */
const usuarios = [
    {id: 1, boleta: "20230001", password: "123", rol: "Alumno", nombre: "el Chom"},
    {id: 2, boleta: "profesor", password: "456", rol: "Docente", nombre: "Don Baraja"},
    {id: 3, boleta: "admin01", password: "789", rol: "Administrador", nombre: "Admin"},
];

app.post('/api/login', (req, res) => {
    // Extrae las credenciales del cuerpo de la solicitud
    const { boleta, password, rol} = req.body;
    
    // Busca un usuario que coincida con boleta, contraseña y rol
    const encontrado = usuarios.find(user =>
        user.boleta === boleta &&
        user.password === password &&
        user.rol === rol
    );
    
    // Si se encuentra el usuario, retorna exitoso con los datos
    if (encontrado) {
        res.json({ success: true, usuario: encontrado });
    } else {
        // Si no se encuentra, retorna error 401 sin autorización
        res.status(401).json({success: false, message: "Credenciales Incorrectas"});
    }
});

/**
 * Inicia el servidor en el puerto especificado
 * Muestra un mensaje en consola cuando el servidor está listo
 */
app.listen(PORT, () => {
    console.log(`Servidor Corriendo en http://localhost:${PORT}`);
});