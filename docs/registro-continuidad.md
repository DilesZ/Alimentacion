# Registro de continuidad del proyecto

Bitacora exhaustiva para continuar el trabajo usando solo el repositorio y esta documentacion. Este archivo complementa a [README.md](../README.md) y [CHANGELOG.md](../CHANGELOG.md).

## Instrucciones de uso

1. Leer primero `README.md` para conocer el estado general.
2. Revisar `CHANGELOG.md` para ubicar la ultima entrada numerada.
3. Abrir este archivo y continuar desde la entrada mas reciente.
4. Para cualquier cambio futuro, anadir una nueva entrada secuencial con el mismo formato.

## Plantilla obligatoria para futuras entradas

### [NNNN] YYYY-MM-DD HH:MM:SS +/-ZZ:ZZ - tipo: resumen breve

#### Contexto previo

Describir el estado exacto antes del cambio.

#### Cambios realizados

- Archivo: ``ruta/al/archivo``
- Lineas afectadas: `X-Y` o `1-fin`
- Tipo de cambio: alta, edicion, borrado, renombre o reestructuracion
- Detalle tecnico: que se modifico exactamente

#### Razones del cambio

- Motivo funcional, tecnico u operativo.

#### Problemas resueltos

- Incidencias, riesgos o bloqueos mitigados.

#### Decisiones tecnicas tomadas

- Decisiones de arquitectura, formato, datos o flujo de trabajo.

#### Dependencias anadidas o eliminadas

- Listar paquetes o indicar `ninguna`.

#### Configuraciones alteradas

- Listar archivos de configuracion o indicar `ninguna`.

#### Proximos pasos pendientes

- Trabajo recomendado para la siguiente sesion.

#### Estado del proyecto

- Estado funcional y operativo al cerrar la entrada.

---

## [0003] 2026-04-07 21:18:29 +02:00 - docs: implantar sistema de continuidad documental

### Contexto previo

El repositorio ya contenia una aplicacion funcional y tres documentos de apoyo:

- `docs/tecnica.md`
- `docs/manual-usuario.md`
- `docs/mantenimiento.md`

Sin embargo, no existia una bitacora secuencial que recogiera cada modificacion con suficiente detalle para continuar el trabajo despues de un apagon o una interrupcion de sesion. La reanudacion dependia demasiado del contexto de chat o del recuerdo del ultimo operador.

### Cambios realizados

- Archivo: `README.md`
- Lineas afectadas: `1-fin`
- Tipo de cambio: edicion integral
- Detalle tecnico: se reescribe el documento para incorporar `Documentacion de continuidad`, `Estado del proyecto`, `Contexto previo`, `Cambios realizados`, `Dependencias y configuracion actual`, `Estructura clave` y `Proximos pasos pendientes`.

- Archivo: `CHANGELOG.md`
- Lineas afectadas: `1-fin`
- Tipo de cambio: alta
- Detalle tecnico: se crea un historial secuencial enlazado con resumen por entrada, timestamps y estado resultante.

- Archivo: `docs/registro-continuidad.md`
- Lineas afectadas: `1-fin`
- Tipo de cambio: alta
- Detalle tecnico: se crea la bitacora exhaustiva con plantilla de uso y reconstruccion historica de cambios previos.

### Razones del cambio

- Necesidad explicita de que cualquier respuesta pueda ser la ultima.
- Falta de un mecanismo local y persistente para retomar el trabajo sin contexto previo.
- Conveniencia de separar:
  - estado general en `README.md`;
  - historial resumido en `CHANGELOG.md`;
  - trazabilidad exhaustiva en `docs/registro-continuidad.md`.

### Problemas resueltos

- Ausencia de una ruta clara de reanudacion.
- Falta de registro timestampado y numerado de cambios.
- Falta de enlaces cruzados entre la documentacion de producto, tecnica e historica.

### Decisiones tecnicas tomadas

- Mantener la documentacion especializada existente y anadir una capa transversal de continuidad.
- Usar numeracion secuencial manual (`0001`, `0002`, `0003`) para facilitar seguimiento sin herramientas externas.
- Registrar lineas como `1-fin` cuando el archivo es nuevo o se reescribe por completo, evitando fingir precision inexistente.
- Reconstruir las entradas historicas a partir del historial Git disponible y del estado actual del arbol.

### Dependencias anadidas o eliminadas

- Ninguna.

