# DATAVET

Base inicial del proyecto para trabajar por **historias de usuario** con una arquitectura desacoplada:

- **Frontend**: React + Tailwind (pendiente de implementación)
- **Backend**: Node.js + Express (implementación inicial lista)
- **Base de datos**: MariaDB (puerto 3306)
- **Autenticación**: JWT con control de roles (Admin, Veterinario, Recepcionista)

## Estado actual

✅ Planificación base creada para trabajo por historias de usuario.
✅ Backend inicial desarrollado para HU-01 y HU-02:

- `POST /api/auth/login` (valida credenciales y genera JWT)
- `POST /api/clientes/registrar` (registro transaccional cliente + mascota)
- Middleware JWT + autorización por roles

## Estructura creada

```text
/docs
/database
/backend
  src/
  tests/
  package.json
```

## Ejecución rápida backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

## 🚀 Despliegue en Railway

Para desplegar tu aplicación en la nube:

1. **Lee**: [DEPLOY_RAILWAY.md](DEPLOY_RAILWAY.md) - Guía completa paso a paso
2. **Variables**: Ver [RAILWAY_VARS.example](RAILWAY_VARS.example)
3. **Configuración**: Incluye Dockerfile y docker-compose.yml

**TL;DR:**
```bash
# 1. Ir a railway.app
# 2. Conectar GitHub repo: proyecto_sena_vete
# 3. Agregar MySQL database
# 4. Configurar variables de entorno (JWT_SECRET, etc)
# 5. Deploy automático al hacer push a main
```

## 🐳 Desarrollo Local con Docker

```bash
docker-compose up
# Backend: http://localhost:3000
# Frontend: http://localhost:5173
# MySQL: localhost:3307
```

## Próximo paso recomendado

Implementar frontend de HU-01 (pantalla login + rutas protegidas) y conectar con los endpoints ya disponibles en backend.
