# 🎯 Google Ads RSA Simulator

Simulador profesional de RSAs (Responsive Search Ads) para Google Ads con gestión de templates y cliente.

**Desarrollado por:** Arsen Web 3.0  
**Versión:** 1.0.0

---

## 📋 Características

✅ **Templates por Cliente** - Guarda y reutiliza bancos de headlines H1/H2/H3  
✅ **Generación Inteligente** - Crea múltiples RSAs con distribución equitativa  
✅ **Pinning Estratégico** - Fija automáticamente H1 en pos 1 y H3 en pos 3  
✅ **Preview en Tiempo Real** - Visualiza 3 variaciones por cada RSA  
✅ **Export CSV** - Compatible con Google Ads Editor  
✅ **Multi-Cliente** - Gestiona templates para múltiples clientes  

---

## 🏗️ Stack Tecnológico

- **Frontend:** Next.js 14 + React 18 + Tailwind CSS
- **Backend:** Node.js + Express + PostgreSQL
- **Deploy:** Docker + Docker Compose (Coolify ready)

---

## 🚀 Deploy en Coolify (RECOMENDADO)

### Opción A: Deploy desde GitHub (MÁS FÁCIL)

1. **Sube el proyecto a GitHub:**
   ```bash
   cd ads-simulator-project
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/tu-usuario/ads-simulator.git
   git push -u origin main
   ```

2. **En Coolify:**
   - Ve a **Resources → New Resource**
   - Selecciona **Import from GitHub**
   - Pega la URL del repositorio
   - Coolify detectará automáticamente el `docker-compose.yml`
   - Click **Deploy**

3. **Configura variables de entorno en Coolify:**
   - `DB_PASSWORD`: Tu contraseña segura para PostgreSQL
   - Opcional: `NEXT_PUBLIC_API_URL` (si usas dominio custom)

4. **Asigna dominio (opcional):**
   - En Coolify: Settings → Domains
   - Agrega: `ads-simulator.arsenweb.com` (o el que quieras)

5. **¡Listo!** 🎉
   - Frontend: `https://ads-simulator.arsenweb.com`
   - API: `https://ads-simulator.arsenweb.com/api`

---

### Opción B: Deploy Manual via SSH

1. **Conecta a tu servidor:**
   ```bash
   ssh root@tu-servidor-coolify
   ```

2. **Crea directorio y sube archivos:**
   ```bash
   mkdir -p /var/apps/ads-simulator
   cd /var/apps/ads-simulator
   # Sube los archivos (SCP, SFTP, o clonar desde git)
   ```

3. **Configura variables de entorno:**
   ```bash
   cp .env.example .env
   nano .env
   # Edita DB_PASSWORD con tu contraseña
   ```

4. **Inicia con Docker Compose:**
   ```bash
   docker-compose up -d
   ```

5. **Verifica que esté corriendo:**
   ```bash
   docker-compose ps
   docker-compose logs -f
   ```

6. **Accede a la app:**
   - Frontend: `http://tu-servidor:3000`
   - API: `http://tu-servidor:3001`

---

## 🛠️ Desarrollo Local (OPCIONAL)

### Prerequisitos

- Node.js 18+
- PostgreSQL 15+
- npm o yarn

### Setup

1. **Clona el repositorio:**
   ```bash
   git clone https://github.com/tu-usuario/ads-simulator.git
   cd ads-simulator
   ```

2. **Instala PostgreSQL local:**
   - Mac: `brew install postgresql@15`
   - Windows: Descarga desde postgresql.org
   - Linux: `sudo apt install postgresql-15`

3. **Crea base de datos:**
   ```bash
   psql postgres
   CREATE DATABASE ads_simulator;
   CREATE USER arsen WITH PASSWORD 'tu_password';
   GRANT ALL PRIVILEGES ON DATABASE ads_simulator TO arsen;
   \q
   ```

4. **Carga schema:**
   ```bash
   psql -U arsen -d ads_simulator -f database/schema.sql
   ```

5. **Configura backend:**
   ```bash
   cd backend
   cp .env.example .env
   # Edita .env con tu DATABASE_URL
   npm install
   npm run dev
   ```

6. **Configura frontend:**
   ```bash
   cd frontend
   cp .env.example .env
   # Edita .env si es necesario
   npm install
   npm run dev
   ```

7. **Accede a:**
   - Frontend: http://localhost:3000
   - API: http://localhost:3001

---

## 📊 Estructura del Proyecto

