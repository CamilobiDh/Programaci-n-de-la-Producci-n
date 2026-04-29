# 🏭 Programación de Producción — Distrihogar S.A.S.

Repositorio del proyecto de herramienta de programación de producción para **C.I. Distrihogar S.A.S.**, empresa colombiana dedicada a la manufactura de ropa de cama (sábanas, duvets, almohadas y productos afines).

## 📋 Descripción

Sistema de planificación y control de producción que integra pedidos comerciales desde **SIESA (ERP)** con la programación de planta, seguimiento de OPs (Órdenes de Producción) y RQTs (Requisiciones de Materiales).

## 🗂️ Estructura del repositorio

```
├── mockup/
│   └── index.html              # Bosquejo interactivo — 6 módulos navegables
├── docs/
│   ├── US-001_Modulo_Pedido.md # Historia de Usuario — Módulo Pedido
│   └── flujo_procesos_distrihogar_v2.svg  # Diagrama de flujo (20 actividades)
└── README.md
```

## 🎯 Módulos del sistema

| Módulo | Descripción | Estado |
|--------|-------------|--------|
| ① Pedido | Gestión de pedidos pendientes, selección de método, fechas CEDI, creación OPs/RQTs | 🟡 Bosquejo |
| ② Programador | Vista de ruta por OP, asignación de fechas, validación orden lógico | 🟡 Bosquejo |
| ③ Tablero OP | Estado consolidado por etapa, alertas de tela/insumo, talleres satélite | 🟡 Bosquejo |
| ④ Plantas | Gantt por planta (Corte, Confección, Bordado, Relleno, Acolchado…) | 🟡 Bosquejo |
| ⑤ Capacidad | Configuración de capacidad, simulador de pedidos, calendario festivos | 🟡 Bosquejo |
| ⑥ Dashboard | KPIs, alertas proactivas, avance diario por planta | 🟡 Bosquejo |

## 🔄 Flujo del proceso productivo

El proceso de producción sigue estas etapas (no todas aplican a cada producto):

```
Pedido → Requisición MP/Insumos → Acolchado → Corte → Bordado/Estampado (ext.) → Confección → Entrega Bodega
```

## 🏭 Plantas de producción

- **Internas:** Corte · Confección · Bordado · Relleno · Acolchado · Comforteado · Insumos
- **Externas (terceros):** Estampado · Bordado ext. · Ojal · Ojalete · Confección maquila

## 📐 Métodos de producción (SIESA)

| Método | Descripción |
|--------|-------------|
| 1 | Confección interna completa |
| 2 | Confección externa (maquila parcial) |
| 3 | Mixto (parte interna / parte externa) |
| 7 | Maquila completa |
| 8 | Especial / personalizado |

## 🔗 Integración ERP

El sistema se integra con **SIESA** para:
- Importar pedidos y referencias (automático)
- Leer Unidad de Empaque desde Lista de Materiales
- Leer SAM (tiempo de confección) desde Ruta de Producción
- Crear OPs y RQTs de forma asíncrona

## 📖 Documentación

- [`docs/US-001_Modulo_Pedido.md`](docs/US-001_Modulo_Pedido.md) — Historia de usuario completa con criterios de aceptación, reglas de negocio, sugerencias de stack técnico y flujos.
- [`docs/flujo_procesos_distrihogar_v2.svg`](docs/flujo_procesos_distrihogar_v2.svg) — Diagrama de flujo interactivo con las 20 actividades del proceso.

## 🛠️ Stack sugerido para desarrollo

**Frontend:** React 18 · TanStack Table v8 · TanStack Query · Tailwind CSS · Sonner (toasts) · Zustand

**Backend:** Node.js + Express (o .NET 8) · BullMQ (jobs asíncronos) · WebSockets/SSE · PostgreSQL

**Integración:** API REST / Web Services SIESA · Mock Service Worker (desarrollo)

---

*Distrihogar S.A.S. · Área de Tecnología · 2026*
