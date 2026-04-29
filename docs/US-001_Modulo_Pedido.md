# Historia de Usuario — US-001: Módulo de Pedidos
**Producto:** Herramienta de Programación de Producción — Distrihogar S.A.S.
**Módulo:** ① Pedido
**Versión:** 1.0 | Fecha: 2026-04-29

---

## Historia de usuario principal

> **Como** Mabel (programadora de producción),
> **quiero** ver todos los pedidos comerciales pendientes de programar, seleccionar uno, configurar el método y las fechas CEDI de cada ítem, y lanzar la creación de OPs y RQTs sin bloquear mi pantalla,
> **para** poder programar varios pedidos en paralelo de forma ágil, sin perder el contexto de qué referencia estoy configurando al desplazarme por la tabla.

---

## Contexto del negocio

Distrihogar recibe pedidos comerciales de clientes (hoteles, cadenas retail, etc.). Cada pedido contiene múltiples ítems (referencias de producto). La programadora de producción debe:

1. Consultar los pedidos pendientes que vienen de **SIESA** (ERP).
2. Por cada ítem, asignar el **método de producción** (1, 2, 3, 7 u 8) que determina su ruta de planta.
3. Definir la **Fecha de Despacho CEDI** y la **Fecha de Entrega CEDI** (iguales para todos los ítems del pedido o distintas por ítem según el cliente).
4. Lanzar la creación masiva de **OPs (Órdenes de Producción)** y **RQTs (Requisiciones de materiales)** — proceso que puede tardar segundos en el ERP y no debe bloquear la interfaz.

---

## Criterios de aceptación

### CA-01 — Panel de pedidos pendientes
- [ ] La pantalla muestra un panel lateral con la lista de pedidos pendientes de programar cargados desde SIESA.
- [ ] Cada tarjeta de pedido muestra: N° Pedido, Nombre del cliente, Fecha de entrega al cliente y estado (Pendiente / En prog.).
- [ ] Al hacer clic en un pedido, la tabla de ítems se actualiza con las referencias de ese pedido.
- [ ] El pedido activo se resalta visualmente.

### CA-02 — Cabecera del pedido
- [ ] La cabecera muestra: N° Pedido, Cliente y Fecha de entrega al cliente (dato de SIESA, solo lectura).
- [ ] Las fechas CEDI **no** aparecen en la cabecera — se configuran por ítem en la tabla.

### CA-03 — Tabla de ítems con columnas fijas (sticky)
- [ ] Las columnas **Referencia**, **Extensión** y **Descripción** permanecen fijas (sticky) a la izquierda al hacer scroll horizontal, con separador visual (sombra o borde) que las diferencia de las columnas desplazables.
- [ ] Las columnas **Cant.**, **Und. Empaque**, **SAM (min)** y **Ruta** se cargan automáticamente desde SIESA y son de **solo lectura** (marcadas con etiqueta "S").
- [ ] La columna **Notas** también viene de SIESA (solo lectura).
- [ ] Las columnas **F. Despacho CEDI** y **F. Entrega CEDI** son editables directamente en la celda (input date).
- [ ] La columna **Método** permite seleccionar uno de los valores 1, 2, 3, 7, 8 mediante pills/botones por fila. Solo puede seleccionarse un método por ítem. El valor seleccionado queda resaltado.
- [ ] La columna **Acciones ítem** contiene tres botones por fila: **Dividir ítem**, **Agrupar ítem**, **Generar hijos**.
- [ ] El orden de columnas es: [fijas] Referencia · Extensión · Descripción → [scroll] Cant. · Und. Emp. · SAM · Método · Ruta · F. Despacho CEDI · F. Entrega CEDI · Notas · Acciones ítem.

### CA-04 — Selección de ítems
- [ ] Existe un checkbox en el encabezado de la tabla para **seleccionar/deseleccionar todos** los ítems.
- [ ] Cada fila tiene su propio checkbox individual.
- [ ] Un contador visible muestra cuántos ítems están seleccionados ("N de M seleccionados").

