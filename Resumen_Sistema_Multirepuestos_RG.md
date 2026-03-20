# 🚗 Resumen del Sistema: Multirepuestos RG

Este documento presenta un resumen completo de la arquitectura, módulos funcionales y características principales del sistema **Multirepuestos RG**, una plataforma web integral diseñada para la gestión de inventarios, ventas, caja, clientes y reportes de un negocio de repuestos automotrices.

---

## 🧩 Arquitectura y Tecnologías
El sistema está construido con una arquitectura moderna Cliente-Servidor separada:

*   **Frontend (Cliente):** Aplicación web desarrollada (Single Page Application) construida con **React.js** y **Vite**. UI dinámica usando animaciones (Framer Motion) y estilizado. Desplegado en **Netlify**.
*   **Backend (Servidor):** API RESTful desarrollada en **Node.js** con **Express**. Se ejecuta en un contenedor Docker alojado en un VPS (ej. DigitalOcean) utilizando **Nginx** como proxy inverso.
*   **Base de Datos:** Motor relacional **MySQL 8** (también en contenedor Docker).

---

## 🛠️ Módulos y Funcionalidades Principales

### 1. 🛒 Punto de Venta (POS) y Ventas
El núcleo comercial del sistema, diseñado para agilizar el proceso de facturación y cotización.
*   **POS Minorista:** Interfaz de facturación rápida para ventas al mostrador.
*   **POS Mayorista (Wholesale):** Módulo aislado con PIN de seguridad para ventas al por mayor. Maneja lista de precios diferente (multi-precios) y opciones avanzadas.
*   **Proformas y Cotizaciones:** Generación de cotizaciones profesionales en formato A4, listas para imprimir o enviar.

### 2. 📦 Gestión de Inventario
Control absoluto sobre los productos, existencias y movimientos.
*   **Catálogo de Productos:** ABM (Alta, Baja, Modificación) de repuestos con categorización y control de precios/costos.
*   **Catálogo Mayorista:** Vista especial de inventario enfocada a grandes volúmenes.
*   **Subida Masiva:** Herramienta para cargar o actualizar inventarios grandes mediante archivos CSV/Excel (`/upload/inventory`).
*   **Salidas y Traslados:** Módulo dedicado para registrar salidas que no son ventas comerciales (ej. Mermas, uso interno, garantías) manteniendo historial completo.

### 3. 💵 Gestión de Cajas (Control de Efectivo)
Seguimiento estricto del dinero físico en el local.
*   **Apertura y Cierre:** Flujo controlado para iniciar y terminar turnos de caja.
*   **Reporte de Caja (`/cash-report`):** Resumen de ingresos, egresos y cuadre final.
*   **Movimientos:** Registro de entradas extras y salidas de caja menor.

### 4. 👥 Clientes y Créditos
Herramientas para fidelización y seguimiento financiero de compradores recurrentes.
*   **Directorio de Clientes:** Base de datos de clientes corporativos y particulares con historial de compras.
*   **Cuentas por Cobrar (Créditos):** Seguimiento de saldos pendientes, límite de crédito y registro de abonos parciales o totales.

### 5. 📑 Pedidos y Apartados
*   **Gestión de Reservas:** Permite a los vendedores apartar mercancía del inventario para un cliente que pagará luego.
*   **Gestión de Pedidos:** Seguimiento de artículos solicitados que quizás no están en stock inmediato o están en ruta.

### 6. 📊 Finanzas y Reportes
Inteligencia de negocio y salud financiera de la empresa.
*   **Dashboard Principal:** Panel de control con métricas rápidas y gráficas generales.
*   **Panel de Finanzas (`/finances`):** Visión global de ingresos, gastos y rentabilidad.
*   **Reporte Detallado de Ventas:** Desglose de transacciones con filtros por fecha, vendedor, tipo de venta, etc.
*   **Facturas de Proveedores:** Registro de cuentas por pagar y compras a proveedores (`/invoices`).

### 7. 🧑‍💼 Recursos Humanos y Roles (Seguridad)
El sistema cuenta con un robusto control de acceso basado en roles (RBAC).
*   **Roles del Sistema:** Administrador, Vendedor, Encargado de Inventario, Encargado de Finanzas, Gerente, Empleado.
*   **Gestión de Usuarios:** Creación y suspensión de accesos al sistema.
*   **Módulo de Empleados (`/empleados`):** Registro de la plantilla laboral, posiblemente vinculado a nóminas, metas o asistencias.
*   **Solicitudes Internas:** Sistema para gestionar permisos, requerimientos de stock u otras peticiones entre el equipo.

### 8. ⚙️ Configuración y Administración
*   **Ajustes Globales (`/settings`):** Configuración de datos de la empresa, datos de impresión, tickets y parámetros del sistema.
*   **Promociones Mayoristas:** Motor de reglas y descuentos por volumen o montos.

---
*Documento generado en base a la estructura actual del proyecto v1.0 (Marzo 2026).*
