# Documentacion tecnica

## Arquitectura

La solucion se implementa como SPA en React con Vite y TypeScript.

- `src/data/catalog.ts`
  - Define la base local de alimentos.
  - Incluye nutrientes por 100 gramos.
  - Registra supermercados objetivo, seccion, precio, tamano de envase y disponibilidad.
  - Almacena el catalogo de recetas.
- `src/lib/nutrition.ts`
  - Contiene los objetivos diarios base.
  - Agrega nutrientes, escala objetivos y genera porcentajes de cumplimiento.
- `src/lib/generator.ts`
  - Filtra recetas segun restricciones.
  - Escala ingredientes por numero de personas.
  - Aplica refuerzos nutricionales para acercar o superar el 100% de cobertura.
  - Consolida lista de compra y coste mensual.
- `src/App.tsx`
  - Orquesta la interfaz.
  - Presenta formularios, calendario, recetas, graficos, validacion y compra.

## Algoritmo de generacion

1. Se parte de un objetivo diario de referencia por persona.
2. El sistema filtra recetas incompatibles con vegetarianismo, veganismo, gluten y alergias.
3. Se genera una rotacion mensual de cinco comidas al dia.
4. Cada receta se escala automaticamente por numero de personas.
5. Se recalculan macronutrientes y micronutrientes del dia.
6. Si algun nutriente queda por debajo del objetivo, se anaden boosters:
   - vitamina D: salmon o setas UV;
   - vitamina B12: sardinas o levadura nutricional;
   - calcio: yogur o bebida de soja fortificada;
   - hierro: lentejas o espinaca;
   - vitamina E: almendras;
   - vitamina K: brocoli o espinaca;
   - magnesio y fibra: chia.
7. Se agregan todos los dias para obtener el informe mensual y la lista de la compra.

## Fuentes metodologicas

- Valores diarios de referencia inspirados en guias nutricionales generales para adultos sanos.
- Nutrientes modelados:
  - energia;
  - proteinas;
  - hidratos;
  - grasas;
  - fibra;
  - vitaminas A, B12, C, D, E y K;
  - hierro, calcio, zinc y magnesio.

## APIs utilizadas

En esta version no se consumen APIs externas en tiempo real.

- Motivo:
  - no se integra una API oficial publica y estable de Mercadona o Consum para precios por tienda;
  - la estructura de datos local deja preparado el proyecto para futuras sincronizaciones.

## Despliegue recomendado

- Hosting estatico: Vercel, Netlify, Cloudflare Pages.
- Build: `npm run build`
- Directorio de salida: `dist`

## Extension futura

- Persistencia en base de datos SQL o Firebase.
- Sincronizacion de catalogo desde proveedores o scraping controlado.
- Cuentas de usuario y planes guardados.
- Generacion PDF del informe y la lista de compra.