### Configuraciones alteradas

- Ninguna de ejecucion.
- Solo se altera la documentacion del repositorio.

### Proximos pasos pendientes

- Revisar si conviene enlazar tambien esta bitacora desde los otros documentos de `docs/`.
- Crear un commit para consolidar `README.md`, `CHANGELOG.md` y `docs/registro-continuidad.md`.
- Mantener el formato en cualquier cambio posterior.

### Estado del proyecto

- La logica de negocio y la interfaz permanecen sin cambios.
- El repositorio queda preparado para continuidad operativa sin chat previo.
- El build queda validado correctamente con `powershell -NoProfile -Command "npm.cmd run build"`.
- Existen cambios documentales locales pendientes de commit.
- La siguiente persona puede iniciar por `README.md`, continuar en `CHANGELOG.md` y profundizar aqui.

---

## [0002] 2026-04-07 21:01:44 +02:00 - chore: ignore local vercel env files

### Contexto previo

Tras crear la aplicacion inicial, el repositorio necesitaba endurecer el control de artefactos locales para evitar que configuraciones de despliegue o secretos de entorno terminasen en Git.

### Cambios realizados

- Archivo: `.gitignore`
- Lineas afectadas: tramo final del archivo actual, equivalente a `8-9`
- Tipo de cambio: edicion
- Detalle tecnico: se anaden patrones para ignorar `.vercel` y `.env*.local`; el archivo ya ignoraba `node_modules`, `dist`, `*.tsbuildinfo`, `vite.config.js` y `vite.config.d.ts`.

### Razones del cambio

- Proteger configuracion local de despliegue.
- Evitar ruido en `git status` al trabajar con Vercel o entornos locales.

### Problemas resueltos

- Riesgo de incluir artefactos locales en commits.
- Posible filtrado accidental de configuracion sensible o irrelevante.

### Decisiones tecnicas tomadas

- Resolverlo en Git y no en scripts de build para que el filtrado actue antes del commit.
- Mantener una politica de ignorado simple y legible desde el propio repositorio.

### Dependencias anadidas o eliminadas

- Ninguna.

### Configuraciones alteradas

- `.gitignore`

### Proximos pasos pendientes

- Verificar si Vercel genera otros archivos locales que tambien deban ignorarse.
- Confirmar que no existen secretos versionados fuera de `.env*.local`.

### Estado del proyecto

- Aplicacion funcional sin cambios de producto.
- Repositorio mas seguro frente a artefactos locales.

---

## [0001] 2026-04-07 20:56:54 +02:00 - feat: initial nutrition planner app

### Contexto previo

Inicio del proyecto. No existia una base previa de aplicacion, catalogo nutricional, interfaz ni documentacion. La necesidad funcional era disponer de un planificador mensual local para alimentacion saludable con foco en Paiporta y con informacion de Mercadona y Consum.

### Cambios realizados

- Archivo: `.gitignore`
- Lineas afectadas: `1-fin`
- Tipo de cambio: alta
- Detalle tecnico: se crea la base de ignorado para artefactos de desarrollo y build.

- Archivo: `README.md`
- Lineas afectadas: `1-fin`
- Tipo de cambio: alta
- Detalle tecnico: se incorpora descripcion inicial del proyecto, arranque local, build y alcance funcional.

- Archivo: `docs/mantenimiento.md`
- Lineas afectadas: `1-fin`
- Tipo de cambio: alta
- Detalle tecnico: se documenta el mantenimiento de precios, disponibilidad y datos nutricionales.

- Archivo: `docs/manual-usuario.md`
- Lineas afectadas: `1-fin`
- Tipo de cambio: alta
- Detalle tecnico: se redacta la guia funcional de uso del generador mensual.

- Archivo: `docs/tecnica.md`
- Lineas afectadas: `1-fin`
- Tipo de cambio: alta
- Detalle tecnico: se describe arquitectura, algoritmo de generacion, boosters nutricionales y despliegue.

- Archivo: `index.html`
- Lineas afectadas: `1-fin`
- Tipo de cambio: alta
- Detalle tecnico: se crea la entrada HTML base para Vite.

- Archivo: `package-lock.json`
- Lineas afectadas: `1-fin`
- Tipo de cambio: alta
- Detalle tecnico: se fija el arbol de dependencias inicial del proyecto.