### CA-05 — Barra de fechas rápidas (dos escenarios)

**Escenario 1 — Misma fecha para todos los ítems:**
- [ ] La programadora ingresa F. Despacho CEDI y F. Entrega CEDI en la barra superior.
- [ ] Al presionar **"Aplicar a TODOS los ítems"**, los campos de fecha de todas las filas (independientemente del checkbox) se actualizan.

**Escenario 2 — Fechas distintas por ítem:**
- [ ] La programadora selecciona un subconjunto de filas con sus checkboxes.
- [ ] Ingresa las fechas en la barra superior.
- [ ] Al presionar **"Aplicar a seleccionados"**, solo las filas marcadas se actualizan.
- [ ] Los campos de fecha de cada fila siguen siendo editables individualmente en cualquier momento.

- [ ] Al aplicar fechas, los campos actualizados muestran un destello visual breve (p. ej., fondo ámbar) para confirmar el cambio.
- [ ] El contador de la barra indica cuántos ítems recibirán la fecha antes de aplicar.

### CA-06 — Creación de OPs y RQTs en segundo plano
- [ ] El botón **"Crear OPs y RQTs"** solo se activa si hay al menos un ítem seleccionado.
- [ ] Al hacer clic, el proceso se lanza en el backend sin bloquear la interfaz.
- [ ] Aparece un indicador de progreso en pantalla ("Creando OPs en segundo plano…").
- [ ] Aparece un **toast/notificación** que indica: *"Puedes continuar con otro pedido mientras se procesan las OPs"*.
- [ ] Al finalizar (éxito o error), aparece una notificación con el resultado.
- [ ] La programadora puede hacer clic en otro pedido del panel lateral mientras el proceso corre.

### CA-07 — Acciones por ítem
- [ ] **Dividir ítem**: permite partir la cantidad del ítem en dos o más OPs (se define cantidad por cada OP hija).
- [ ] **Agrupar ítem**: permite seleccionar otro ítem del mismo pedido y consolidarlos en una sola OP.
- [ ] **Generar hijos**: crea OPs hijas vinculadas a la OP madre (para procesos dependientes).
- [ ] Las tres acciones abren un modal/panel con los parámetros requeridos (no navegan fuera del módulo).

### CA-08 — Estados de RQTs (panel informativo)
- [ ] Debajo de la tabla se muestra un resumen de los estados de RQTs del pedido activo: Comprometidas · Parciales · En elaboración · Anuladas.

---

## Flujo principal (happy path)

```
1. Mabel abre el módulo Pedido
2. Ve la lista de pedidos pendientes en el panel lateral
3. Hace clic en DI-1223 (Hilton Cartagena)
4. La tabla carga los 6 ítems del pedido (datos de SIESA)
5. Revisa las referencias — las columnas sticky siempre muestran Ref/Ext/Desc
6. En la barra de fechas rápidas ingresa: Despacho 20-mar / Entrega 22-mar
7. Presiona "Aplicar a TODOS" → todas las filas reciben las fechas (destello ámbar)
8. Para PT09513 (COBIJA), cambia manualmente la fecha de entrega a 25-mar (diferente)
9. Asigna Método 1 a PT01833, Método 2 a PT02024 (clic en pills por fila)
10. Selecciona todos los ítems con el checkbox de cabecera
11. Presiona "Crear OPs y RQTs"
12. Aparece toast: "Procesando en segundo plano…"
13. Mientras espera, hace clic en DI-1224 y empieza a configurar ese pedido
14. Llega notificación: "OPs y RQTs de DI-1223 creadas exitosamente"
```

---

## Flujo alternativo — fechas distintas por ítem

```
1. Mabel tiene un pedido con 8 ítems, de los cuales 5 van al CEDI el 20-mar y 3 el 27-mar
2. Marca los primeros 5 ítems con checkbox
3. En la barra ingresa 20-mar y presiona "Aplicar a seleccionados" → solo esas 5 filas se actualizan
4. Desmarca todos, marca los 3 restantes
5. En la barra ingresa 27-mar y presiona "Aplicar a seleccionados" → las 3 filas restantes se actualizan
6. Continúa normalmente
```

