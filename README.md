# Planificador Nutricional Saludable

Aplicacion web en React + TypeScript para generar planes mensuales de alimentacion saludable con validacion nutricional, recetas, lista de compra y estimacion de coste para Mercadona y Consum de Paiporta.

## Documentacion de continuidad

Este repositorio incluye un sistema de documentacion preparado para apagones, cortes de sesion o retomadas sin contexto previo.

- `CHANGELOG.md`: historial secuencial de cambios del proyecto con contexto, archivos afectados y estado resultante.
- `docs/registro-continuidad.md`: bitacora exhaustiva para reanudar el trabajo usando solo el repositorio y esta documentacion.
- `docs/tecnica.md`: arquitectura, algoritmo y decisiones de implementacion.
- `docs/manual-usuario.md`: uso funcional de la aplicacion.
- `docs/mantenimiento.md`: mantenimiento operativo de precios, disponibilidad y datos.

Regla de continuidad para futuros cambios:

1. Registrar una nueva entrada numerada y timestampada en `docs/registro-continuidad.md`.
2. Reflejar el mismo cambio en `CHANGELOG.md`.
3. Actualizar este `README.md` si cambia el estado general del proyecto, la arquitectura, las dependencias o la configuracion.

## Estado del proyecto

- Tipo de aplicacion: SPA con Vite, React 18, TypeScript y `react-router-dom`.
- Arquitectura actual: aplicacion dividida en paginas independientes con routing cliente.
- Rutas principales: `/`, `/dashboard`, `/recetas`, `/calendario` y `/compras`.
- Estado funcional: genera planes de 30 o 31 dias con 5 comidas por dia y los distribuye en vistas especializadas.
- Cobertura actual: calorias, macronutrientes y micronutrientes principales.
- Fuente de datos: catalogo local en `src/data/catalog.ts`.
- Integraciones externas: validacion cliente de disponibilidad de video YouTube cuando existe ID configurado.
- Despliegue previsto: hosting estatico compatible con Vite.
- UX actual: menu responsive con hamburguesa, breadcrumbs, dashboard demo, transiciones suaves, hover states y layouts adaptativos por breakpoint.
- Rendimiento actual: lazy loading de paginas, galerias e iframes, imagenes SVG generadas localmente, metadatos dinamicos por ruta, `service worker` basico y build validado.
- Validacion actual: build verificado correctamente con `powershell -NoProfile -Command "npm.cmd run build"`.

## Contexto previo

El proyecto nacio como una SPA monolitica concentrada en `src/App.tsx`, con una sola vista que mezclaba generacion del plan, recetas, calendario y compra mensual. Posteriormente se anadio una bitacora de continuidad para registrar cada cambio y facilitar la reanudacion tras interrupciones.

## Cambios realizados

- Se divide la aplicacion en paginas independientes: inicio, recetas, calendario y compras.
- Se incorpora navegacion responsive con menu principal, hamburguesa para movil y breadcrumbs.
- Se anade estado compartido del plan mensual para reutilizar la misma generacion en todas las vistas.
- Se implementan metadatos por ruta, lazy loading de paginas e imagenes y una base de optimizacion para carga rapida.
- Se anade un dashboard local de usuario con favoritos, historial y recetas descargadas.
- Se amplian las recetas con porciones, conversion metrica/imperial, rating por estrellas, comentarios, temporizador, galeria por pasos y lista inteligente de compra.
- Se activa soporte offline basico con `service worker` y manifiesto web.
- Se mantiene la capa documental de continuidad con enlaces cruzados entre `README.md`, `CHANGELOG.md` y `docs/registro-continuidad.md`.

## Arranque local

```bash
npm install
npm run dev
```

## Build de produccion

```bash
npm run build
```

## Dependencias y configuracion actual

- Dependencias runtime: `react`, `react-dom`, `react-router-dom`, `recharts`.
- Dependencias de desarrollo: `typescript`, `vite`, `@vitejs/plugin-react`, `@types/react`, `@types/react-dom`.
- Scripts disponibles:
  - `npm run dev`
  - `npm run build`
  - `npm run preview`
- Configuracion relevante:
  - `index.html` con metadatos base SEO y responsive.
  - `tsconfig.json` y `tsconfig.node.json` para compilacion TypeScript.
  - `vite.config.ts` para la configuracion del bundler.
  - `.gitignore` preparado para excluir `node_modules`, `dist`, `.vercel`, archivos `*.tsbuildinfo` y entornos locales `*.env.local`.

## Estructura clave

- `src/App.tsx`: router principal con carga diferida de paginas.
- `src/app/PlannerProvider.tsx`: estado compartido del plan mensual y parametros del generador.
- `src/app/UserPreferencesProvider.tsx`: persistencia local de usuario demo, favoritos, historial, descargas, ratings, comentarios y lista inteligente.
- `src/app/usePageMeta.ts`: metadatos por ruta y precarga de recursos criticos.
- `src/components/MainLayout.tsx`: layout global con menu principal, hamburguesa y breadcrumbs.
- `src/data/catalog.ts`: catalogo local de alimentos, precios, disponibilidad y recetas.
- `src/lib/generator.ts`: motor de generacion de menus, validacion, boosters y compra.
- `src/lib/media.ts`: ilustraciones SVG locales para paginas y recetas.
- `src/lib/nutrition.ts`: objetivos diarios, agregacion y utilidades nutricionales.
- `src/pages/HomePage.tsx`: dashboard principal y generacion del plan.
- `src/pages/DashboardPage.tsx`: panel personalizado con favoritos, historial y descargadas.
- `src/pages/RecipesPage.tsx`: buscador avanzado, detalle interactivo, comentarios, rating, video, galeria y temporizador.
- `src/pages/CalendarPage.tsx`: planificacion semanal con drag and drop.
- `src/pages/ShoppingPage.tsx`: carrito, checkout y combinacion con lista inteligente desde recetas.
- `src/types.ts`: tipos compartidos del dominio.
- `docs/tecnica.md`: detalle tecnico de arquitectura y algoritmo.
- `docs/manual-usuario.md`: guia funcional para uso diario.
- `docs/mantenimiento.md`: proceso de actualizacion de precios y surtido.
- `docs/registro-continuidad.md`: bitacora de continuidad del trabajo.
- `CHANGELOG.md`: historial resumido y enlazado.

## Proximos pasos pendientes

- Verificar el flujo de despliegue real en Vercel o plataforma equivalente.
- Persistir cambios manuales del calendario y del carrito entre sesiones.
- Evaluar persistencia de datos y cuentas de usuario.
- Definir una estrategia de actualizacion semiautomatica del catalogo de supermercados.
- Valorar exportacion a PDF del plan mensual y de la lista de compra.
- Revisar si conviene separar el catalogo nutricional y el de precios en archivos independientes.
