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

- Tipo de aplicacion: SPA con Vite, React 18 y TypeScript.
- Estado funcional: genera planes de 30 o 31 dias con 5 comidas por dia.
- Cobertura actual: calorias, macronutrientes y micronutrientes principales.
- Fuente de datos: catalogo local en `src/data/catalog.ts`.
- Integraciones externas: ninguna en tiempo real.
- Despliegue previsto: hosting estatico compatible con Vite.
- Estado Git de referencia antes de esta actualizacion documental: rama `main` alineada con `origin/main` y sin cambios locales pendientes.
- Estado Git actual: cambios documentales locales en `README.md`, `CHANGELOG.md` y `docs/registro-continuidad.md` pendientes de commit.
- Validacion actual: build verificado correctamente con `powershell -NoProfile -Command "npm.cmd run build"`.

## Contexto previo

El proyecto ya contaba con una primera version funcional y con tres documentos de apoyo (`docs/tecnica.md`, `docs/manual-usuario.md` y `docs/mantenimiento.md`), pero no tenia una bitacora persistente que dejara trazabilidad completa de cada modificacion para continuar tras una interrupcion brusca.

## Cambios realizados

- Se implanta una capa de continuidad documental con enlaces cruzados entre `README.md`, `CHANGELOG.md` y `docs/registro-continuidad.md`.
- Se conserva la documentacion tecnica y operativa ya existente como referencia especializada.
- Se define un protocolo explicito para registrar futuros cambios sin depender del contexto conversacional.

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

- Dependencias runtime: `react`, `react-dom`, `recharts`.
- Dependencias de desarrollo: `typescript`, `vite`, `@vitejs/plugin-react`, `@types/react`, `@types/react-dom`.
- Scripts disponibles:
  - `npm run dev`
  - `npm run build`
  - `npm run preview`
- Configuracion relevante:
  - `tsconfig.json` y `tsconfig.node.json` para compilacion TypeScript.
  - `vite.config.ts` para la configuracion del bundler.
  - `.gitignore` preparado para excluir `node_modules`, `dist`, `.vercel`, archivos `*.tsbuildinfo` y entornos locales `*.env.local`.

## Estructura clave

- `src/App.tsx`: interfaz principal y paneles de resultados.
- `src/data/catalog.ts`: catalogo local de alimentos, precios, disponibilidad y recetas.
- `src/lib/generator.ts`: motor de generacion de menus, validacion, boosters y compra.
- `src/lib/nutrition.ts`: objetivos diarios, agregacion y utilidades nutricionales.
- `src/types.ts`: tipos compartidos del dominio.
- `docs/tecnica.md`: detalle tecnico de arquitectura y algoritmo.
- `docs/manual-usuario.md`: guia funcional para uso diario.
- `docs/mantenimiento.md`: proceso de actualizacion de precios y surtido.
- `docs/registro-continuidad.md`: bitacora de continuidad del trabajo.
- `CHANGELOG.md`: historial resumido y enlazado.

## Proximos pasos pendientes

- Verificar el flujo de despliegue real en Vercel o plataforma equivalente.
- Crear commit para consolidar la nueva documentacion de continuidad.
- Evaluar persistencia de datos y cuentas de usuario.
- Definir una estrategia de actualizacion semiautomatica del catalogo de supermercados.
- Valorar exportacion a PDF del plan mensual y de la lista de compra.
- Revisar si conviene separar el catalogo nutricional y el de precios en archivos independientes.
