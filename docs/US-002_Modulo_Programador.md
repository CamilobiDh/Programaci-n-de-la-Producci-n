# Historia de Usuario — US-002: Módulo Programador
**Producto:** Herramienta de Programación de Producción — Distrihogar S.A.S.
**Módulo:** ② Programador
**Versión:** 1.0 | Fecha: 2026-05-13

---

## Historia de usuario principal

> **Como** Mabel (programadora de producción),
> **quiero** ver todas las OPs de un programa (pedido) o de una referencia específica, asignar fechas a cada operación de la ruta de producción, y aplicar fechas masivas por tipo de operación sobre las OPs que yo seleccione,
> **para** programar la producción de forma ágil tanto por pedido como por referencia, garantizando que las fechas respeten el orden lógico del proceso y que las operaciones externas queden claramente identificadas para su despacho a terceros.

---

## Contexto del negocio

Una vez creadas las OPs y RQTs desde el Módulo de Pedidos (US-001), la programadora debe asignar **fechas de inicio a cada operación** de la ruta de producción. La ruta de cada OP proviene de SIESA (campo `nro_operacion`, `descripcion_operacion`, `es_externa`) y puede variar por referencia: algunas OPs tienen solo CORTE → CONFECCION, otras incluyen ESTAMPADO, BORDADO, OJALETE, OJAL u otras operaciones externas.

La programación puede hacerse de dos formas:

- **Por Programa (pedido DI-XXX):** se trabaja un pedido a la vez y se programan todas sus OPs.
- **Por Referencia:** en ocasiones es más eficiente programar todas las OPs de una misma referencia a lo largo de múltiples pedidos (p. ej., programar todas las OPs de PT01833 que hay en DI-1223, DI-1224 y DI-1225 al mismo tiempo).

Cada operación de la ruta tiene un número de orden (`nro_operacion`: 10, 20, 30…) que define la secuencia obligatoria. El sistema debe impedir que la fecha de una operación sea anterior a la del paso previo.

Las operaciones con `es_externa = 1` o que contengan la palabra **"SERVICIO"** en su nombre se despachan a proveedores externos (Terceros). El click sobre el nombre de una operación en la tabla debe navegar a la planta correspondiente en el Módulo ④ Plantas.

---

## Criterios de aceptación

### CA-01 — Toggle de modo: Por Programa / Por Referencia

- [ ] El módulo muestra dos modos accesibles desde un toggle en la parte superior del panel lateral: **📋 Por Programa** y **🔍 Por Referencia**.
- [ ] Al cambiar de modo se conserva el estado anterior (si había un programa o referencia seleccionada, al volver se restaura la vista).
- [ ] Solo un modo puede estar activo a la vez.

---

### CA-02 — Modo Por Programa

- [ ] El panel lateral muestra la lista de programas/pedidos disponibles (DI-1223, DI-1224…), con el nombre del cliente, la fecha de entrega y el estado (En prog. / Pendiente).
- [ ] Al hacer clic en un programa, la tabla principal se actualiza con todas las OPs de ese programa.
- [ ] El programa activo queda resaltado visualmente.
- [ ] La cabecera del panel principal muestra: N° programa, cliente, fecha de entrega y botones de acción (Guardar, Entregable terceros).

---

### CA-03 — Modo Por Referencia — Autocomplete

