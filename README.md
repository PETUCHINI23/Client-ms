# Clients Microservice

Microservicio de clientes (NestJS + Prisma 7 + SQLite) que se comunica por TCP con el `client-gateway`.

## Desarrollo

1. Clonar el repositorio
2. `npm install`
3. Crear `.env` basado en `.env.template` (puerto `3003`)
4. `npx prisma generate`
5. `npx prisma migrate deploy` (crea `dev.db` con la tabla `Customer`)
6. `npm run start:dev`

## Patrones de mensaje

| Patrón | Payload | Respuesta |
| --- | --- | --- |
| `{ cmd: 'create_customer' }` | `name`, `email`, `phone?`, `address?` | Cliente creado |
| `{ cmd: 'find_all_customers' }` | `page?`, `limit?` | `{ data, meta: { total, page, lastPage } }` |
| `{ cmd: 'find_one_customer' }` | `id` | Cliente |
| `{ cmd: 'update_customer' }` | `id` + campos | Cliente actualizado |
| `{ cmd: 'remove_customer' }` | `id` | Cliente eliminado |

Errores (`RpcException`): `409` email duplicado, `404` id inexistente, `400` validación.

## Pruebas

Importar `customers.postman_collection.json` en Postman y ejecutarla con el Collection Runner
(con products-ms, clients-ms y client-gateway levantados).
