# Plan de mantenimiento

## Objetivo

Mantener actualizados precios, disponibilidad y surtido de productos para Mercadona y Consum de Paiporta.

## Frecuencia recomendada

- Precios: revision semanal.
- Disponibilidad: revision bisemanal o ante cambios estacionales.
- Nutrientes: revision trimestral.
- Recetas y objetivos: revision semestral con supervision nutricional.

## Procedimiento operativo

1. Revisar ticket de compra, web oficial o visita en tienda.
2. Actualizar `src/data/catalog.ts`:
   - precio;
   - tamano de envase;
   - seccion;
   - disponibilidad;
   - alternativas.
3. Ejecutar:

```bash
npm run build
```

4. Validar que la interfaz sigue mostrando costes y agrupaciones correctamente.
5. Desplegar nueva version.

## Indicadores a revisar

- Desviacion entre precio real y precio modelado.
- Ingredientes sin alternativa.
- Nutrientes que dependen de un solo alimento fortificado.
- Incrementos de coste por encima del presupuesto habitual de usuario.

## Proxima evolucion recomendada

- Conectar un backend con historial de precios.
- Crear tareas programadas para sincronizacion semiautomatica.
- Mantener fuentes por tienda concreta y fecha de captura.
