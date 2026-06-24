# Frontend Catastro - Angular 20

Frontend profesional para el proyecto de microservicios catastrales.

## Requisitos

- Node 24.x
- npm 11.x
- Angular CLI 20.x
- Backend levantado:
  - Eureka: http://localhost:8761
  - Gateway: http://localhost:8080
  - Auth: http://localhost:8081
  - Propietarios: http://localhost:8083
  - Lotes: http://localhost:8084

## Instalación

```bash
cd frontend-catastro
npm install
npm start
```

## Usuario de prueba

Registrar primero desde Postman si no existe:

```http
POST http://localhost:8080/auth/register
```

```json
{
  "username": "admin",
  "email": "admin@catastro.com",
  "password": "Admin123*",
  "fullName": "Administrador Catastro"
}
```

Luego ingresar en el frontend con:

- Usuario: admin
- Contraseña: Admin123*

## Funcionalidades

- Login con JWT.
- Interceptor para enviar Bearer Token.
- Guard para proteger rutas privadas.
- Dashboard con KPIs.
- Listado de propietarios.
- Listado de lotes.
- Mapa Leaflet con polígonos WKT simples.

## Endpoints usados

- POST http://localhost:8080/auth/login
- GET http://localhost:8080/api/propietarios
- GET http://localhost:8080/api/lotes



ng serve --proxy-config proxy.conf.json -o