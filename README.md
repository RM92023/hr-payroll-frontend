# HR Payroll UI (Angular)

Frontend Angular (standalone + “layers” tipo Clean Architecture) para consumir tu backend Nest **hr-payroll-calculator**.

## Endpoints consumidos

- `GET /payroll/health`
- `GET /employees` / `POST /employees`
- `GET /contracts` / `POST /contracts`
- `GET /payroll/runs` / `POST /payroll/runs`
- `GET /payroll/rules` / `GET /payroll/rules/:id` / `POST /payroll/rules` / `PUT /payroll/rules/:id` / `DELETE /payroll/rules/:id`

> Nota: tu backend usa una tabla `PayrollRule` vía SQL raw. Si esa tabla no existe en tu Postgres, los endpoints de rules fallarán (el UI mostrará el error).

## Arquitectura

- `src/app/domain/**`: modelos + contratos de repositorio (interfaces)
- `src/app/application/**`: use-cases (casos de uso) que llaman repositorios
- `src/app/infrastructure/**`: implementaciones HTTP de repositorios + tokens/proveedores
- `src/app/presentation/**`: páginas (UI) + rutas

## Configuración

Edita:
- `src/environments/environment.ts` → `apiBaseUrl` (por defecto `http://localhost:3000`)

## Run

```bash
npm install
npm run start
```

Abre: http://localhost:4200

## Tips (CORS)

Si ves errores CORS, habilita CORS en Nest (`main.ts`):

```ts
app.enableCors({ origin: 'http://localhost:4200' });
```