- Archivo: `package.json`
- Lineas afectadas: `1-fin`
- Tipo de cambio: alta
- Detalle tecnico: se definen nombre del paquete, scripts (`dev`, `build`, `preview`), dependencias y devDependencies.

- Archivo: `src/App.tsx`
- Lineas afectadas: `1-fin`
- Tipo de cambio: alta
- Detalle tecnico: se implementa la interfaz principal con formulario, estado, graficos, resultados, calendario y control de errores.

- Archivo: `src/data/catalog.ts`
- Lineas afectadas: `1-fin`
- Tipo de cambio: alta
- Detalle tecnico: se crea el catalogo local de alimentos, tiendas, precios, disponibilidad y recetas.

- Archivo: `src/lib/generator.ts`
- Lineas afectadas: `1-fin`
- Tipo de cambio: alta
- Detalle tecnico: se implementa el motor de generacion mensual, filtrado por restricciones, rotacion de recetas, boosters nutricionales y lista de compra.

- Archivo: `src/lib/nutrition.ts`
- Lineas afectadas: `1-fin`
- Tipo de cambio: alta
- Detalle tecnico: se definen etiquetas de nutrientes, unidades, objetivos diarios, agregaciones, porcentajes y formateo numerico.

- Archivo: `src/main.tsx`
- Lineas afectadas: `1-fin`
- Tipo de cambio: alta
- Detalle tecnico: se monta la aplicacion React.

- Archivo: `src/styles.css`
- Lineas afectadas: `1-fin`
- Tipo de cambio: alta
- Detalle tecnico: se anaden estilos base de la interfaz.

- Archivo: `src/types.ts`
- Lineas afectadas: `1-fin`
- Tipo de cambio: alta
- Detalle tecnico: se definen los tipos del dominio y de la salida del generador.

- Archivo: `tsconfig.json`
- Lineas afectadas: `1-fin`
- Tipo de cambio: alta
- Detalle tecnico: se configura TypeScript para la aplicacion.

- Archivo: `tsconfig.node.json`
- Lineas afectadas: `1-fin`
- Tipo de cambio: alta
- Detalle tecnico: se configura TypeScript para el entorno de herramientas.

- Archivo: `vite.config.ts`
- Lineas afectadas: `1-fin`
- Tipo de cambio: alta
- Detalle tecnico: se configura Vite con React.

### Razones del cambio

- Construir un MVP local sin dependencia de APIs externas inestables.
- Permitir generar planes mensuales ajustados a personas, dias, presupuesto, preferencias y restricciones.
- Mostrar no solo menus, sino tambien validacion nutricional, compra y coste estimado.

### Problemas resueltos

- No existia aplicacion base.
- No habia modelo de datos de alimentos, recetas y precios.
- No existia motor para filtrar restricciones alimentarias ni reforzar nutrientes deficitarios.
- No habia documentacion minima para uso, mantenimiento y despliegue.

### Decisiones tecnicas tomadas

- Stack elegido: React + TypeScript + Vite para una SPA estatica y simple de desplegar.
- Almacenamiento local del catalogo en vez de API externa por ausencia de una integracion oficial estable.
- Uso de boosters nutricionales en `src/lib/generator.ts` para aproximar coberturas minimas.
- Uso de `recharts` para visualizacion de graficos dentro de la interfaz principal.
- Estructura plana y legible del dominio con `src/types.ts` y utilidades nutricionales separadas.

### Dependencias anadidas o eliminadas

- Anadidas runtime:
  - `react`
  - `react-dom`
  - `recharts`
- Anadidas desarrollo:
  - `typescript`
  - `vite`
  - `@vitejs/plugin-react`
  - `@types/react`
  - `@types/react-dom`
- Eliminadas: ninguna.

### Configuraciones alteradas

- `package.json`
- `package-lock.json`
- `tsconfig.json`
- `tsconfig.node.json`
- `vite.config.ts`
- `.gitignore`

### Proximos pasos pendientes

- Validar el comportamiento real del generador con mas combinaciones de restricciones.
- Revisar calidad y mantenimiento del catalogo local de alimentos.
- Preparar despliegue real en una plataforma estatica.
- Valorar persistencia, cuentas de usuario y exportacion PDF.

### Estado del proyecto

- Existe una primera version funcional del planificador nutricional.
- El sistema opera completamente con datos locales.
- La base del producto queda lista para mantenimiento y evolucion posterior.
