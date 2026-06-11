# 🎓 Guía de Estudio y Defensa: Dashboards y KPIs de Multirepuestos RG

Este documento contiene toda la información teórica y técnica que necesitas para defender tu proyecto con éxito. Aquí se detalla **qué demuestra** cada dashboard, **qué significan los KPIs** y la **base matemática de los modelos de inteligencia de negocios** implementados en el sistema.

---

## 📊 1. Dashboard de Finanzas (`/finances`)
### ¿Qué queremos demostrar con este panel?
Demuestra la **salud financiera y rentabilidad general** del negocio en un periodo determinado. Permite a los administradores y gerentes evaluar si el negocio es rentable en el día a día, cuánto capital está inmovilizado en stock y quiénes son los principales motores de ventas (vendedores y productos).

### KPIs Explicados:
1. **Ventas Totales (Ingreso Bruto):** 
   - *Qué es:* La suma total del dinero facturado por ventas completadas en el periodo seleccionado (incluye efectivo, tarjeta y transferencia).
   - *Qué demuestra:* El volumen de negocio y tracción comercial del local.
2. **Ganancia Estimada (Utilidad Bruta Ponderada):**
   - *Qué es:* Calculado como: $\text{Ventas Totales} - \text{Costo de Adquisición de los Productos Vendidos}$.
   - *Qué demuestra:* La rentabilidad neta real de las transacciones comerciales antes de gastos fijos. Demuestra si el margen de ganancia aplicado es suficiente para cubrir la operación.
3. **Valor Total del Inventario (Capital en Mercadería):**
   - *Qué es:* La valoración monetaria actual de todos los repuestos activos en stock: $\sum (\text{Existencia} \times \text{Precio de Costo})$.
   - *Qué demuestra:* El capital de trabajo que el negocio tiene invertido en el almacén. Es vital para entender la liquidez del negocio.
4. **Producto Top (Bestseller):**
   - *Qué es:* El repuesto que ha acumulado la mayor cantidad de unidades vendidas.
   - *Qué demuestra:* La preferencia de la demanda y el artículo de mayor rotación física.

---

## 🧠 2. Consola de Inteligencia de Negocios (BI) (`/bi-console`)
### ¿Qué queremos demostrar con este panel?
Demuestra el **uso de analítica avanzada y modelos matemáticos** para la toma de decisiones estratégicas. A diferencia de un reporte estático, la consola BI realiza auditoría en tiempo real, proyecciones automatizadas de ventas y minería de datos para potenciar ventas cruzadas.

Este panel se divide en 3 enfoques analíticos clave (Tabs):

### 🟢 A. Enfoque: Flujo de Caja y Auditoría
#### ¿Qué demuestra?
La seguridad del dinero, los hábitos de compra de los clientes y el comportamiento operativo del punto de venta para prevenir pérdidas.
#### KPIs y Modelos Analíticos:
1. **Canal de Pago Principal:** Distribución porcentual y monetaria de pagos en Efectivo, Transferencia y Tarjeta. Demuestra el nivel de bancarización y preferencia de pago de los clientes.
2. **Ticket Promedio:** $\text{Ingresos de Caja} \div \text{Cantidad de Ventas}$. Representa el consumo promedio de un cliente en una visita. Ayuda a planificar estrategias de incremento de ticket (ej. ofertas combo).
3. **Alertas de Auditoría (Detección de Anomalías):**
   - *Descuadres de Caja:* Identifica discrepancias entre el efectivo real y el esperado en los cierres de caja.
   - *Acumulación Excesiva de Efectivo:* Alerta cuando una caja supera los C$ 15,000 en efectivo neto para mitigar riesgos de robo.
   - *Caja Abierta por Tiempo Excesivo:* Detecta turnos de caja sin cerrar por más de 24 horas, exigiendo el cumplimiento de procesos.
4. **Sugerencias de Combos de Repuestos (Market Basket Analysis):**
   - *El Modelo:* Basado en minería de reglas de asociación de transacciones. El sistema analiza tickets históricos para identificar qué repuestos se compran juntos frecuentemente (ej. aceite + filtro de aceite).
   - *Métricas Científicas que demuestras:*
     - **Soporte (Support):** La probabilidad de que un ticket contenga ambos productos.
     - **Confianza (Confidence):** Si un cliente compra el Producto A, qué tan probable (en %) es que compre el Producto B.
     - **Elevación (Lift):** Qué tanto aumenta la probabilidad de comprar el Producto B al llevar el Producto A, en comparación con comprar el Producto B de forma aislada. Un Lift $> 1$ indica una relación fuertemente complementaria.

