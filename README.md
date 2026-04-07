# Planificador Nutricional Saludable

Aplicacion web en React + TypeScript para generar dietas mensuales personalizadas con:

- menus diarios con 5 comidas;
- validacion de macronutrientes y micronutrientes;
- recetas detalladas;
- lista de compra mensual;
- disponibilidad local en Mercadona y Consum de Paiporta;
- estimacion de coste total mensual.

## Arranque local

```bash
npm install
npm run dev
```

## Build de produccion

```bash
npm run build
```

## Estructura

- `src/App.tsx`: interfaz principal y paneles de resultados.
- `src/data/catalog.ts`: base local de alimentos, precios y recetas.
- `src/lib/generator.ts`: motor de generacion de menus, validacion y compra.
- `src/lib/nutrition.ts`: objetivos diarios, agregacion y utilidades nutricionales.
- `docs/tecnica.md`: documentacion tecnica.
- `docs/manual-usuario.md`: guia funcional.
- `docs/mantenimiento.md`: mantenimiento de precios y disponibilidad.

## Alcance actual

- Los datos de supermercados se almacenan localmente con estructura preparada para mantenimiento.
- No se usa una API publica de Mercadona o Consum porque no existe una integracion oficial estable incluida en este proyecto.
- La aplicacion queda lista para desplegarse en Vercel, Netlify o cualquier hosting estatico compatible con Vite.
