# 🚀 Guía de Deploy en Coolify

## Método Recomendado: GitHub + Coolify (5 minutos)

### Paso 1: Prepara el repositorio en GitHub

```bash
cd ads-simulator-project

# Inicializa git (si no lo has hecho)
git init

# Agrega todos los archivos
git add .

# Commit inicial
git commit -m "Google Ads RSA Simulator v1.0"

# Conecta con tu repo de GitHub (créalo primero en github.com)
git remote add origin https://github.com/TU-USUARIO/ads-simulator.git

# Sube el código
git push -u origin main
```

### Paso 2: Deploy en Coolify

1. **Accede a tu instancia de Coolify**
   - Ve a tu Coolify: `https://tu-coolify.com`

2. **Crea nuevo recurso**
   - Click en **"Resources"** (barra lateral)
   - Click en **"+ New Resource"**
   - Selecciona **"Docker Compose"**

3. **Configura el recurso**
   - **Repository URL:** `https://github.com/TU-USUARIO/ads-simulator.git`
   - **Branch:** `main`
   - **Build Pack:** Coolify detectará automáticamente el `docker-compose.yml`

4. **Configura variables de entorno**
   - En la sección "Environment Variables":
   ```
   DB_PASSWORD=tu_password_super_seguro_aqui
   ```

5. **Deploy**
   - Click **"Save"**
   - Click **"Deploy"**
   - Espera 3-5 minutos mientras Coolify:
     - Clona el repo
     - Construye las imágenes Docker
     - Inicia los servicios
     - Configura networking

6. **Asigna un dominio (OPCIONAL)**
   - Ve a **Settings → Domains**
   - Agrega dominio: `ads-simulator.arsenweb.com`
   - Coolify automáticamente:
     - Configura reverse proxy
     - Genera certificado SSL (Let's Encrypt)
     - Redirige HTTP → HTTPS

7. **¡Listo! 🎉**
   - Accede a: `https://ads-simulator.arsenweb.com`
   - O via IP: `http://tu-ip-servidor:3000`

---

## Configuración Avanzada de Coolify

### Puertos expuestos

Por defecto, Coolify expondrá:
- Frontend: Puerto 3000
- Backend API: Puerto 3001
- PostgreSQL: Puerto 5432 (solo interno)

### Reverse Proxy

Si usas dominio, Coolify configura automáticamente:
```
https://ads-simulator.arsenweb.com → Frontend (Puerto 3000)
https://api-ads.arsenweb.com → Backend (Puerto 3001) [opcional]
```

### Variables de Entorno para Producción

En Coolify, agrega estas variables:

```bash
# Base de datos
DB_PASSWORD=password_super_seguro

# URLs (si usas dominios custom)
NEXT_PUBLIC_API_URL=https://api-ads.arsenweb.com
# O si todo está bajo un dominio:
NEXT_PUBLIC_API_URL=https://ads-simulator.arsenweb.com/api
```

### Health Checks

Coolify puede monitorear automáticamente:

**Backend Health Check:**
- URL: `/api/health`
- Método: GET
- Intervalo: 30s

**Frontend Health Check:**
- URL: `/`
- Método: GET
- Intervalo: 30s

---

## Actualizar la Aplicación

### Método 1: Push a GitHub (AUTOMÁTICO)

```bash
# Haz cambios en tu código local
git add .
git commit -m "Actualizaciones"
git push

# Coolify detectará el push automáticamente y re-deployará
# (Si tienes webhook configurado)
```

### Método 2: Manual en Coolify

1. Ve a tu recurso en Coolify
2. Click **"Redeploy"**
3. Coolify bajará el código más reciente y reconstruirá

---

## Troubleshooting Coolify

### Logs

```bash
# Ver logs en Coolify UI
Resources → Tu App → Logs

# O via SSH en el servidor
docker logs ads-simulator-web
docker logs ads-simulator-api
docker logs ads-simulator-db
```

### Restart Services

```bash
# En Coolify UI
Resources → Tu App → Restart

# O via SSH
docker-compose restart
```

### Acceder a la Base de Datos

```bash
# Desde Coolify UI
Resources → PostgreSQL → Connect

# O via SSH
docker exec -it ads-simulator-db psql -U arsen ads_simulator
```

---

## Backups Automáticos

Coolify puede hacer backups automáticos de PostgreSQL:

1. Ve a tu recurso PostgreSQL en Coolify
2. Settings → Backups
3. Configura:
   - **Frecuencia:** Diaria (1:00 AM)
   - **Retención:** 7 días
   - **Destino:** S3, Local, etc.

---

## Monitoreo

Coolify incluye monitoreo básico:
- CPU usage
- Memory usage
- Disk usage
- Network traffic

Accede en: Resources → Tu App → Metrics

---

## Dominio y SSL

### Opción 1: Subdominio de tu dominio principal

1. En tu DNS (Cloudflare, etc.):
   ```
   A     ads-simulator    →  IP-de-tu-servidor
   ```

2. En Coolify:
   - Settings → Domains
   - Agrega: `ads-simulator.arsenweb.com`
   - Enable SSL: ✅

### Opción 2: Dominio dedicado

1. Apunta el dominio completo a tu servidor
2. En Coolify agrega el dominio
3. SSL se configura automáticamente

---

## Comandos Útiles (SSH)

```bash
# Ver todos los contenedores
docker ps

# Ver logs en tiempo real
docker-compose logs -f

# Reiniciar todo
docker-compose restart

# Detener todo
docker-compose down

# Iniciar todo
docker-compose up -d

# Ver uso de recursos
docker stats

# Backup de base de datos
docker exec ads-simulator-db pg_dump -U arsen ads_simulator > backup-$(date +%Y%m%d).sql
```

---

## Seguridad

### Recomendaciones:

1. **Cambia el password de PostgreSQL**
   - Usa contraseña fuerte (16+ caracteres)
   - Guárdala en tu password manager

2. **Firewall**
   - Coolify configura automáticamente
   - Solo puertos necesarios expuestos

3. **SSL/HTTPS**
   - Siempre usa dominio con SSL
   - Let's Encrypt es gratis y automático

4. **Actualizaciones**
   - Mantén Coolify actualizado
   - Revisa logs regularmente

---

## Costos

### Coolify (Servidor Hetzner)

- **Servidor básico:** ~$5-10/mes (suficiente para esta app)
- **Tráfico:** Incluido (1TB+)
- **Coolify:** GRATIS
- **SSL:** GRATIS (Let's Encrypt)

**Total estimado:** $5-10/mes

---

## Soporte

Si tienes problemas con Coolify:
1. Revisa logs en Coolify UI
2. Revisa documentación: https://coolify.io/docs
3. Discord de Coolify: https://coolify.io/discord

---

¡Listo para production! 🚀