### 🟡 B. Enfoque: Rotación de Inventario
#### ¿Qué demuestra?
La eficiencia logística de los repuestos. Permite identificar capital estancado (dinero congelado) y riesgos de ruptura de stock (desabastecimiento).
#### KPIs y Modelos Analíticos:
1. **Tasa de Rotación Mensual:** Cuántas veces se renueva el stock promedio en el mes. Una tasa alta indica que los productos se venden rápido; una baja indica sobrealmacenamiento.
2. **Capital Estancado (Inmovilizado):** La valoración a precio de venta de los productos con nulo o bajísimo movimiento en los últimos 180 días.
   - Demuestra el costo de oportunidad de tener mercadería ocupando espacio físico sin generar flujo de efectivo.
3. **Alertas de Stock-out Inminente:** Identifica repuestos populares con existencia en cero o cercana a cero para evitar la pérdida de ventas futuras.

### 🔵 C. Enfoque: Rentabilidad y Proyección
#### ¿Qué demuestra?
La capacidad de planificar financieramente el futuro del negocio utilizando modelos predictivos basados en datos históricos.
#### KPIs y Modelos Analíticos:
1. **Margen Comercial Ponderado:** El promedio ponderado de rentabilidad sobre el costo del catálogo de repuestos vendidos.
2. **Previsión de Ingresos (Modelo Predictivo):**
   - *El Modelo:* Se utiliza un modelo de **Regresión Lineal por Mínimos Cuadrados** sobre la serie de tiempo de ventas históricas diarias y semanales.
   - *La Fórmula:* El modelo ajusta la línea $y = mx + c$, donde:
     - $y$ representa las ventas proyectadas.
     - $x$ es la unidad de tiempo (días o semanas).
     - $m$ es la pendiente (la tendencia de crecimiento o decrecimiento).
     - $c$ es el intercepto de base.
3. **Confianza Algorítmica ($R^2$ - Coeficiente de Determinación):**
   - *Qué es:* Un valor porcentual real que mide qué tan bien se adapta la línea de regresión a los datos reales de ventas en la fase de entrenamiento/backtesting.
   - *Qué demuestra:* Si el $R^2$ es cercano al 100%, indica que las ventas siguen un comportamiento predecible y la proyección es altamente confiable. Si es bajo, indica que las ventas son muy erráticas o sujetas a factores externos imprevistos.

---

## 💵 3. Gestión de Cajas (`/cash-report`)
### ¿Qué queremos demostrar con este panel?
Demuestra el **control de auditoría diaria sobre el efectivo físico**. Permite hacer aperturas y cierres ciegos de caja, registrar entradas y salidas de efectivo justificadas (gastos menores o ingresos extraordinarios) y generar reportes en formato impreso para contabilidad. 

---

## 📑 4. Reporte Detallado de Ventas (`/detailed-sales-report`)
### ¿Qué queremos demostrar con este panel?
Demuestra la **trazabilidad de transacciones y el rendimiento de la fuerza de ventas**. Permite filtrar por tipo de cliente (Mayorista vs Minorista), tipo de venta, rango de fechas exacto, vendedor, y realizar devoluciones o cancelaciones de facturas con registro de auditoría.

---

## 💡 Consejos Clave para tu Defensa (Consejos del Jurado)
1. **Enfócate en la Toma de Decisiones:** No digas solo "este gráfico muestra líneas". Di: *"Este gráfico de regresión lineal permite al gerente proyectar los ingresos del próximo mes y planificar la compra de repuestos antes de quedarse sin caja"*.
2. **Defiende la Venta Cruzada (Combos):** Explica que los combos no son aleatorios; *"El sistema analiza la coocurrencia en tickets de ventas anteriores y calcula el Lift. Por ejemplo, si el Lift entre pastillas de freno y líquido de frenos es de 2.5x, significa que la campaña de combo tiene 2.5 veces más probabilidad de éxito que ofrecerlos por separado"*.
3. **Muestra el Control Interno:** Destaca las alertas de caja. Explica que *"el sistema previene robos hormiga y descuadres mediante alertas automáticas si hay demasiado efectivo en caja sin retirar, o si un cajero deja un turno abierto por más de 24 horas"*.