- [ ] El panel lateral muestra únicamente un campo de búsqueda tipo autocomplete. **No se muestra ninguna lista de referencias al abrir el modo** (las referencias pueden ser miles y no deben listarse completas).
- [ ] Desde el primer carácter escrito, aparece un **dropdown** con hasta **10 coincidencias** que contengan el texto en el código o la descripción de la referencia.
- [ ] Cada resultado del dropdown muestra: código de referencia, descripción y número de OPs encontradas con los programas en que aparece (ej. "3 OPs · DI-1223, DI-1224").
- [ ] Si hay más de 10 coincidencias, el dropdown muestra un aviso: *"Mostrando 10 de muchos — sé más específico"*.
- [ ] Las letras que coinciden con el texto buscado se resaltan en amarillo dentro del dropdown.
- [ ] La búsqueda puede navegarse con teclado: ↑↓ para moverse, Enter para seleccionar, Escape para cerrar.
- [ ] Al seleccionar una referencia, el dropdown se cierra y aparece un **chip** con el código y descripción de la referencia, más un botón ✕ para limpiar la selección y buscar otra.
- [ ] El dropdown se cierra al hacer clic fuera de él.
- [ ] La búsqueda cruza **todos los programas** disponibles, no solo el activo.
- [ ] La cabecera del panel principal actualiza: código de referencia, descripción y lista de programas en que aparece.

---

### CA-04 — Tabla de OPs × Operaciones

La tabla es el corazón del módulo. Cada **fila es una OP** y cada **columna de operación** representa un tipo de proceso.

#### Columnas fijas (sticky, izquierda)

Las siguientes columnas permanecen visibles al hacer scroll horizontal:

| # | Columna | Ancho aprox. | Editable |
|---|---------|--------------|----------|
| 1 | Checkbox de selección | 30 px | — |
| 2 | N° OP | 110 px | No |
| 3 | Referencia | 72 px | No |
| 4 | Descripción | 160 px | No (tooltip al hover) |
| 5 | Notas | 110 px | **Sí** (texto libre) |
| 6 | Cant. | 48 px | No |
| 7 | Método | 44 px | No |

- [ ] La columna Descripción muestra el texto truncado con `text-overflow: ellipsis`. Al pasar el cursor aparece un tooltip con el texto completo.
- [ ] La columna Notas es editable directamente en celda. Cuando tiene contenido se resalta en verde. Los cambios se guardan en la programación (no en SIESA).
- [ ] La última columna sticky (Método) tiene una sombra lateral que la separa visualmente de las columnas de operaciones.
- [ ] **En Modo Por Referencia**, se agrega una columna sticky adicional **Programa** (entre checkbox y N° OP), con un badge de color por programa (DI-1223 en verde, DI-1224 en azul, etc.) para identificar el origen de cada OP.

#### Columnas dinámicas de operaciones (desplazables)

- [ ] El sistema genera **una columna por cada operación única** que exista en las OPs del programa o referencia activa.
- [ ] Las columnas se ordenan de izquierda a derecha según el `nro_operacion` mínimo en que aparece cada operación (10 → 20 → 30…).
- [ ] Las operaciones internas tienen fondo azul claro con badge **INT**. Las externas (`es_externa = 1` o nombre contiene "SERVICIO") tienen fondo ámbar con badge **TERC**.

#### Celdas de operación

- [ ] Si la OP **tiene** esa operación en su ruta: la celda muestra un **campo de fecha** (`input date`) editable.
- [ ] Si la OP **no tiene** esa operación: la celda muestra un guion (—) no editable.
- [ ] Las OPs bloqueadas (sin material disponible) muestran 🔒 en las operaciones que no pueden programarse.
- [ ] Al hacer clic en la celda (fuera del campo de fecha) se navega a la planta correspondiente en el Módulo ④.
- [ ] Cuando una fecha es ingresada, el campo se resalta en verde para confirmar.

#### Encabezado de columna de operación

Cada encabezado de columna contiene dos áreas:

1. **Nombre de la operación + badge INT/TERC** — al hacer clic navega a la planta correspondiente en el Módulo ④ Plantas. Muestra una flecha y el nombre de la planta al pasar el cursor.
2. **Campo de fecha masiva** — separado visualmente del nombre, con la etiqueta *"📅 Masiva (N OPs)"* donde N es el número de OPs seleccionadas que tienen esa operación. Ver CA-06.

---

### CA-05 — Selección de OPs (checkboxes)

