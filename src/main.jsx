/**
 * ARCHIVO: main.jsx
 * Descripción: Punto de entrada de la aplicación React
 * 
 * Qué hace:
 *   - Importa las dependencias necesarias de React
 *   - Importa los estilos globales (index.css)
 *   - Importa el componente principal App.jsx
 *   - Renderiza la aplicación en el DOM usando createRoot
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

/**
 * FUNCIÓN: Renderización en DOM
 * Qué hace:
 *   - Obtiene el elemento HTML con id 'root' del archivo index.html
 *   - Crea un punto de entrada para React en ese elemento
 *   - Envuelve la aplicación en StrictMode para detectar problemas en desarrollo
 *   - Renderiza el componente App como raíz de la aplicación
 * 
 * Recibe: 
 *   - Elemento DOM con id 'root' (debe existir en index.html)
 *   - Componente App para renderizar
 * 
 * Retorna: No retorna nada (efectúa el renderizado directo en el DOM)
 */
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
