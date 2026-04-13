# 🚀 GUÍA COMPLETA: DESPLIEGUE EN RAILWAY

## ✅ Estado Actual del Proyecto

- ✅ Backend Node.js + Express listo
- ✅ MySQL configurado
- ✅ Frontend React + Vite listo  
- ✅ Código en GitHub: `ospitiadiego19-star/proyecto_sena_vete`
- ✅ Documentación completa
- ✅ Dockerfile y docker-compose.yml incluidos

## 📋 Pasos para Desplegar en Railway

### PASO 1: Crear Cuenta Railway (Si no tienes)
1. Ve a https://railway.app
2. Click "Start a project"
3. "Continue with GitHub"
4. Autoriza Railway a acceder a tu GitHub

### PASO 2: Crear Nuevo Proyecto
1. Click "New Project" en tu dashboard de Railway
2. Selecciona "Deploy from GitHub repo"
3. Busca y selecciona: `proyecto_sena_vete`
4. Click "Deploy"

✅ Railway detectará automáticamente Node.js

### PASO 3: Agregar Base de Datos MySQL
1. En el proyecto, click "+" button
2. Selecciona "Add Service" → "MySQL"
3. Railway creará la BD automáticamente
4. Esperá 2-3 minutos a que se inicie

✅ Railway configurará `DATABASE_URL` automáticamente

### PASO 4: Configurar Variables de Entorno
1. En el servicio del Backend, ve a "Variables"
2. Agrega estas variables (puedes usar los botones de "Raw Editor"):

```
NODE_ENV=production
JWT_SECRET=tu_jwt_secret_aqui
PORT=8080
JWT_EXPIRES_IN=8h
```

**Para JWT_SECRET, genera una nueva clave:**
```bash
# En tu terminal local:
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copia el resultado y pégalo en `JWT_SECRET`

### PASO 5: Inicializar Base de Datos
Hay dos opciones:

#### OPCIÓN A: Usando Railway CLI (Recomendado)
```bash
# Terminal local
npm install -g railway
railway login
railway link  # Selecciona tu proyecto

# Ejecutar script SQL
railway shell
mysql -u root -p < database/schema.sql
mysql -u root -p < database/seed-test.sql
```

#### OPCIÓN B: Ejecutar manualmente desde aplicación
1. Agrega este código al inicio de `backend/src/app.js`:

```javascript
import pool from './db/pool.js';
import fs from 'fs';
import path from 'path';

// Only run on first deployment (production)
if (process.env.NODE_ENV === 'production' && !process.env.DB_INITIALIZED) {
  const schema = fs.readFileSync(path.join(process.cwd(), '../database/schema.sql'), 'utf-8');
  const queries = schema.split(';').filter(q => q.trim());
  
  (async () => {
    try {
      for (const query of queries) {
        if (query.trim()) {
          await pool.query(query);
        }
      }
      console.log('✅ Database initialized');
    } catch (err) {
      console.error('DB init error:', err);
    }
  })();
}
```

2. Crea variable de entorno: `DB_INITIALIZED=true`

#### OPCIÓN C: Copiar BD existente (Más rápido)
```bash
# Local:
mysqldump -h localhost -P 3307 -u root -proot123 datavet > backup.sql

# En Railway:
mysql -h HOST -u USER -p PASSWORD DB_NAME < backup.sql
```

### PASO 6: Hacer Deploy
1. Railway detecta cambios automáticamente
2. Click en el proyecto → "Deployments"
3. Espera a que aparezca un check ✓ verde

✅ Tu API estará disponible en: `https://tu-nombre-proyecto.up.railway.app`

### PASO 7: Probar API

```bash
# Endpoint de health check
curl https://tu-nombre-proyecto.up.railway.app/

# Probar login
curl -X POST https://tu-nombre-proyecto.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"cedula":"0000000001","password":"test1234"}'

# Ver documentación Swagger
https://tu-nombre-proyecto.up.railway.app/api-docs
```

## 🔧 Configuración Adicional (Opcional)

### Agregar Dominio Personalizado
1. En el proyecto, ve a Settings
2. Agrega tu dominio personalizado
3. Configura DNS según instrucciones

### Configurar Logs
1. Click en el servicio Backend
2. Ve a "Logs"
3. Puedes ver logs en tiempo real

### Configurar Auto-deploy desde commits
Railroad hace esto automáticamente. Cada push a `main` dispara un nuevo deploy.

## 📊 Monitoreo y Debugging

### Ver Logs
```bash
railway logs -f
```

### Ver Variables
```bash
railway variables
```

### Conectar a BD desde local
```bash
# Obtener credenciales:
railway status

# Conectar:
mysql -h railway-host -u root -p railway-pass DB_NAME
```

## ⚠️ Troubleshooting

### Error: "Cannot GET /"
**Solución**: Es normal. La raíz no tiene contenido.
- Prueba: `/api/auth/login`
- O: `/api-docs` para ver documentación

### Error: "ECONNREFUSED" en logs
**Causa**: BASE DE DATOS NO INICIALIZADA
**Solución**: 
1. Ve a la BD en Railway
2. Conecta manualmente y ejecuta `schema.sql`

### Error: "JWT_SECRET not found"
**Solución**:
1. Agrega en Variables
2. Click "Deploy" para redeploy

### Error: "Cannot find module"
**Solución**:
1. Ve a Logs
2. Verifica que `npm install` corrió
3. Si no aparece, redeploy manualmente

## 🎯 URLs Importantes

| Servicio | URL |
|----------|-----|
| Backend API | `https://tu-proyecto.up.railway.app` |
| API Docs | `https://tu-proyecto.up.railway.app/api-docs` |
| MySQL DB | Desde Railway Dashboard |
| GitHub Repo | https://github.com/ospitiadiego19-star/proyecto_sena_vete |

## 📝 Próximos Pasos (Después del deploy)

1. **Desplegar Frontend** (Opcional):
   - Crea otro proyecto Railway desde frontend/
   - Configura `VITE_API_URL` apuntando al backend desplegado

2. **Configurar CORS** (Si desarrollas frontend en otro lugar):
   - En `backend/src/app.js`:
   ```javascript
   app.use(cors({
     origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
     credentials: true
   }));
   ```

3. **Agregar Monitoreo**:
   - Usa Railway Analytics para ver métricas
   - Configura alertas por email

4. **Backups**:
   - Railway hace backups automáticos
   - Ve a BD MySQL → Backups

¡Listo! 🎉 Tu API está en el cloud.