- [ ] Existe un checkbox en la columna encabezado para **seleccionar/deseleccionar todas** las OPs visibles.
- [ ] Cada fila tiene su propio checkbox individual.
- [ ] Las filas seleccionadas se resaltan con fondo morado claro.
- [ ] Un contador en el pie de la tabla muestra: *"N de M OPs seleccionadas · Fecha masiva aplica solo a seleccionadas"*.
- [ ] Al cargar un programa o referencia, **todas las OPs quedan seleccionadas por defecto**.
- [ ] Las OPs bloqueadas pueden seleccionarse o no, pero la fecha masiva las omite en cualquier caso.

---

### CA-06 — Fechas masivas por operación

- [ ] Cada columna de operación tiene un campo de fecha en el encabezado (ver CA-04).
- [ ] Al ingresar una fecha en ese campo, el sistema aplica esa fecha **únicamente a las OPs que están seleccionadas (checkbox marcado) Y que tienen esa operación en su ruta**. Las OPs bloqueadas quedan excluidas siempre.
- [ ] Si ninguna OP está seleccionada al ingresar la fecha masiva, aparece el aviso: *"⚠ Selecciona al menos una OP para aplicar la fecha."*
- [ ] Si ninguna de las OPs seleccionadas tiene esa operación, aparece: *"⚠ Ninguna de las OPs seleccionadas tiene la operación '[nombre]'."*
- [ ] Las celdas actualizadas por la fecha masiva muestran un **destello ámbar breve** (≈1.5 s) para confirmar el cambio.
- [ ] El campo de fecha masiva en el encabezado queda en verde una vez que tiene una fecha asignada.
- [ ] Aparece un toast de confirmación: *"✅ Fecha [fecha] aplicada a N OP(s) seleccionada(s) con '[operación]'"*.

---

### CA-07 — Validación de orden lógico de fechas

- [ ] Al ingresar o modificar la fecha de una operación (individual o masiva), el sistema verifica que la fecha sea **mayor o igual a la fecha de la operación anterior** (según `nro_operacion`).
- [ ] Si la validación falla, el campo de fecha se resalta en rojo y aparece un toast de error: *"⚠ Fecha incorrecta: el orden de operaciones no es lógico (nro 10 → 20 → 30)"*.
- [ ] La validación aplica por fila (OP), no entre filas distintas.
- [ ] No se permite guardar el programa si alguna fila tiene fechas con orden inválido.

---

### CA-08 — Navegación a planta desde operación

- [ ] Al hacer clic en el **nombre de una operación en el encabezado de columna** (o en la celda de una operación), el sistema navega al Módulo ④ Plantas y selecciona automáticamente la planta correspondiente.
- [ ] El mapeo operación → planta sigue estas reglas:

| Operación (contiene) | Planta destino |
|----------------------|----------------|
| CORTE | Corte |
| ACOLCHADO | Acolchado |
| CONFECCION (interna) | Confección |
| BORDADO | Bordado |
| ESTAMPADO | Terceros |
| CONFECCION EXTERNA | Terceros |
| SERVICIO (cualquier) | Terceros |
| RELLENO | Relleno |
| INSUMOS / RQT | Insumos |

- [ ] Al navegar, aparece un toast informando la planta destino: *"🏭 Navegando a planta: Terceros"*.
- [ ] Si el usuario estaba en Modo Por Referencia, al volver al Módulo Programador la vista se restaura.

---

### CA-09 — Guardar programa

- [ ] El botón **"💾 Guardar"** persiste las fechas asignadas y las notas editadas.
- [ ] No se permite guardar si hay errores de orden lógico de fechas (ver CA-07).
- [ ] Al guardar exitosamente, aparece un toast: *"✅ Programa [ID] guardado exitosamente."*
- [ ] El botón **"📤 Entregable terceros"** genera un resumen de las OPs con operaciones externas (TERC), incluyendo operación, proveedor asignado, F. Despacho y F. Retorno estimada.

---

## Flujo principal — Por Programa (happy path)