---

## Reglas de negocio

| Regla | Descripción |
|-------|-------------|
| RN-01 | Un ítem solo puede tener UN método asignado (1, 2, 3, 7 u 8). |
| RN-02 | Los campos Cant., Und. Empaque, SAM y Ruta son de solo lectura — solo SIESA los modifica. |
| RN-03 | No se puede crear OPs sin haber seleccionado al menos un ítem. |
| RN-04 | La F. Despacho CEDI debe ser anterior o igual a la F. Entrega CEDI. |
| RN-05 | Ambas fechas CEDI deben ser días hábiles (sin festivos colombianos ni fines de semana). |
| RN-06 | La creación de OPs/RQTs es asíncrona — el frontend no debe esperar la respuesta para habilitarse. |
| RN-07 | "Dividir ítem" y "Agrupar ítem" no pueden ejecutarse simultáneamente sobre el mismo ítem. |

---

## Definición de métodos de producción

| Método | Descripción | Ruta típica |
|--------|-------------|-------------|
| 1 | Confección interna completa | Insumos → Corte → Confección → Bodega |
| 2 | Confección externa (maquila) | Insumos → Corte → Terceros (Conf.Ext.) → Bodega |
| 3 | Mixto (parte interna, parte externa) | Varía por etapa |
| 7 | Maquila completa | Terceros (todo el proceso) → Bodega |
| 8 | Especial / personalizado | Según parámetros adicionales |

---

## Datos de integración con SIESA

| Campo | Fuente | Tipo |
|-------|--------|------|
| Lista de pedidos pendientes | SIESA — endpoint pedidos | GET — polling o webhook |
| Referencia, Extensión, Descripción | SIESA — maestro de productos | Solo lectura |
| Cantidad comercial | SIESA — línea de pedido | Solo lectura |
| Unidad de empaque | SIESA — Lista de Materiales (LM) | Solo lectura |
| SAM (min de confección) | SIESA — Ruta de producción | Solo lectura |
| Ruta (procesos del producto) | SIESA — Ruta de producción | Solo lectura |
| Notas | SIESA — campo libre de línea | Solo lectura |
| Creación OPs / RQTs | SIESA — endpoint transaccional | POST asíncrono |

---

## Sugerencias de librerías y stack técnico

### Frontend

| Librería | Uso | Por qué |
|----------|-----|---------|
| **React 18+** | Framework UI | Ecosistema maduro, concurrent mode para UI no bloqueante |
| **TanStack Table v8** | Tabla de ítems con columnas sticky | Soporta `position: sticky` nativo, virtualización de filas, sort/filter sin rerender completo |
| **TanStack Query (React Query)** | Fetching de datos SIESA | Caché automático, revalidación, estados de carga/error listos |
| **React Hook Form** | Formulario de fechas rápidas | Validación sin re-renders innecesarios, integración con date inputs |
| **date-fns** | Manejo de fechas, festivos | Liviano, modular, cálculo de días hábiles colombianos |
| **Sonner** o **React Hot Toast** | Toast / notificaciones | Soporte nativo para toasts persistentes y con acción |
| **Zustand** | Estado global (pedido activo, selecciones) | Más simple que Redux para este volumen de estado |
| **Tailwind CSS** | Estilos | Utilitario, rápido para prototipar |

### Backend / Integración

| Tecnología | Uso | Nota |
|------------|-----|------|
| **Node.js + Express** o **.NET 8** | API middleware entre frontend y SIESA | Si SIESA expone API REST o web services SOAP |
| **WebSockets / Server-Sent Events** | Notificación de fin de proceso OPs | El frontend se subscribe, SIESA notifica cuando termina |
| **Bull / BullMQ** (Node) | Cola de trabajos para creación OPs | Maneja reintentos, concurrencia y progreso |
| **PostgreSQL** | Persistencia local de configuraciones | Métodos asignados, fechas CEDI, estado de programación |