```
ads-simulator-project/
├── backend/
│   ├── server.js           # Express API
│   ├── package.json
│   ├── Dockerfile
│   └── .env.example
├── frontend/
│   ├── pages/
│   │   └── index.js        # Página principal
│   ├── components/
│   │   ├── StrategicBlocks.js   # Simulador principal
│   │   ├── TemplateManager.js   # Gestión de templates
│   │   └── AdPreview.js         # Preview de ads
│   ├── lib/
│   │   └── api.js          # Cliente API
│   ├── styles/
│   │   └── globals.css
│   ├── package.json
│   ├── Dockerfile
│   └── .env.example
├── database/
│   └── schema.sql          # Schema PostgreSQL
├── docker-compose.yml      # Orquestación Docker
├── .env.example
└── README.md
```

---

## 🎯 Uso

### 1. Selecciona Cliente

En el dropdown superior, selecciona el cliente para el que trabajarás (Healteeth, OptiSoft, etc.)

### 2. Carga o Crea Template

- **Opción A:** Carga un template existente desde "Templates Guardados"
- **Opción B:** Crea uno nuevo pegando tus bancos H1/H2/H3

### 3. Genera RSAs

1. Pega tus headlines en cada banco:
   - **H1:** Marca/Ubicación/Credenciales
   - **H2:** Ganchos/Beneficios/Urgencia
   - **H3:** CTAs/Acciones

2. Pega descriptions (máx 90 caracteres c/u)

3. Completa Site Name y Display URL

4. Click en "Generar X RSAs" (3, 5 o 10)

### 4. Revisa Previews

Cada RSA muestra:
- Headlines con badges H1/H2/H3
- Indicadores de PIN (📌 Pos 1 o 3)
- 3 variaciones de preview

### 5. Exporta

1. Selecciona los RSAs que quieres usar
2. Click "Exportar X RSAs seleccionados a CSV"
3. Importa el CSV en Google Ads Editor

### 6. Guarda Template

Click "Guardar Template Actual" para reutilizar en el futuro

---

## 🗄️ Base de Datos

### Tablas principales:

- **`clients`** - Clientes de la agencia
- **`templates`** - Templates de copy guardados
- **`generated_rsas`** - Historial de RSAs generados

### Backup:

```bash
# Backup
docker exec ads-simulator-db pg_dump -U arsen ads_simulator > backup.sql

# Restore
docker exec -i ads-simulator-db psql -U arsen ads_simulator < backup.sql
```

---

## 🔧 Troubleshooting

### Puerto ya en uso
```bash
# Ver qué usa el puerto
lsof -i :3000
lsof -i :3001

# Cambiar puertos en docker-compose.yml
```

### Base de datos no conecta
```bash
# Ver logs de PostgreSQL
docker-compose logs postgres

# Entrar al contenedor
docker exec -it ads-simulator-db psql -U arsen ads_simulator
```

### Frontend no ve la API
- Verifica `NEXT_PUBLIC_API_URL` en .env
- Asegúrate que backend esté corriendo: `curl http://localhost:3001/api/health`

---

## 🚦 Health Checks

```bash
# API Health
curl http://localhost:3001/api/health

# Database
docker exec ads-simulator-db pg_isready -U arsen

# All services
docker-compose ps
```

---

## 📈 Próximas Features (Roadmap)

- [ ] Integración con Google Ads API
- [ ] Integración con Claude API para mejorar copy
- [ ] Análisis de calidad de headlines
- [ ] Export a Google Ads Editor XML
- [ ] Sistema de usuarios y permisos
- [ ] Historial detallado de RSAs generados
- [ ] Keyword research integrado

---

## 🤝 Soporte

**Desarrollado para:** Arsen Web 3.0  
**Contacto:** pit@arsenweb.com

---

## 📝 Licencia

Uso interno de Arsen Web 3.0. Todos los derechos reservados.

---

## ✅ Checklist de Deploy

- [ ] Variables de entorno configuradas (.env)
- [ ] PostgreSQL corriendo
- [ ] Schema cargado en base de datos
- [ ] Backend API respondiendo en :3001
- [ ] Frontend cargando en :3000
- [ ] Conexión frontend-backend funcionando
- [ ] Templates de ejemplo creados
- [ ] Dominio configurado (opcional)
- [ ] SSL/HTTPS habilitado (opcional)
- [ ] Backup configurado (recomendado)

---

¡Listo para chingarle! 🚀