```
1. Mabel abre el Módulo Programador (modo Por Programa por defecto)
2. En el panel lateral selecciona DI-1223 (Hilton Cartagena)
3. La tabla carga las 11 OPs del pedido con sus columnas de operaciones
4. Todas las OPs están seleccionadas por defecto
5. En el encabezado de la columna CORTE, ingresa la fecha 2026-03-08
   → 10 OPs reciben la fecha (la de Acolchado queda en —)
   → Toast: "✅ Fecha 2026-03-08 aplicada a 10 OPs con 'CORTE'"
6. Desmarca las OPs OPN-145533 y OPN-145534 (las que tienen Estampado/Bordado)
7. En el encabezado de CONFECCION, ingresa 2026-03-15
   → Solo las 9 OPs seleccionadas reciben la fecha
8. Vuelve a seleccionar OPN-145533, en su celda de ESTAMPADO ingresa 2026-03-09 manualmente
9. Hace clic en el encabezado de ESTAMPADO
   → Navega a Módulo ④ → Planta Terceros
   → Toast: "🏭 Navegando a planta: Terceros"
10. Vuelve al Programador, todo sigue igual
11. Presiona "💾 Guardar"
    → Toast: "✅ Programa DI-1223 guardado exitosamente."
```

---

## Flujo alternativo — Por Referencia

```
1. Mabel cambia al modo 🔍 Por Referencia
2. En el campo de búsqueda escribe "PT0183"
   → Dropdown muestra: PT01833 · PROTECTOR 200X200X40 · 1 OP · DI-1223
3. Selecciona PT01833
   → Chip aparece: "PT01833 / PROTECTOR 200X200X40"
   → Tabla muestra la única OP de esa referencia en todos los programas
4. Escribe "ALMOHADA" y selecciona PT08032
   → Tabla muestra todas las OPs de PT08032 en todos los programas
   → Columna Programa muestra badges DI-1223 (verde), DI-1224 (azul), etc.
5. Selecciona todas las OPs con el checkbox de encabezado
6. Ingresa fecha masiva en CORTE → se aplica a todas las OPs de esa referencia
7. Presiona ✕ en el chip → vuelve al campo de búsqueda vacío
```

---

## Reglas de negocio

| Regla | Descripción |
|-------|-------------|
| RN-01 | La fecha de una operación debe ser ≥ a la fecha de la operación anterior de esa misma OP (orden según `nro_operacion`). |
| RN-02 | Las fechas masivas solo aplican a OPs seleccionadas (checkbox marcado) y no bloqueadas. |
| RN-03 | Las OPs bloqueadas (sin material disponible) nunca reciben fechas masivas, independientemente de la selección. |
| RN-04 | Toda operación con `es_externa = 1` o que contenga "SERVICIO" en el nombre se mapea a la planta Terceros. |
| RN-05 | Las columnas de operaciones se generan dinámicamente a partir de las rutas reales de las OPs del programa o referencia activa, ordenadas por `nro_operacion` mínimo. |
| RN-06 | En Modo Por Referencia la búsqueda cruza todos los programas disponibles. El buscador no muestra lista inicial — solo despliega resultados al escribir. |
| RN-07 | El campo de Notas es editable y pertenece al sistema de programación, no a SIESA. |
| RN-08 | No se puede guardar el programa si existen fechas con orden lógico inválido en alguna fila. |
| RN-09 | Las fechas deben ser días hábiles (sin festivos colombianos ni fines de semana). El sistema advierte si se ingresa una fecha no hábil. |

---

## Datos de integración con SIESA

