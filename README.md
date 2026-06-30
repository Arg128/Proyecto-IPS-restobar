# 🍽️ Sistema Integral de Restaurante — Restobar

<p align="center">
  <a href="https://github.com/Arg128/Proyecto-IPS-restobar">
    <img src="./logo.png" alt="Logo" width="80" height="80">
  </a>
</p>

<p align="center">
  <strong>Sistema integral de gestión para restaurantes</strong><br/>
  Desarrollado como proyecto académico en el curso de Ingeniería y Procesos de Software (IPS) — UNSA 2026-A
</p>

<p align="center">
  <a href="https://github.com/Arg128/Proyecto-IPS-restobar/actions"><img alt="CI/CD" src="https://github.com/Arg128/Proyecto-IPS-restobar/actions/workflows/main.yml/badge.svg"/></a>
  <a href="https://arg128.github.io/Proyecto-IPS-restobar"><img alt="GitHub Pages" src="https://img.shields.io/badge/demo-GitHub%20Pages-blue"/></a>
  <a href="./LICENSE"><img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-green.svg"/></a>
</p>

---

## Tabla de Contenidos

- [Sobre el Proyecto](#sobre-el-proyecto)
- [Módulos del Sistema](#módulos-del-sistema)
- [Stack Tecnológico](#stack-tecnológico)
- [Arquitectura](#arquitectura)
- [Instalación y Ejecución](#instalación-y-ejecución)
- [Deploy con Docker](#deploy-con-docker)
- [Pipeline CI/CD](#pipeline-cicd)
- [Equipo](#equipo)
- [Estado del Proyecto](#estado-del-proyecto)
- [Capturas de Pantalla](#capturas-de-pantalla)
- [Licencia](#licencia)

---

## Sobre el Proyecto

Restobar es un fork del sistema open source [matias-rivera/restobar](https://github.com/matias-rivera/restobar) (licencia MIT), extendido y reestructurado como un **Monorepo con Turborepo** para el desarrollo paralelo de seis módulos funcionales orientados a automatizar las operaciones críticas de un restaurante.

El proyecto aborda la gestión de pedidos, mesas, pagos, cocina, delivery y administración, con énfasis en la integración entre módulos mediante eventos en tiempo real.

**Repositorio del proyecto:** [github.com/Arg128/Proyecto-IPS-restobar](https://github.com/Arg128/Proyecto-IPS-restobar)  
**Documentación del equipo:** [arg128.github.io](https://arg128.github.io)  
**Demo desplegada:** [Arg128.github.io/Proyecto-IPS-restobar](https://Arg128.github.io/Proyecto-IPS-restobar)

---

## Módulos del Sistema

### 🧑‍💼 Módulo de Administrador
Panel de control de mayor nivel de acceso. Permite visualizar métricas de todos los módulos, gestionar usuarios y roles, y acceder al modo editor por módulo mediante un login temporizado del responsable del área (sesión de 5 minutos). Incluye dashboard con estadísticas y gráficas de desempeño.

<details>
<summary>Ver capturas</summary>

| Descripción | Captura |
|---|---|
| Módulo de gestión de usuarios: visualización, búsqueda y administración de cuentas | ![cap1](./docs/screenshots/admin/cap1.png) |
| Formulario de registro/edición de usuarios con datos personales y credenciales | ![cap2](./docs/screenshots/admin/cap2.png) |
| Panel de administración de roles: define funciones y restricciones de acceso | ![cap3](./docs/screenshots/admin/cap3.png) |
| Sección de permisos: establece acciones disponibles por rol | ![cap4](./docs/screenshots/admin/cap4.png) |

</details>

---

### 💰 Módulo de Caja — Facturas
Centraliza todas las operaciones financieras del restaurante. Soporta pagos por efectivo, tarjeta, transferencia bancaria y Yape. Genera automáticamente facturas o boletas por cada transacción. Incluye un panel de estadísticas con filtros por día, semana, mes y año, gráficos de barras y diagramas circulares (plato más vendido, ingresos por período), y una sección separada de gestión de gastos (almacén, mantenimiento, alquiler, impuestos).

<details>
<summary>Ver capturas</summary>

| Descripción | Captura |
|---|---|
| Panel principal: resumen de ingresos, gastos, ganancias y pagos | ![cap1](./docs/screenshots/caja/cap1.png) |
| Gestión de pagos: registro y consulta de transacciones | ![cap2](./docs/screenshots/caja/cap2.png) |
| Pantalla de generación de comprobantes de pago | ![cap3](./docs/screenshots/caja/cap3.png) |
| Formulario de emisión de boletas o facturas | ![cap4](./docs/screenshots/caja/cap4.png) |
| Confirmación y listado de comprobantes emitidos | ![cap5](./docs/screenshots/caja/cap5.png) |
| Vista detallada del comprobante de venta | ![cap6](./docs/screenshots/caja/cap6.png) |
| Previsualización del comprobante antes de imprimir | ![cap7](./docs/screenshots/caja/cap7.png) |
| Gestión de gastos: registro y control de egresos | ![cap8](./docs/screenshots/caja/cap8.png) |
| Estadísticas: indicadores de ingresos, gastos y utilidad neta | ![cap9](./docs/screenshots/caja/cap9.png) |
| Gráficos de métodos de pago y categorías de gasto | ![cap10](./docs/screenshots/caja/cap10.png) |

</details>

---

### 🍳 Módulo de Cocina — Almacén — Menú
Gestiona el proceso completo de preparación de alimentos. Cada plato en cola muestra sus etapas de cocción con temporizadores configurables (ej. Bistec: Cociendo 4min → Terminado). Al completar un paso, el sistema actualiza automáticamente el queue y calcula el promedio acumulado de tiempos por plato. El módulo de menú incluye el stock de insumos por plato, actualizado en tiempo real conforme se preparan los pedidos.

<details>
<summary>Ver capturas</summary>

| Descripción | Captura |
|---|---|
| Panel de cocina: pedidos pendientes, en preparación y completados | ![cap1](./docs/screenshots/cocina/cap1.png) |
| Configuración de tiempos de preparación por producto | ![cap2](./docs/screenshots/cocina/cap2.png) |
| Menú y stock de provisiones: gestión de ingredientes por plato | ![cap3](./docs/screenshots/cocina/cap3.png) |

</details>

---

### 🛵 Módulo de Delivery
Gestiona pedidos para despacho a domicilio. En la implementación actual funciona como simulación interna de pedidos por llamada. Incluye soporte para pagos con efectivo, tarjeta y transferencia bancaria, con interfaz rediseñada para mayor claridad operativa.

<details>
<summary>Ver capturas</summary>

| Descripción | Captura |
|---|---|
| Pantalla principal del módulo Delivery | ![cap1](./docs/screenshots/delivery/cap1.png) |
| Lista de pedidos delivery: estado, cliente y acciones | ![cap2](./docs/screenshots/delivery/cap2.png) |
| Detalle de pedido: productos, datos del cliente y total | ![cap3](./docs/screenshots/delivery/cap3.png) |
| Pago con tarjeta | ![cap4](./docs/screenshots/delivery/cap4.png) |
| Pago en efectivo: confirmación de entrega | ![cap5](./docs/screenshots/delivery/cap5.png) |
| Pago por transferencia bancaria | ![cap6](./docs/screenshots/delivery/cap6.png) |
| Confirmación de pago exitoso | ![cap7](./docs/screenshots/delivery/cap7.png) |
| Formulario de nuevo pedido delivery | ![cap8](./docs/screenshots/delivery/cap8.png) |

</details>

---

### 🪑 Módulo de Mesas
Centro de comunicación entre módulos. Gestiona el ciclo de vida de las mesas: creación, edición y eliminación; visualización en tiempo real del estado de ocupación; y detección/emisión de eventos hacia los módulos de Mozo, Caja y Cocina.

<details>
<summary>Ver capturas</summary>

| Descripción | Captura |
|---|---|
| Panel principal: estado de mesas en tiempo real, contador de libres/ocupadas y asignación de clientes | ![cap1](./docs/screenshots/mesas/cap1.png) |

</details>

---

### 🧑‍🍳 Módulo de Mozo *(Sprint 3 — En planificación)*
Interfaz optimizada para móvil. Mostrará mesas disponibles y emitirá notificaciones visuales/sonoras con ventana emergente al recibir un llamado de mesa. Requiere WebSockets para la capa de tiempo real; desarrollo programado para Sprint 3.

---

## Stack Tecnológico

| Capa | Tecnología |
|---|---|
| Frontend | ReactJS + Redux |
| Backend | Node.js + Express (API REST) |
| Base de datos | MySQL + Sequelize (ORM) |
| Servidor web | Nginx (reverse proxy) |
| Contenedores | Docker + docker-compose |
| Monorepo | Turborepo (pnpm workspaces) |
| CI/CD | GitHub Actions |
| UI Base | AdminLTE |

---

## Arquitectura

El sistema sigue el patrón **MVC** organizado en una arquitectura **Monorepo con Turborepo**:

```
Proyecto-IPS-restobar/
├── apps/
│   ├── backend/        # Node.js + Express — API REST (puerto 5003)
│   └── frontend/       # React + Redux — SPA (puerto 3002)
├── packages/           # Código compartido entre apps
├── turbo.json          # Configuración de tareas y caché incremental
└── docker-compose.yml  # Orquestación de servicios
```

El frontend se comunica con el backend vía API REST. Nginx actúa como proxy inverso en el puerto 80. Todo el stack se orquesta con Docker Compose para garantizar la reproducibilidad del entorno.

---

## Instalación y Ejecución

### Prerrequisitos

- [Node.js](https://nodejs.org/) (v18+)
- [pnpm](https://pnpm.io/) — gestor de paquetes
- [MySQL](https://www.mysql.com/) (o [WAMP](https://www.wampserver.com/en/) / [XAMPP](https://www.apachefriends.org/))

### Pasos

1. **Clonar el repositorio**
   ```sh
   git clone https://github.com/Arg128/Proyecto-IPS-restobar.git
   cd Proyecto-IPS-restobar
   ```

2. **Instalar pnpm** (si no lo tienes)
   ```sh
   npm install -g pnpm
   ```

3. **Instalar dependencias** (desde la raíz del monorepo)
   ```sh
   pnpm install
   ```

4. **Configurar variables de entorno**

   Ve a `apps/backend/`, copia `.env.example` y renómbralo a `.env`:
   ```
   NODE_ENV=development
   PORT=5003
   JWT_SECRET=tu_secreto
   DB_USER=root
   DB_NAME=restobar
   DB_PASSWORD=tu_password
   DB_HOST=localhost
   DB_DIALECT=mysql
   ```

5. **Crear la base de datos y poblarla**
   ```sh
   cd apps/backend
   npx sequelize-cli db:migrate
   npx sequelize-cli db:seed:all
   ```

6. **Ejecutar el proyecto** (desde la raíz)
   ```sh
   pnpm run dev
   ```

   El frontend estará disponible en `http://localhost:3002` y el backend en `http://localhost:5003`.

---

## Deploy con Docker

1. **Instalar [Docker](https://www.docker.com/)**

2. **Clonar el repositorio**
   ```sh
   git clone https://github.com/Arg128/Proyecto-IPS-restobar.git
   cd Proyecto-IPS-restobar
   ```

3. **Levantar los servicios**
   ```sh
   docker-compose up --build
   ```

   El sistema estará disponible en `http://localhost:80`.

---

## Pipeline CI/CD

El proyecto cuenta con un pipeline de integración y despliegue continuo configurado con **GitHub Actions** en `.github/workflows/`. Se activa automáticamente en cada push a `main`:

| Etapa | Descripción |
|---|---|
| Trigger | Push o Pull Request a `main` |
| Install | Instalación de dependencias (`pnpm install`) |
| Build | Compilación del frontend |
| Deploy | Publicación en GitHub Pages |

**Demo en vivo:** [Arg128.github.io/Proyecto-IPS-restobar](https://Arg128.github.io/Proyecto-IPS-restobar)

---

## Equipo

Proyecto desarrollado en el curso **Ingeniería y Procesos de Software** — UNSA, Semestre 2026-A  
**Docente:** Ing. Oscar Alberto Ramírez Valdez

| Rol | Integrante | Módulo |
|---|---|---|
| Product Owner / Dev | Sarmiento Tico Limberg Froilan | Administrador |
| Scrum Master / Dev | Retamozo Calatayud Angel Julio | Cocina — Almacén |
| Developer | Quispesayhua Hancco Joseph Brayan | Caja — Facturas |
| Developer | Quispe Rupaylla Fabrizio Alonso | Delivery |
| Developer | Mamani Solorzano Efrain Alex | Mesas |

---

## Estado del Proyecto

**Hito actual: Hito 2 (Sprint 1 y 2) — 60% de avance**

| Módulo | Responsable | Estado | Avance |
|---|---|---|---|
| Caja — Facturas | Quispesayhua H. J.B. | 🔄 En desarrollo | 65% |
| Mesas | Mamani Solorzano E.A. | ✅ Ready | 70% |
| Delivery | Quispe Rupaylla F.A. | ✅ Ready | 70% |
| Cocina — Almacén | Retamozo Calatayud A.J. | 🔄 En desarrollo | 60% |
| Mozo | — | 📋 Backlog (Sprint 3) | 0% |
| Administrador | Sarmiento Tico L.F. | 📋 Backlog (Sprint 3–4) | 0% |

**Roadmap:**
- **Hito 3 (Sprint 3 y 4 — Jul 2026):** Módulos Mozo, Administrador, integración WebSockets, pruebas end-to-end y despliegue en producción.

---

## Licencia

Distribuido bajo la **Licencia MIT**. Ver [`LICENSE`](./LICENSE) para más información.

---

## Agradecimientos

Basado en el trabajo original de [Matías Rivera](https://github.com/matias-rivera/restobar).

- [express-async-handler](https://github.com/Abazhenov/express-async-handler)
- [express-validator](https://express-validator.github.io/docs/)
- [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)
- [multer](https://github.com/expressjs/multer)
- [nodemon](https://github.com/remy/nodemon)
- [bcrypt](https://github.com/kelektiv/node.bcrypt.js)
- [redux-thunk](https://github.com/reduxjs/redux-thunk)
- [axios](https://github.com/axios/axios)
- [Turborepo](https://turbo.build/repo)
- [AdminLTE](https://adminlte.io/)
- [Font Awesome](https://fontawesome.com)