---

## Sugerencias de desarrollo

### 1. Empezar por la tabla sticky — es el corazón del módulo

La tabla de ítems es el componente más crítico. Se recomienda construirla primero de forma aislada (Storybook o página independiente) con datos mock. Usar **TanStack Table** con `column.pin('left')` para las columnas fijas. Validar que el scroll horizontal funcione correctamente en pantallas de 1280px (resolución estándar de los equipos en planta).

```tsx
// Ejemplo de columna sticky con TanStack Table
columnHelper.accessor('referencia', {
  header: 'Referencia',
  meta: { sticky: true },
  cell: info => <strong>{info.getValue()}</strong>,
})
```

### 2. Separar los datos SIESA (solo lectura) de los datos del programador (editables)

Desde el primer diseño de la base de datos, mantener dos modelos separados:
- `PedidoSiesa` — snapshot de los datos del ERP (inmutable).
- `ProgramacionItem` — método seleccionado, fechas CEDI, prioridad (propiedad del sistema de programación).

Esto evita sobreescribir datos de SIESA y facilita la sincronización.

### 3. Creación asíncrona de OPs — usar job queue

No llamar directamente a SIESA en el request del usuario. El flujo recomendado:

```
[Frontend] → POST /api/pedidos/{id}/crear-ops
[Backend]  → Encolar job en BullMQ
[Backend]  → Responder inmediatamente con jobId: 200 OK
[Worker]   → Ejecutar creación en SIESA (puede tardar 5-30 seg)
[Worker]   → Emitir evento via WebSocket/SSE al finalizar
[Frontend] → Mostrar notificación de éxito/error
```

### 4. Validación de fechas CEDI en el frontend

Implementar la lógica de días hábiles colombianos en el cliente para validación inmediata (sin esperar al backend). Usar `date-fns` + una tabla de festivos parametrizable:

```ts
import { isWeekend, addBusinessDays } from 'date-fns'
const festivos2026 = ['2026-01-01', '2026-03-20', '2026-04-03', '2026-04-04']

function esDiaHabil(fecha: Date): boolean {
  const iso = fecha.toISOString().split('T')[0]
  return !isWeekend(fecha) && !festivos2026.includes(iso)
}
```

### 5. Prototipar con datos mock antes de conectar SIESA

Construir el módulo completo con datos estáticos (JSON local) antes de integrar SIESA. Esto permite que el equipo de UX valide el flujo sin depender del ERP. Usar **MSW (Mock Service Worker)** para interceptar las llamadas de red.

### 6. Accesibilidad en la tabla

- Los inputs de fecha deben tener `aria-label` que incluya el nombre de la referencia (ej: "Fecha despacho CEDI para PT01833").
- Los pills de método deben ser `role="radio"` dentro de un `role="radiogroup"`.
- El toast de fondo debe incluir `aria-live="polite"`.

---

## Notas para el desarrollador

- **No mostrar las fechas CEDI en la cabecera** — van exclusivamente en la tabla por ítem.
- **El método es obligatorio** antes de crear OPs. Mostrar validación visual si un ítem no tiene método asignado al intentar crear.
- **"Dividir ítem" y "Agrupar ítem"** abren modales; no navegan fuera de la pantalla. El modal de dividir pide las cantidades de cada sub-ítem (deben sumar la cantidad original).
- **Las columnas de SIESA** (Cant., Und. Empaque, SAM, Ruta, Notas) deben tener un indicador visual claro de que son de solo lectura (etiqueta "S", fondo diferente o cursor not-allowed).
- La barra de fechas rápidas debe mostrar en tiempo real cuántos ítems están seleccionados para que la programadora sepa cuántos recibirán la fecha antes de presionar el botón.

---

*Documento generado para el equipo de desarrollo de Distrihogar S.A.S. | Programación de Producción v1.0*