| Campo | Fuente | Tipo | Dónde se usa |
|-------|--------|------|--------------|
| Lista de programas/pedidos | SIESA — endpoint pedidos | GET | Sidebar modo Por Programa |
| N° OP, Referencia, Extensión, Descripción, Cant. | SIESA — maestro de OPs | Solo lectura | Columnas sticky de la tabla |
| Método de producción | SIESA — OP | Solo lectura | Columna Método |
| Ruta de producción (`nro_operacion`, `descripcion_operacion`, `es_externa`) | SIESA — tabla de rutas | Solo lectura (estructura) | Genera las columnas dinámicas de operaciones |
| Fechas de operaciones | Sistema de programación (BD local) | Lectura / Escritura | Celdas editables de la tabla |
| Notas por OP | Sistema de programación (BD local) | Lectura / Escritura | Columna Notas |
| Estado de bloqueo (sin MP/insumo) | SIESA — stock / RQTs | Solo lectura | Indicador 🔒 en filas bloqueadas |

---

## Sugerencias de librerías y stack técnico

### Frontend

| Librería | Uso | Por qué |
|----------|-----|---------|
| **React 18+** | Framework UI | Concurrent mode para actualizaciones no bloqueantes al aplicar fechas masivas |
| **TanStack Table v8** | Tabla con columnas sticky dinámicas | `column.pin('left')` para columnas fijas, generación dinámica de columnas de operación, virtualización de filas para grandes volúmenes |
| **TanStack Query** | Fetching de OPs y rutas desde SIESA | Caché, revalidación, manejo de estados de carga/error |
| **Zustand** | Estado del módulo (modo activo, programa/referencia seleccionada, selección de filas, fechas pendientes de guardar) | Simple y sin boilerplate |
| **date-fns** | Validación de días hábiles, comparación de fechas | Liviano, soporte de festivos colombianos parametrizable |
| **Sonner / React Hot Toast** | Toasts de confirmación y error | Soporte para toasts persistentes y con acciones |
| **Tailwind CSS** | Estilos | Utilitario, consistente con el resto del sistema |
| **Headless UI / Radix UI** | Dropdown autocomplete accesible | Manejo de foco, teclado y ARIA para el buscador de referencias |

### Backend / Integración

| Tecnología | Uso | Nota |
|------------|-----|------|
| **PostgreSQL** | Persistencia de fechas y notas de programación | Separar tabla `programacion_op` (fechas, notas) de la tabla `op_siesa` (datos solo lectura) |
| **Node.js + Express** o **.NET 8** | API para guardar/leer fechas de programación | Endpoint PATCH `/api/programacion/{op_id}/operaciones` |
| **Redis** (opcional) | Caché de rutas de producción por referencia | Las rutas cambian poco; caché reduce llamadas a SIESA |

---

## Sugerencias de desarrollo

### 1. Columnas dinámicas con TanStack Table

Las columnas de operaciones deben generarse en tiempo de ejecución a partir de las rutas de las OPs cargadas. TanStack Table v8 soporta esto nativamente:

```tsx
// Generar columnas dinámicas a partir de las operaciones únicas
const opColumns = uniqueOps.map(op => ({
  id: op.nombre,
  header: () => <OpHeader op={op} onNavigate={irAPlanta} />,
  cell: ({ row }) => <OpCell row={row.original} op={op} />,
  meta: { isExternal: op.esExterna, planta: op.planta },
}));

const columns = [...stickyColumns, ...opColumns];
```

### 2. Separar modelo SIESA del modelo de programación

```ts
// Datos de SIESA — solo lectura, nunca se modifican
interface OpSiesa {
  nop: string;
  ref: string;
  descripcion: string;
  cant: number;
  metodo: number;
  ruta: OperacionSiesa[];  // { nroOperacion, nombre, esExterna }
  bloqueada: boolean;
}

// Datos de programación — propiedad del sistema
interface ProgramacionOp {
  nop: string;
  progId: string;
  notas: string;
  fechasPorOperacion: Record<string, string>; // { 'CORTE': '2026-03-08', ... }
}
```

### 3. Autocomplete de referencias con debounce

El buscador de referencias consulta potencialmente miles de registros. Usar debounce de 200-300 ms antes de disparar la búsqueda, y limitar a 10 resultados en la respuesta del servidor:

