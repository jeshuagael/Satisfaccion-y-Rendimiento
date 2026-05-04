# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Tema Claro/Oscuro de la aplicación

Esta aplicación ahora incluye un selector global de tema con los siguientes comportamientos:

- El botón se muestra siempre en la esquina superior derecha.
- Si el modo actual es claro, el botón muestra un sol `☀️`.
- Si el modo actual es oscuro, el botón muestra una luna `🌙`.
- El tema se guarda en `localStorage` para conservar la preferencia cuando recargues la página.
- Los estilos de la interfaz se adaptan a temas claros y oscuros.

Los archivos relevantes son:

- `src/Tema.jsx`: proveedor de contexto y persistencia del tema.
- `src/main.jsx`: envuelve la aplicación con el `ThemeProvider`.
- `src/App.jsx`: botón de alternancia de tema global.
- `src/App.css`: estilos del botón de tema y ajustes de diseño para cada tema.

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
