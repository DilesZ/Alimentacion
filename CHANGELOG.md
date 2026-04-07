# CHANGELOG

Historial secuencial del proyecto para reanudar el trabajo sin depender del contexto conversacional.

## Enlaces cruzados

- Documento de estado general: [README.md](./README.md)
- Bitacora exhaustiva: [docs/registro-continuidad.md](./docs/registro-continuidad.md)
- Documentacion tecnica: [docs/tecnica.md](./docs/tecnica.md)
- Manual funcional: [docs/manual-usuario.md](./docs/manual-usuario.md)
- Mantenimiento operativo: [docs/mantenimiento.md](./docs/mantenimiento.md)

## Formato de registro

Cada entrada se numera de forma secuencial, incluye timestamp, contexto previo, cambios realizados, razon tecnica, impacto y estado resultante. Cuando el detalle completo es demasiado extenso, este archivo resume y delega el desglose exhaustivo a `docs/registro-continuidad.md`.

## [0004] 2026-04-07 21:39:35 +02:00 - feat: reestructurar la SPA en paginas especializadas

### Contexto previo

La aplicacion concentraba toda la experiencia en `src/App.tsx`, sin rutas independientes ni separacion clara entre planificacion, recetas, calendario y compras.

### Cambios realizados

- `package.json` y `package-lock.json`: se anade `react-router-dom` para routing cliente.
- `src/App.tsx`: se sustituye la vista monolitica por un router con lazy loading de paginas.
- `src/app/PlannerProvider.tsx`: se crea estado compartido para parametros, errores y plan mensual.
- `src/components/MainLayout.tsx`: se crea layout global con menu responsive, hamburguesa y breadcrumbs.
- `src/pages/HomePage.tsx`: nueva portada con dashboard y generacion del plan.
- `src/pages/RecipesPage.tsx`: nueva pagina de recetas con busqueda y filtros.
- `src/pages/CalendarPage.tsx`: nueva pagina de calendario semanal con drag and drop nativo.
- `src/pages/ShoppingPage.tsx`: nueva pagina de compras con carrito y checkout.
- `src/app/usePageMeta.ts`, `src/lib/media.ts`, `index.html` y `src/styles.css`: se anaden meta tags dinamicos, ilustraciones SVG locales, base SEO y responsive completo por breakpoints.

### Razones del cambio

- Mejorar la usabilidad separando tareas complejas en vistas especializadas.
- Dar a cada area funcional su propia URL y contexto de navegacion.
- Preparar una base mas escalable para evolucionar la app y mejorar rendimiento.

### Problemas resueltos

- Saturacion funcional de una sola pantalla.
- Ausencia de navegacion responsive y de ubicacion contextual del usuario.
- Falta de vistas dedicadas para compra, recetas y calendario.

### Dependencias y configuracion

- Dependencias anadidas: `react-router-dom`.
- Configuraciones alteradas: `index.html`, `package.json`, `package-lock.json`, `src/styles.css`.

### Estado del proyecto

- La aplicacion queda organizada en rutas `/`, `/recetas`, `/calendario` y `/compras`.
- El build queda validado correctamente con `powershell -NoProfile -Command "npm.cmd run build"`.
- Queda lista para commit y publicacion remota.

## [0003] 2026-04-07 21:18:29 +02:00 - docs: implantar sistema de continuidad documental

### Contexto previo

El proyecto tenia documentacion funcional, tecnica y operativa, pero no existia una bitacora persistente de continuidad preparada para cortes de suministro o cierres abruptos de la sesion.

### Cambios realizados

- `README.md`: lineas 1-fin, reescritura integral para incluir estado actual, protocolo de continuidad, enlaces cruzados y proximos pasos.
- `CHANGELOG.md`: lineas 1-fin, alta de historial secuencial y resumido.
- `docs/registro-continuidad.md`: lineas 1-fin, alta de bitacora exhaustiva con reconstruccion historica.

### Razones del cambio

- Evitar perdida de contexto tras apagones o interrupciones.
- Dejar trazabilidad operativa usando solo archivos del repositorio.
- Establecer un punto unico de verdad para estado, historial y reanudacion.

### Problemas resueltos

- Falta de registro secuencial de modificaciones.
- Ausencia de una guia de continuidad para el siguiente operador.
- Falta de enlaces cruzados entre documentos de estado e historial.

### Dependencias y configuracion

- Dependencias anadidas o eliminadas: ninguna.
- Configuraciones alteradas: ninguna de ejecucion; solo se anade estructura documental.

### Estado del proyecto

- Aplicacion funcional sin cambios de logica.
- Repositorio documentado para continuidad inmediata.
- Build validado correctamente con `powershell -NoProfile -Command "npm.cmd run build"`.
- Quedan cambios documentales locales pendientes de commit.
- Siguiente referencia recomendada: `docs/registro-continuidad.md`.

## [0002] 2026-04-07 21:01:44 +02:00 - chore: ignore local vercel env files

### Contexto previo

El proyecto ya contaba con la aplicacion inicial y necesitaba ajustar el control de archivos locales generados por despliegue o configuraciones privadas.

### Cambios realizados

- `.gitignore`: se anaden exclusiones para `.vercel` y `*.env.local` en el tramo final del archivo.

### Razones del cambio

- Evitar subir configuracion local sensible o ruido de despliegue.
- Mantener el repositorio limpio al trabajar con Vercel.

### Problemas resueltos

- Riesgo de versionar archivos locales de entorno.
- Posible contaminacion del historial con artefactos no compartibles.

### Dependencias y configuracion

- Dependencias anadidas o eliminadas: ninguna.
- Configuraciones alteradas: reglas de ignorado Git para entorno local.

### Estado del proyecto

- La aplicacion permanece igual a nivel funcional.
- El control de versiones queda mas seguro para despliegues locales.

## [0001] 2026-04-07 20:56:54 +02:00 - feat: initial nutrition planner app

### Contexto previo

Arranque del repositorio con la primera version funcional del planificador nutricional.

### Cambios realizados

- Se crean la base de la SPA en React, TypeScript y Vite.
- Se anaden interfaz, motor de generacion, catalogo local, tipos y estilos.
- Se incorpora documentacion tecnica, manual de usuario y mantenimiento.
- Se configura build, TypeScript, Vite y dependencias iniciales.

### Razones del cambio

- Construir un MVP autosuficiente sin depender de APIs externas.
- Permitir generacion mensual de menus, validacion nutricional y lista de compra.
- Preparar despliegue estatico y mantenimiento local del catalogo.

### Problemas resueltos

- Ausencia total de producto inicial.
- Falta de una base local para precios, recetas y disponibilidad.
- Falta de documentacion minima de uso y mantenimiento.

### Dependencias y configuracion

- Dependencias runtime anadidas: `react`, `react-dom`, `recharts`.
- Dependencias de desarrollo anadidas: `typescript`, `vite`, `@vitejs/plugin-react`, `@types/react`, `@types/react-dom`.
- Configuraciones alteradas: `package.json`, `tsconfig.json`, `tsconfig.node.json`, `vite.config.ts`, `.gitignore`.

### Estado del proyecto

- Queda disponible una primera version utilizable del planificador nutricional.
- El detalle exhaustivo de archivos y decisiones tecnicas queda registrado en `docs/registro-continuidad.md`.
