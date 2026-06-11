# 🎓 Guía de Estudio y Defensa: Dashboards y KPIs de Multirepuestos RG

Este documento contiene toda la información teórica y técnica que necesitas para defender tu proyecto con éxito ante el jurado. Aquí se detalla **qué demuestra** cada dashboard, **qué significan los KPIs** y la **base matemática de los modelos de inteligencia de negocios** implementados en el sistema.

---

## 📊 1. Dashboard de Finanzas (`/finances`)
### ¿Qué queremos demostrar con este panel?
Demuestra la **salud financiera e inmediata** del negocio en un período seleccionado, presentado en un formato limpio (preparado para imprimir en A4). Permite a los administradores y contadores evaluar si el negocio es rentable en el día a día, cuánto capital está invertido en mercadería y quiénes son los principales generadores de ingresos (vendedores y productos).

### KPIs Explicados:
1. **Ventas Totales (Ingreso Bruto):** 
   - *Qué es:* La suma total del dinero facturado por ventas completadas (efectivo, tarjeta, transferencia).
   - *Qué demuestra:* El volumen comercial y tracción del local.
2. **Ganancia Estimada (Utilidad Bruta):**
   - *Qué es:* $\text{Ventas} - \text{Costo de Compra}$.
   - *Qué demuestra:* La rentabilidad neta de las transacciones antes de gastos fijos. Evalúa si el margen de ganancia aplicado es suficiente para cubrir la operación.
3. **Valor Total del Inventario (Costo vs. Venta):**
   - *Qué es:* El capital invertido a costo de adquisición ($\sum \text{Existencia} \times \text{Precio Compra}$) y el potencial retorno a precio de venta ($\sum \text{Existencia} \times \text{Precio Venta}$).
   - *Qué demuestra:* El capital inmovilizado en bodega y su valor comercial proyectado.
4. **Bestsellers por Facturación:**
   - *Qué es:* Los repuestos que acumulan mayor volumen de ingresos monetarios.
   - *Qué demuestra:* El motor de ingresos del negocio.

---

## 🧠 2. Consola de Inteligencia de Negocios (BI) (`/bi-console`)
### ¿Qué queremos demostrar con este panel?
Demuestra el **uso de analítica avanzada, modelos predictivos y auditorías automatizadas** para la toma de decisiones. No es un reporte plano: realiza minería de datos, proyecciones lineales y auditorías de seguridad en tiempo real.

Este panel está estructurado en 3 pestañas especializadas (Tabs) con separación estricta de responsabilidades:

---

### 🟢 TAB 1. Flujo de Caja y Auditoría
#### ¿Qué demuestra?
La seguridad del dinero, la consistencia operativa de las cajas y el comportamiento transaccional del punto de venta para mitigar riesgos de pérdidas o "robos hormiga". **No contiene KPIs de rentabilidad o ventas**, concentrándose exclusivamente en dinero real y arqueos.

#### KPIs y Modelos de Auditoría:
1. **Historial de Cierres y Auditoría Transaccional:**
   - *Qué demuestra:* Registro de arqueos. Compara el monto de caja esperado según base de datos frente al conteo físico reportado por el cajero al cerrar el turno.
2. **Recálculo Dinámico desde JSON (Mecanismo Autolimpiante):**
   - *Qué es:* Si el sistema registra desgloses en cero (por ej. cierres anteriores), el backend procesa en tiempo real la columna `detalles_json` analizando las transacciones una por una. Separa de forma precisa los abonos netos de efectivo (restando el cambio otorgado al cliente y sumando dólares al tipo de cambio) de los cobros con tarjeta y transferencia bancaria.
   - *Qué demuestra:* Robustez analítica y capacidad de reconstrucción forense de flujos de pago.
3. **Eficiencia de Arqueo (30d):**
   - *Qué es:* El porcentaje de cierres de caja sin descuadre (Diferencia = C$ 0.00) en el último mes.
   - *Qué demuestra:* La honestidad y rigurosidad operativa de la fuerza de caja.
4. **Alertas de Seguridad en Tiempo Real:**
   - *Retiro de Seguridad:* Alerta si la caja acumula más de C$ 15,000 en efectivo para prevenir pérdidas en caso de robo.
   - *Caja Abierta por Tiempo Excesivo:* Alerta si un turno permanece activo por más de 24 horas continuas sin cerrarse.

---

### 🟡 TAB 2. Rotación de Inventario
#### ¿Qué demuestra?
La eficiencia logística de los repuestos en percha. Ayuda a liberar capital inmovilizado (dinero congelado en stock sin movimiento) y a prevenir la pérdida de ventas por falta de stock.

#### KPIs y Modelos de Rotación:
1. **Clasificación ABC de Inventario (Ley de Pareto - 180 días):**
   - *Qué es:* Segmentación del inventario activo según las unidades vendidas en los últimos 6 meses.
     - **Clase A (Alta Rotación, > 10 unidades vendidas):** El motor físico del negocio.
     - **Clase B (Rotación Media, 4 a 10 unidades vendidas):** Artículos estables de demanda regular.
     - **Clase C (Baja Rotación, <= 3 unidades vendidas):** Artículos estancados.
   - *Qué demuestra:* El gráfico horizontal de Pareto indica el porcentaje de repuestos por clase. Permite priorizar la compra de Clase A y liquidar la Clase C.
2. **Capital Estancado (Inventario de Lento Movimiento):**
   - *Qué es:* Valoración comercial ($\sum \text{Existencia} \times \text{Precio Venta}$) de productos con nulo o muy bajo movimiento en 180 días.
   - *Qué demuestra:* El costo de oportunidad de tener capital congelado en estantería sin generar flujo.
