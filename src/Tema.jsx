/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useEffect } from "react";

// Contexto global para el tema de la aplicación
export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    // Inicializa el tema desde localStorage para persistencia entre recargas
    const [EsOscuro, setEsOscuro] = useState(() => {
        const temaGuardado = localStorage.getItem('temaApp');
        return temaGuardado ? temaGuardado === 'dark' : false;
    });

    const toggleTheme = () => {
        setEsOscuro((prev) => !prev);
    };

    useEffect(() => {
        const tema = EsOscuro ? 'dark' : 'light';
        document.body.setAttribute('data-theme', tema);
        localStorage.setItem('temaApp', tema);
    }, [EsOscuro]);

    return (
        <ThemeContext.Provider value={{ EsOscuro, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};