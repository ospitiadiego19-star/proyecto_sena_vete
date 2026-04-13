# Despliegue en Railway

## Pasos para desplegar en Railway

### 1. Crear Proyecto en Railway
- Ve a [railway.app](https://railway.app)
- Inicia sesión con GitHub
- Click en "New Project"
- Selecciona "Deploy from GitHub repo"
- Autoriza acceso a GitHub
- Selecciona el repositorio: `proyecto_sena_vete`

### 2. Railway conectará automáticamente
- Detectará Node.js como runtime
- Creará un servicio para el backend

### 3. Agregar Base de Datos MySQL
En el dashboard del proyecto:
- Click en "+" → "Add Service"
- Busca y selecciona "MySQL"
- Railway creará automáticamente la BD y proporcionará `DATABASE_URL`

### 4. Configurar Variables de Entorno
Copy-paste estas variables en Railway (Variables tab):

```
NODE_ENV=production
PORT=8080
JWT_SECRET=tu_jwt_secret_aqui
DATABASE_URL=será_proporcionado_por_railway_automaticamente
```

**Para JWT_SECRET**, genera una nueva clave:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 5. Crear Tablas en Base de Datos
Después de que Railway cree la BD:

**Opción A: Usar Railway CLI (recomendado)**
```bash
# Instalar Railway CLI
npm install -g railway

# Login
railway login

# Conectar al proyecto
railway link

# Ejecutar SQL
railway run mysql -u root -p datavet < database/schema.sql
```

**Opción B: Ejecutar manualmente**
- En Railway dashboard, selecciona la BD MySQL
- Ve a "Connect" y copia las credenciales
- Usa MySQL Workbench o CLI local para ejecutar:
  ```bash
  mysql -h HOST -u USER -p PASSWORD DB_NAME < database/schema.sql
  mysql -h HOST -u USER -p PASSWORD DB_NAME < database/seed-test.sql
  ```

### 6. Despliegue Automático
- Railway desplegará automáticamente con cada push a main
- Ve a "Deployments" para ver el estado

### 7. Variables Importantes para Railway

#### Backend (.env en Railway)
```
NODE_ENV=production
JWT_SECRET=a8237e66db9ad07be19fa3cbdb918c7881c85ad4396cc0c61605ccb20a9b593d66a4cc01f5c1dc0d16828613646f990707d896be53c7868d253532f551a21294
DATABASE_URL=mysql://root:password@host:3306/datavet
```

#### Frontend (.env en Railway si lo despliegas)
```
VITE_API_URL=https://tu-app.railway.app/api
```

## URL de Producción

Una vez desplegado:
- **Backend**: `https://tu-app.railway.app`
- **API Base**: `https://tu-app.railway.app/api`
- **Endpoints disponibles**:
  - `POST /api/auth/login`
  - `POST /api/clientes/registrar`
  - `GET /api/docs` (Swagger)

## Troubleshooting

### Error: "Cannot GET /"
Normal. La raíz no tiene contenido. Prueba `/api/docs` o `/api/auth/login`

### Error: "database connection failed"
1. Verifica que DATABASE_URL esté configurado
2. Ejecuta el schema SQL en la BD
3. Revisa los logs en Railway dashboard

### Error: "JWT_SECRET not set"
1. Añade JWT_SECRET en Variables tab
2. El valor ya está configurado arriba
3. Redeploy el proyecto

## Monitoreo

En Railway dashboard puedes:
- Ver logs en tiempo real
- Monitorear CPU, RAM, storage
- Ver histórico de deployments
- Configurar dominios personalizados

## Próximos Pasos

1. ✅ Código en GitHub
2. ⏳ Conectar a Railway
3. ⏳ Agregar MySQL
4. ⏳ Desplegar Backend
5. ⏳ (Opcional) Desplegar Frontend
