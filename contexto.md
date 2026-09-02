# 🚗 Contexto del Proyecto y Conexiones — Multirepuestos RG

Este documento describe la arquitectura completa, conexiones de red/base de datos, variables de entorno y la guía paso a paso para instalar y configurar **Gemini CLI** (y herramientas de IA compatibles) en este o en un nuevo repositorio para que comprenda y opere todo el sistema sin fricción.

---

## 📌 1. Visión General del Sistema

**Multirepuestos RG** es un sistema ERP / Punto de Venta (POS) integral para la gestión de repuestos automotrices, inventario multi-precio, facturación, créditos, caja y reportes en tiempo real.

### 🛠️ Stack Tecnológico
* **Frontend:** React 18 + Vite + Styled Components + Axios + Socket.io-client + HTML5 QR/Barcode Scanner + jsPDF.
* **Backend:** Node.js + Express 5 + MySQL2 (Connection Pool) + Socket.io + JWT + Compression (Gzip/Brotli).
* **Base de Datos:** MySQL 8.0 (con persistencia de volumen Docker).
* **Proxy / Web Server:** Nginx (Alpine) como Reverse Proxy en VPS.
* **Infraestructura:** DigitalOcean Droplet (Docker Compose) + Netlify (Frontend Hosting & Edge CDN).

---

## 🤖 2. Instalación y Configuración de Gemini CLI en un Nuevo Repo

Para conectar **Gemini CLI** en este repositorio o en uno nuevo y permitirle gestionar el código, ejecutar comandos y realizar conexiones:

### Paso 2.1: Requisitos Previos
* **Node.js**: v18.x o superior (`node -v`).
* **npm**: v9.x o superior (`npm -v`).
* **Git**: Instalado y configurado en el sistema.
* **Google Gemini API Key**: Obtenida desde [Google AI Studio](https://aistudio.google.com/).

### Paso 2.2: Instalación de Gemini CLI
Ejecuta en tu terminal (PowerShell o Bash):

```bash
# Instalación global de Gemini CLI
npm install -g @google/gemini-cli

# O si utilizas Antigravity / Google Cloud Code:
# Verifica la instalación con:
gemini --version
```

### Paso 2.3: Configurar la API Key
Configura la variable de entorno en tu sistema o sesión:

**En Windows (PowerShell):**
```powershell
[System.Environment]::SetEnvironmentVariable('GEMINI_API_KEY', 'TU_API_KEY_AQUI', 'User')
$env:GEMINI_API_KEY = "TU_API_KEY_AQUI"
```

**En Linux / macOS (Bash o Zsh):**
```bash
echo 'export GEMINI_API_KEY="TU_API_KEY_AQUI"' >> ~/.bashrc
source ~/.bashrc
```

### Paso 2.4: Inicializar Gemini en el Repositorio
En la raíz del proyecto nuevo o clonado:

```bash
# Inicializar configuración del repositorio
gemini init
```

### Paso 2.5: Archivo de Reglas y Contexto para la IA (`GEMINI.md`)
Crea o enlaza un archivo `GEMINI.md` en la raíz del repositorio con las siguientes directrices para que Gemini CLI comprenda el flujo de trabajo:

```markdown
# Directrices para Gemini CLI en Multirepuestos RG

1. **Stack**: Node.js + Express (Backend en /server), React + Vite (Frontend en /client), MySQL 8.
2. **Conexiones**:
   - Backend usa pool en `server/src/config/db.js`.
   - Frontend consume API a través de `client/src/service/api.js`.
   - Tiempo real sincronizado con Socket.io (eventos `stock:reservations_update`, `cart:update`, `cart:release`).
3. **Puertos por defecto**:
   - Backend: 3000 (Docker) / 3003 o 3001 (Local).
   - Frontend: 5173 (Vite).
   - Base de Datos: 3306 (MySQL).
4. **Seguridad**:
   - No exponer contraseñas en texto plano en commits.
   - Rutas protegidas mediante middleware JWT en `server/src/middlewares/auth.js`.
```

---

## 🔌 3. Configuración de Conexiones y Variables de Entorno

### 3.1. Backend (`server/.env` o raíz `.env`)
Crea el archivo `.env` en la raíz o dentro de `server/`:

```env
# === Base de Datos (MySQL) ===
DB_HOST=localhost          # 'db' si se ejecuta dentro de Docker Compose
DB_USER=appuser            # Usuario con permisos sobre la base de datos
DB_PASSWORD=TuPasswordSeguro_2026!
DB_DATABASE=multirepuestosrg
DB_PORT=3306

# === Servidor Node.js ===
PORT=3000
BACKEND_PORT=3000
NODE_ENV=production        # 'development' para modo local

# === Seguridad y JWT ===
JWT_SECRET=tu_secreto_super_seguro_jwt_2026_xyz
```

### 3.2. Frontend (`client/.env`)
Crea el archivo `client/.env`:

```env
# URL base para Axios y conexión al backend (sin barra al final)
VITE_API_URL=http://localhost:3000/api
# Para producción en VPS o Dominio:
# VITE_API_URL=https://sistema.multirepuestosrg.com/api
```

---

## 📂 4. Estructura del Repositorio

```text
RG/
├── client/                     # Frontend (React 18 + Vite)
│   ├── public/                 # Favicon, manifiestos PWA, assets estáticos
│   ├── src/
│   │   ├── components/         # Modales, Navbar, Sidebar, Tablas, Alertas
│   │   ├── context/            # AuthContext, CartContext, SocketContext
│   │   ├── pages/              # POS, Inventario, Clientes, Facturas, Reportes
│   │   ├── service/            # api.js (Axios base), settingsApi.js, cajaUtils.js
│   │   ├── App.jsx             # Enrutador principal (React Router DOM)
│   │   └── main.jsx            # Punto de entrada de React
│   ├── package.json
│   └── vite.config.js
│
├── server/                     # Backend (Express 5 + Node.js)
│   ├── public/uploads/         # Imágenes de productos, logos, comprobantes
│   ├── src/
│   │   ├── config/             # db.js (Pool MySQL2 con promesas)
│   │   ├── controllers/        # Controladores de lógica de negocio
│   │   ├── middlewares/        # Autenticación JWT, verificación de roles
│   │   ├── models/             # Consultas SQL estructuradas
│   │   └── routes/             # Definición de endpoints REST
│   ├── server.js               # Entry point (Express + Socket.io + HTTP Server)
│   ├── Dockerfile
│   └── package.json
│
├── nginx/                      # Configuración de Nginx Proxy
│   └── default.conf            # Proxy pass a contenedor 'api:3000'
│
├── compose.yml                 # Orquestación de contenedores (db, api, nginx)
├── .env.example                # Plantilla de variables de entorno
└── contexto.md                 # Este documento de contexto
```

---

## 📡 5. Mapa de Endpoints de la API Backend

Todas las rutas están prefijadas con `/api`:

| Módulo | Prefijo de Ruta | Descripción |
| :--- | :--- | :--- |
| **Autenticación** | `/api/auth` | Login, renovación de token, verificación de credenciales |
| **Usuarios** | `/api/users` | Gestión de empleados, roles y permisos de acceso |
| **Productos** | `/api/products` | Catálogo de repuestos, stock, precios (detalle/mayorista) |
| **Categorías** | `/api/categories` | Clasificación de productos |
| **Proveedores** | `/api/providers` | Registro y catálogo de distribuidores |
| **Clientes** | `/api/clients` | Gestión de clientes y líneas de crédito |
| **Ventas** | `/api/sales` | Facturación POS, tickets, anulaciones y ventas mayoristas |
| **Caja** | `/api/caja` | Apertura, arqueos, cierres de caja y movimientos |
| **Pedidos** | `/api/orders` | Apartados y pedidos especiales |
| **Salidas / Traslados**| `/api/outflow` | Mermas, uso interno, cotizaciones y traslados |
| **Facturas Proveedor** | `/api/facturas-proveedores`| Compras y recepción de mercancía |
| **Finanzas** | `/api/finances` | Gastos operativos, ingresos y balance |
| **Reportes** | `/api/reports` | Métricas de ventas, rentabilidad y KPIs |
| **Ajustes / Settings** | `/api/settings` | Configuración del negocio, impresora y PINs |
| **Archivos / Upload** | `/api/upload` | Carga de fotos de repuestos y logos |

---

## 🚀 6. Guía Rápida para Levantar el Proyecto

### Opción A: Desarrollo Local sin Docker

1. **Base de Datos:**
   - Asegúrate de tener MySQL corriendo en `localhost:3306`.
   - Crea la base de datos `multirepuestosrg`.

2. **Backend:**
   ```bash
   cd server
   npm install
   # Crear server/.env con las credenciales locales
   npm run dev
   ```
   *El servidor correrá en `http://localhost:3000` (o el puerto configurado).*

3. **Frontend:**
   ```bash
   cd client
   npm install
   npm run dev
   ```
   *El cliente correrá en `http://localhost:5173`.*

---

### Opción B: Despliegue con Docker Compose (Producción o VPS)

1. En la raíz del repositorio, copia las variables de entorno:
   ```bash
   cp .env.example .env
   # Edita .env con tus credenciales seguras
   ```

2. Levanta los contenedores:
   ```bash
   docker compose up -d --build
   ```

3. Verifica el estado:
   ```bash
   docker compose ps
   docker compose logs -f api
   ```

---

## ⚡ 7. Flujo de Datos en Tiempo Real (Socket.IO)

El sistema sincroniza el carrito de compras entre múltiples terminales para evitar sobreventa:
* `socket.emit('cart:update', { carts, userId })`: Notifica productos en carritos activos.
* `socket.emit('cart:release', { userId })`: Libera reservas al completar o cancelar compra.
* `socket.on('stock:reservations_update', data)`: Actualiza en vivo el stock visible para los vendedores.

---

## 🔒 8. Buenas Prácticas y Reglas para Asistentes de IA

1. **Manejo de Transacciones:** Toda operación crítica (ventas, anulación de facturas, movimientos de caja) debe ejecutarse dentro de transacciones SQL (`START TRANSACTION`, `COMMIT`, `ROLLBACK`) usando conexiones del pool de `mysql2`.
2. **CORS:** Si se añade un nuevo dominio de producción o IP de terminal local, registrarlo en el arreglo `allowedOrigins` en `server/server.js`.
3. **Payloads y Compresión:** Mantener el middleware `compression` activo y el límite de JSON en `10mb` para soportar imágenes de productos y catálogos grandes sin saturar memoria.