3. **Días de Inventario Disponible (DIO - Days of Inventory Outstanding):**
   - *Fórmula:* $$\text{DIO} = \frac{\text{Existencia Física Total}}{\text{Venta Diaria Promedio (30d)}}$$
   - *Qué demuestra:* Velocidad de conversión del stock a efectivo. Un DIO menor indica una logística óptima.
4. **Sugerencias de Reposición (Clase A - Stock Crítico):**
   - *Qué es:* Algoritmo de reabastecimiento que identifica productos Clase A con existencias <= 5 unidades. Calcula la cantidad sugerida de compra para restablecer el stock óptimo (llevar a 15 unidades, mínimo 10) y calcula el costo estimado de adquisición.
   - *Qué demuestra:* Automatización de compras basada en demanda para evitar rupturas de stock.
5. **Pérdida por Quiebre de Stock (Stockout Loss):**
   - *Qué es:* Calcula la pérdida monetaria diaria estimada de aquellos repuestos con demanda activa pero con stock en cero (existencia = 0).
   - *Fórmula:* $$\text{Pérdida Diaria} = \left( \frac{\text{Unidades Vendidas en 180d}}{180} \right) \times \text{Precio Venta}$$
   - *Qué demuestra:* El impacto financiero real de no contar con stock disponible de artículos demandados.

---

### 🔵 TAB 3. Rentabilidad y Proyección
#### ¿Qué demuestra?
La dirección futura de las ventas mediante modelado matemático y simulación de metas comerciales, incorporando la optimización del ticket promedio mediante venta cruzada.

#### 📊 Gráficos Integrados (Mínimo 4 Gráficos):
1. **Historial de Ventas y Proyección Lineal:** Gráfico de líneas temporales (diario/semanal) con la recta predictiva de regresión y el backtesting del modelo.
2. **Ganancia por Categoría (ROI Comercial):** Retorno real de inversión en porcentaje segmentado por las categorías de repuestos líderes.
3. **Top 5 Bestsellers por Facturación:** Comparativa de los 5 artículos de mayor rendimiento monetario.
4. **Volumen de Venta por Canal de Pago:** Distribución del volumen total facturado por Efectivo, Transferencia bancaria y Tarjeta de crédito.

#### KPIs y Modelos Analíticos:
1. **Previsión de Ingresos (Regresión Lineal):**
   - *El Modelo:* Regresión por Mínimos Cuadrados ($y = mx + c$) entrenada con ventas reales del local. Proyecta las ventas esperadas para el próximo período.
2. **Confianza Algorítmica ($R^2$ - Ajuste):**
   - *Qué es:* Coeficiente de determinación ($1 - \frac{SS_{res}}{SS_{tot}}$) que mide qué tan confiable es la proyección. Un $R^2$ cercano al 100% indica ventas estables y predecibles.
3. **Simulador de Objetivos Run-Rate (Meta de C$ 600,000):**
   - *Fórmula:* $$\text{Venta Proyectada Cierre} = \frac{\text{Ventas Mes Actual}}{\text{Días Transcurridos}} \times \text{Días Totales del Mes}$$
   - *Qué demuestra:* Calcula la proyección al final del mes basada en el ritmo diario real. Compara el Run-Rate con la meta establecida (ej. C$ 600,000) y calcula la brecha de ventas diaria y el porcentaje de aceleración requerido para alcanzarla.
4. **Venta Cruzada Inteligente (Combos Sugeridos - Market Basket Analysis):**
   - *El Modelo:* Basado en minería de reglas de asociación Apriori. Analiza las transacciones del historial para encontrar repuestos comprados juntos con frecuencia.
   - *Métricas Clave:*
     - **Confianza:** Probabilidad condicionada de que compren el producto B al llevar el producto A.
     - **Elevación (Lift):** Factor de asociación entre productos. Un Lift > 1.0 indica que ofrecer ambos en combo es altamente efectivo porque son fuertemente complementarios.

---

## 💵 3. Gestión de Cajas (`/cash-report`)
### ¿Qué queremos demostrar con este panel?
Control de auditoría diaria sobre el efectivo físico en el local. Permite realizar aperturas de caja, registrar movimientos (ingresos y egresos justificados por gastos menores) y realizar arqueos de cierre detallados para la rendición de cuentas al administrador.

---

## 📑 4. Reporte Detallado de Ventas (`/detailed-sales-report`)
### ¿Qué queremos demostrar con este panel?
La trazabilidad transaccional absoluta y el rendimiento comercial de la fuerza de ventas. Permite aplicar filtros cruzados por tipo de cliente (Mayorista vs Minorista), tipo de factura, fechas, vendedor y procesar anulaciones con bitácora de auditoría.

---

## 💡 Consejos Clave para tu Defensa (El Enfoque del Jurado)
1. **Explica la Utilidad de Negocio:** No hables solo del código. Di: *"El gráfico de regresión lineal proyecta la facturación del próximo mes, permitiendo al gerente tomar decisiones anticipadas de compra de repuestos antes de quedarse sin stock"*.
2. **Defiende la Cientificidad de los Combos:** Resalta que *"los combos no se eligen al azar; el sistema calcula la métrica de Lift a través del historial de ventas para proponer promociones cruzadas con base estadística"*.
3. **Resalta las Alertas Preventivas:** Explica que *"el sistema minimiza pérdidas operativas mediante alertas automáticas de retiro de efectivo cuando la caja supera los C$ 15,000 o cuando un turno de caja excede las 24 horas abierto"*.
4. **La Fuerza del Recálculo Forense:** Destaca que *"si una base de datos contiene cierres con desgloses vacíos, el backend analiza dinámicamente el log JSON de transacciones para reconstruir el flujo de pagos exacto por efectivo, tarjeta, dólares y transferencias"*.
