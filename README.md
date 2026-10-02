# Challenge Jr - Frontend Angular (Admin de Pólizas)

Aplicación para administrar coberturas y pólizas de seguros de autos.

## Funcionalidades
- CRUD de coberturas.
- CRUD de pólizas con detalle (cobertura + monto asegurado) y monto total calculado.
- Validaciones, avisos y confirmación de borrado.
- Interfaz con Angular Material.

## Requisitos
- Node 16 (recomendado para Angular 12) y Angular CLI 12
- Back corriendo en `http://localhost:5073` (ver repo del backend)

## Cómo correrlo
1. Levantar el back (`dotnet ef database update` y `dotnet run`).
2. En este repo:
```bash
   npm install
   ng serve
```
3. Abrir `http://localhost:4200`.

La URL de la API se configura en `src/environments/environment.ts`.

## Cambios realizados en el backend
- `PolizasCoberturasController`: los `GET` leían de la tabla `Polizas`; ahora leen de `PolizasCoberturas`, con filtro opcional `?polizaId=`.
- `PolizasCoberturas`: `Poliza` y `Cobertura` pasan a ser nulables para poder crear detalles enviando solo los IDs.
- `PUT` del detalle: ahora actualiza `PolizaId` y `CoberturaId`.

## Decisiones técnicas
- El monto total se calcula en el front sumando los montos de cada fila.
- Formulario de póliza con `FormArray`; no permite coberturas repetidas.
- Al editar, se comparan las filas originales con las actuales para crear, actualizar o borrar.

## Posibles mejoras
- Endpoint en el back que devuelva la póliza con su detalle y total en una sola llamada.
- Paginación y búsqueda en los listados.
- Tests unitarios de servicios y componentes.