```ts
const debouncedSearch = useDebouncedCallback(async (query: string) => {
  if (query.length < 1) return;
  const results = await searchReferencias(query, { limit: 10 });
  setDropdownItems(results);
}, 250);
```

### 4. Validación de fechas en cliente

Igual que en US-001, implementar la lógica de días hábiles colombianos en el frontend para validación inmediata:

```ts
import { isWeekend } from 'date-fns';
const festivos2026 = ['2026-01-01', '2026-03-20', '2026-04-03', '2026-04-04', /* ... */];

function esDiaHabil(fecha: Date): boolean {
  const iso = fecha.toISOString().split('T')[0];
  return !isWeekend(fecha) && !festivos2026.includes(iso);
}

function validarOrdenRuta(fechasPorOp: Record<string, string>, ruta: OperacionSiesa[]): string | null {
  const sorted = [...ruta].sort((a, b) => a.nroOperacion - b.nroOperacion);
  for (let i = 1; i < sorted.length; i++) {
    const prev = fechasPorOp[sorted[i - 1].nombre];
    const curr = fechasPorOp[sorted[i].nombre];
    if (prev && curr && curr < prev) {
      return `${sorted[i].nombre} (${curr}) no puede ser antes de ${sorted[i - 1].nombre} (${prev})`;
    }
  }
  return null;
}
```

### 5. Accesibilidad en el autocomplete

- El input debe tener `role="combobox"`, `aria-expanded`, `aria-haspopup="listbox"` y `aria-autocomplete="list"`.
- El dropdown debe tener `role="listbox"`, cada opción `role="option"` con `aria-selected`.
- La navegación con teclado (↑↓ Enter Esc) debe funcionar completamente sin mouse.
- El chip de referencia seleccionada debe tener `aria-label="Referencia seleccionada: PT01833"`.

### 6. Optimización para grandes programas

Para programas con 50+ OPs y 10+ operaciones, considerar virtualización de filas con `@tanstack/react-virtual`:

```tsx
const rowVirtualizer = useVirtualizer({
  count: rows.length,
  getScrollElement: () => tableContainerRef.current,
  estimateSize: () => 44, // altura de fila en px
});
```

---

## Notas para el desarrollador

- **Las columnas de operaciones son dinámicas:** no son columnas fijas en el código. Deben generarse a partir de la consulta a SIESA en cada carga de programa o referencia.
- **El orden de las columnas viene de `nro_operacion`:** nunca ordenar alfabéticamente ni hardcodear el orden.
- **`es_externa = 1` y nombres con "SERVICIO"** son las dos reglas para identificar operaciones externas. Ambas deben manejarse.
- **La columna Notas pertenece al sistema de programación**, no a SIESA. No intentar hacer PUT a SIESA con este campo.
- **El buscador de referencias NO muestra lista al abrir** — solo despliega dropdown al escribir. Nunca pre-cargar todas las referencias en memoria del frontend.
- **En Modo Por Referencia**, la columna Programa adicional en el sticky debe mostrar un badge de color distinto por programa para facilitar la lectura visual rápida.
- **Fechas masivas aplican por selección**, no por "todos". La selección por defecto es "todos" al cargar, pero el usuario puede deseleccionar antes de aplicar.
- **El botón Guardar** debe hacer un único PATCH/PUT con todas las fechas modificadas (batch update), no una llamada por operación.

---

## Relación con otros módulos

| Módulo | Relación |
|--------|----------|
| **① Pedido (US-001)** | Las OPs y RQTs creadas en el Módulo Pedido son la entrada principal de este módulo. |
| **③ Tablero OP** | Consume las fechas programadas para mostrar el estado de avance por proceso. |
| **④ Plantas** | Destino de navegación al hacer clic en el nombre de una operación. |
| **⑤ Capacidad** | Las fechas asignadas alimentan el cálculo de ocupación por planta y semana. |

---

*Documento generado para el equipo de desarrollo de Distrihogar S.A.S. | Programación de Producción v1.0*
