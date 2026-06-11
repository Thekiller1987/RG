# 🎓 Guía Suprema de Defensa: Los 3 Dashboards e Inteligencia de Negocios (BI)

Este documento es la guía analítica oficial para la defensa del sistema de **Multirepuestos RG**. Detalla la arquitectura lógica de los 3 dashboards, analizando cada indicador clave mediante cinco ejes fundamentales: **¿Qué hace?**, **¿Qué busca resolver?**, **¿Cómo lo hace? (Fórmula/Mecánica)**, **¿Por qué se diseñó así?** y **¿En qué beneficia directamente al negocio?**

---

# 🧠 DASHBOARD 1: Consola de Inteligencia de Negocios (BI) (`/bi-console`)

La consola de BI es el cerebro estadístico del sistema. Diseñado en un entorno cyberpunk premium de modo oscuro, está dividido en tres enfoques operativos para garantizar la pureza de los datos y evitar mezclar flujos de efectivo con rentabilidad comercial.

---

## 🟢 ENFOQUE A: Flujo de Caja y Auditoría (Seguridad Operativa)

Concentra el control del dinero físico en caja y detecta anomalías. **No mezcla rentabilidad** para mantener el enfoque estricto en auditoría contable.

### 1. Eficiencia de Arqueo de Caja (30 días)
* **¿Qué hace?** Mide la exactitud del manejo de dinero físico calculando el porcentaje de cierres de caja que terminaron con un descuadre de exactamente cero.
* **¿Qué busca resolver?** La inconsistencia en el manejo del dinero, el descuido de los cajeros y la prevención de "robos hormiga".
* **¿Cómo lo hace?** Compara la diferencia entre el dinero físico contado por el cajero ($V_{\text{real}}$) y el dinero calculado por el sistema ($V_{\text{esperado}}$).
  $$\text{Diferencia} = V_{\text{real}} - V_{\text{esperado}}$$
  $$\text{Eficiencia Arqueo (\%)} = \left( \frac{\text{Cantidad de Cierres con Diferencia } = 0}{\text{Total de Cierres en los últimos 30 días}} \right) \times 100$$
* **¿Por qué se diseñó así?** Se determinó un margen de 30 días para evaluar el desempeño reciente del personal de caja, incentivando la transparencia mediante un indicador de competencia profesional.
* **¿En qué beneficia al negocio?** Reduce a mínimos históricos las pérdidas inexplicadas de dinero en caja. Genera un registro de auditoría que permite evaluar el desempeño de los cajeros y premiar a quienes mantengan una eficiencia del 100%.

### 2. Recálculo Forense de Desglose de Caja desde JSON
* **¿Qué hace?** Reconstruye dinámicamente el desglose de métodos de pago (Efectivo, Tarjeta, Transferencia y Dólares) de cierres de caja en tiempo real, incluso si las columnas base de la tabla se grabaron en cero.
* **¿Qué busca resolver?** La pérdida de trazabilidad e inconsistencias históricas cuando un arqueo no registra las columnas de desglose en la base de datos.
* **¿Cómo lo hace?** Si el sistema detecta valores en cero al leer un arqueo, el backend extrae el log `detalles_json` del cierre, itera sobre cada transacción grabada y calcula:
  $$\text{Efectivo Neto C\$} = \sum (\text{Efectivo Aportado} + [\text{Dólares} \times \text{Tipo Cambio}]) - \text{Cambio Entregado}$$
  $$\text{Tarjeta} = \sum \text{Monto Tarjeta}, \quad \text{Transferencia} = \sum \text{Monto Transferencia}$$
* **¿Por qué se diseñó así?** Se diseñó como un mecanismo autolimpiante de contingencia en el backend (`reportController.js`), garantizando que la auditoría nunca se rompa debido a fallos o campos vacíos en registros antiguos.
* **¿En qué beneficia al negocio?** Otorga robustez absoluta al negocio. El administrador siempre verá de dónde provino cada centavo cobrado, permitiendo conciliar perfectamente el dinero físico contra las cuentas de banco y POS de tarjetas.

### 3. Alertas de Anomalías en Caja y Seguridad
* **¿Qué hace?** Monitorea continuamente las cajas activas y dispara banderas rojas de riesgo administrativo.
* **¿Qué busca resolver?** El peligro de robos y asaltos por acumulación de efectivo, así como el fraude administrativo por mantener turnos abiertos por tiempo indeterminado.
* **¿Cómo lo hace?** Analiza las variables en tiempo real:
  - *Retiro de Seguridad:* Si $\text{Efectivo Neto en Caja} > \text{C\$ 15,000}$.
  - *Turno Excesivo:* Si $(\text{Fecha/Hora Actual} - \text{Fecha/Hora Apertura}) > 24 \text{ horas}$.
* **¿Por qué se diseñó así?** Se establecieron umbrales fijos basados en el costo operativo de seguridad (C$ 15,000 es el límite máximo de exposición al riesgo tolerable en caja).
* **¿En qué beneficia al negocio?** Protege físicamente el patrimonio del local forzando retiros parciales de efectivo a bóveda, y garantiza procesos disciplinados obligando a los cajeros a cerrar e iniciar turnos diariamente.

---

## 🟡 ENFOQUE B: Rotación de Inventario (Eficiencia Logística)

Optimiza la compra de repuestos y evita tener dinero congelado en productos sin demanda.

### 4. Clasificación ABC de Inventario (Pareto - 180 días)
* **¿Qué hace?** Clasifica los repuestos del catálogo en tres clases de importancia según su volumen de unidades vendidas en los últimos 6 meses.
* **¿Qué busca resolver?** La desorganización en las compras a proveedores, donde se adquieren piezas de lento movimiento y se descuidan las de alta demanda.
* **¿Cómo lo hace?** Agrupa las ventas completadas por producto y asigna:
  - **Clase A (Alta Rotación):** Ventas $> 10$ unidades en 180 días.
  - **Clase B (Media Rotación):** Ventas entre $4$ y $10$ unidades.
  - **Clase C (Baja Rotación):** Ventas $\le 3$ unidades.
* **¿Por qué se diseñó así?** Sigue la Ley de Pareto ($80/20$), donde un pequeño porcentaje de repuestos (Clase A) representa el grueso del movimiento físico y comercial de la tienda.
* **¿En qué beneficia al negocio?** Permite al administrador enfocar el capital de trabajo garantizando stock de Clase A, controlando la Clase B, y aplicando promociones agresivas a la Clase C para recuperar la inversión.

### 5. Sugerencia de Reposición Automática (Clase A - Stock Crítico)
* **¿Qué hace?** Genera sugerencias de compras automatizadas para artículos Clase A con stock menor o igual a 5 unidades.
* **¿Qué busca resolver?** La ruptura de stock (desabastecimiento) de los productos estrella del negocio, lo cual provoca pérdida directa de clientes.
* **¿Cómo lo hace?** Identifica productos con ventas $> 5$ y existencia $\le 5$. Calcula el pedido óptimo:
  $$\text{Cantidad a Comprar} = \max(10, 15 - \text{Existencia Actual})$$
  $$\text{Costo Proyectado} = \text{Cantidad a Comprar} \times \text{Precio de Compra (Costo)}$$
* **¿Por qué se diseñó así?** Se definió un stock objetivo de 15 unidades para amortiguar el tiempo de entrega de proveedores de repuestos, con una compra mínima de 10 unidades para justificar el flete de envío.
* **¿En qué beneficia al negocio?** Automatiza el rol del comprador. Proporciona una lista detallada lista para enviar al proveedor con las cantidades exactas y el presupuesto necesario para reponer los bestsellers.

### 6. Pérdida Proyectada por Quiebre de Stock (Stockout Loss)
* **¿Qué hace?** Cuantifica financieramente en córdobas el costo de tener productos agotados (Existencia = 0) que poseen demanda histórica activa.
* **¿Qué busca resolver?** El "costo de oportunidad invisible". Los gerentes suelen ignorar cuánto dinero dejan de percibir por no tener existencias.
* **¿Cómo lo hace?** Analiza repuestos agotados que registran ventas en los últimos 180 días y calcula:
  $$\text{Demanda Diaria Promedio} = \frac{\text{Unidades Vendidas en 180 días}}{180}$$
  $$\text{Pérdida Diaria Estimada (C\$)} = \text{Demanda Diaria Promedio} \times \text{Precio Venta del Repuesto}$$
* **¿Por qué se diseñó así?** Permite cuantificar el impacto diario directo del desabasto, sirviendo como KPI de alarma contable.
* **¿En qué beneficia al negocio?** Justifica financieramente la prioridad de compra. Si un repuesto agotado genera una pérdida de C$ 1,500 diarios por quiebre de stock, el administrador sabe que debe adquirirlo inmediatamente por encima de otros.

### 7. Días de Inventario Disponible (DIO)
* **¿Qué hace?** Calcula el número de días promedio que tomaría liquidar todo el stock actual disponible en base al ritmo de venta de los últimos 30 días.
* **¿Qué busca resolver?** El sobre-almacenamiento y el estancamiento de liquidez en bodega.
* **¿Cómo lo hace?** 
  $$\text{DIO} = \frac{\text{Existencia Total de Artículos}}{\text{Unidades Vendidas Diarias Promedio (Últimos 30 días)}}$$
* **¿Por qué se diseñó así?** Es el estándar internacional financiero para medir la eficiencia del inventario.
* **¿En qué beneficia al negocio?** Indica la salud logística global. Un DIO alto (ej. $> 300$ días) alerta al gerente que tiene demasiada mercadería guardada y que el dinero tardará demasiado tiempo en regresar a la caja.

---

## 🔵 ENFOQUE C: Rentabilidad y Proyección (Planificación Financiera)

Mide la trayectoria económica del negocio y analiza tendencias a futuro para prever ingresos.

### 8. Previsión de Ingresos mediante Regresión Lineal por Mínimos Cuadrados
* **¿Qué hace?** Proyecta la facturación estimada para el próximo día o semana utilizando modelos estadísticos sobre los datos históricos de ventas.
* **¿Qué busca resolver?** La incertidumbre financiera y la falta de planificación en compras y presupuestos de egresos.
* **¿Cómo lo hace?** Ajusta la recta de regresión lineal $y = mx + c$:
  - $y$: Ventas proyectadas.
  - $x$: Intervalo de tiempo (días o semanas).
  - $m$: Pendiente de la tendencia (ritmo de crecimiento/decrecimiento).
  - $c$: Intercepto base.
  - **Ajuste del Modelo ($R^2$):** Coeficiente de determinación que mide qué porcentaje de las ventas reales se alinea con la recta predictiva.
* **¿Por qué se diseñó así?** Se entrena dinámicamente con los filtros de tiempo seleccionados en la consola, permitiendo predicciones adaptables a la estacionalidad del negocio.
* **¿En qué beneficia al negocio?** Permite planificar el flujo de caja. Si el modelo proyecta ingresos estables, la gerencia puede autorizar inversiones o compras grandes con proveedores sin temor a quedarse sin liquidez.

### 9. Simulador Run-Rate y Cumplimiento de Metas Mensuales
* **¿Qué hace?** Evalúa la progresión de las ventas acumuladas del mes en curso frente a una meta configurable (ej. C$ 600,000) y calcula el pronóstico de cierre de mes.
* **¿Qué busca resolver?** La falta de visibilidad del avance comercial. Evita sorpresas a fin de mes al alertar anticipadamente si se cumplirá la meta.
* **¿Cómo lo hace?**
  $$\text{Cierre Proyectado (Run-Rate)} = \left( \frac{\text{Ventas Acumuladas Mes Actual}}{\text{Días Transcurridos del Mes}} \right) \times \text{Días Totales del Mes}$$
  $$\text{Brecha Meta} = \text{Cierre Proyectado} - \text{Meta de Ventas}$$
  - Si la brecha es negativa, calcula:
    $$\text{Venta Diaria Requerida} = \frac{\text{Meta} - \text{Ventas Acumuladas}}{\text{Días Restantes}}$$
    $$\text{Aceleración Requerida} = \left( \frac{\text{Venta Diaria Requerida} - \text{Promedio Diario Actual}}{\text{Promedio Diario Actual}} \right) \times 100$$
* **¿Por qué se diseñó así?** Se diseñó con inputs interactivos para que el gerente simule escenarios (ej. *"¿Qué pasa si subo la meta a C$ 800,000?"*).
* **¿En qué beneficia al negocio?** Permite implementar medidas correctivas a tiempo (como campañas de marketing o incentivos a vendedores) si se detecta que el Run-Rate proyectado quedará por debajo de la meta.

### 10. Venta Cruzada y Minería de Reglas de Asociación (Market Basket Analysis)
* **¿Qué hace?** Analiza miles de tickets históricos y propone combinaciones óptimas de productos (combos) que suelen ser comprados juntos.
* **¿Qué busca resolver?** La baja rotación de ciertos repuestos y la oportunidad perdida de incrementar el ticket promedio de compra por cliente.
* **¿Cómo lo hace?** Aplica el modelo analítico basado en reglas Apriori:
  - **Soporte:** Probabilidad de que un ticket contenga el Producto A y el Producto B: $P(A \cap B)$.
  - **Confianza:** Probabilidad de que lleven B si ya compraron A: $P(B|A)$.
  - **Elevación (Lift):** Fuerza de la regla.
    $$\text{Lift} = \frac{P(A \cap B)}{P(A) \times P(B)}$$
    Un $\text{Lift} > 1.0$ indica que los productos son fuertemente complementarios y no se compran juntos por azar.
* **¿Por qué se diseñó así?** Se programó en el backend para buscar coocurrencias significativas y calcular sugerencias reales de ahorro en caja.
* **¿En qué beneficia al negocio?** Incrementa directamente la facturación por cliente. Al sugerir combos basados en datos reales (como pastillas de freno + líquido de frenos con descuento), los vendedores pueden ofrecer venta cruzada efectiva y liberar stock complementario.

### 10b. Distribución de Métodos de Pago Dinámica en Proyecciones
* **¿Qué hace?** Muestra el volumen monetario total facturado desglosado por Efectivo, Transferencia y Tarjeta procesado en los últimos 30 días.
* **¿Qué busca resolver?** Evitar que la visualización financiera de cobros sea sesgada. Al no estar guardado el método de pago en columnas estáticas de venta, el sistema realiza la sumatoria analizando la propiedad `pago_detalles` de cada ticket.
* **¿Cómo lo hace?** Analiza en tiempo real el campo JSON de cobro de cada factura completada:
  - Lee los montos declarados de `efectivo`, `tarjeta` y `transferencia` en la transacción, deduciendo el vuelto y calculando el abono real multicanal.
* **¿Por qué se diseñó así?** Evita el sesgo de que el 100% de la facturación se marque como efectivo por falta de registros de base de datos.
* **¿En qué beneficia al negocio?** Otorga un diagnóstico real de los hábitos de cobro del local para negociar comisiones con terminales POS de tarjetas y optimizar los procesos de conciliación bancaria.

---

# 📊 DASHBOARD 2: Reporte Financiero Consolidado (`/finances`)

Enfocado en la administración general y contabilidad del negocio. Ofrece un diseño limpio en tono claro, optimizado para exportarse a PDF o imprimirse en formato físico A4.

### 11. Margen Comercial y ROI por Categoría
* **¿Qué hace?** Analiza el retorno porcentual de inversión real obtenido por el negocio sobre las ventas de repuestos, segmentado por las principales categorías de productos.
* **¿Qué busca resolver?** La incertidumbre sobre qué repuestos están dejando ganancias reales y cuáles tienen márgenes de ganancia demasiado bajos.
* **¿Cómo lo hace?** Compara el precio de venta ($P_v$) con el costo de adquisición del proveedor ($C_a$).
  $$\text{Margen Comercial (\%)} = \left( \frac{P_v - C_a}{C_a} \right) \times 100$$
* **¿Por qué se diseñó así?** Se representa en gráficos de barra claros para identificar de un vistazo las categorías más lucrativas.
* **¿En qué beneficia al negocio?** Ayuda a redefinir precios. Si la categoría de "Suspensión" tiene un ROI muy bajo, el gerente puede ajustar la lista de precios o buscar un proveedor más económico.

### 12. Valoración de Capital en Bodega (Costo vs. Venta)
* **¿Qué hace?** Totaliza el capital neto invertido en la mercadería física almacenada y proyecta el valor total a precio de venta al público.
* **¿Qué busca resolver?** La falta de un inventario valorado para la declaración de activos y contabilidad general.
* **¿Cómo lo hace?** Ejecuta la suma de existencias activas multiplicadas por el costo y la venta:
  $$\text{Valor Costo} = \sum (\text{Existencia} \times \text{Costo})$$
  $$\text{Valor Venta} = \sum (\text{Existencia} \times \text{Precio Venta})$$
* **¿Por qué se diseñó así?** Muestra ambos indicadores side-by-side para evidenciar el margen bruto de ganancia latente en la bodega.
* **¿En qué beneficia al negocio?** Facilita la auditoría patrimonial del local y demuestra el respaldo financiero de la empresa ante solicitudes de crédito bancario.

---

# 💵 DASHBOARD 3: Punto de Venta (POS) y Gestión de Caja (`/cash-report`)

El panel transaccional cotidiano del local, donde operan los cajeros y se registra la entrada de dinero en efectivo.

### 13. Arqueo Ciego de Caja y Auditoría de Descuadres
* **¿Qué hace?** Obliga al cajero a contar y declarar físicamente el dinero de la caja al finalizar el turno, sin que el sistema le muestre la cantidad esperada en pantalla.
* **¿Qué busca resolver?** El fraude de caja, donde el cajero ajusta o sustrae dinero sabiendo exactamente cuánto calcula el sistema.
* **¿Cómo lo hace?** El cajero ingresa el monto total físico. El sistema realiza la comparación interna y registra la diferencia:
  $$\text{Diferencia} = \text{Monto Declarado} - \text{Monto Esperado}$$
* **¿Por qué se diseñó así?** Es el estándar de control interno contable de "arqueo ciego" para garantizar total objetividad en la rendición de cuentas.
* **¿En qué beneficia al negocio?** Garantiza la honestidad operacional. Cualquier descuadre es registrado de inmediato con el nombre del usuario y la fecha para que el administrador tome medidas correctivas.

### 14. Control de Egresos e Ingresos Operativos de Caja
* **¿Qué hace?** Permite registrar entradas y salidas de efectivo justificadas dentro del turno abierto (como pago de fletes o compra de insumos de limpieza).
* **¿Qué busca resolver?** La pérdida de control sobre los gastos menores (caja chica), que terminan descuadrando los arqueos de caja al final del día.
* **¿Cómo lo hace?** Modifica dinámicamente el dinero esperado sumando o restando el egreso/ingreso documentado.
  $$V_{\text{esperado}} = V_{\text{inicial}} + \text{Ventas en Efectivo} + \text{Ingresos Extras} - \text{Egresos Registrados}$$
* **¿Por qué se diseñó así?** Obliga a ingresar una descripción obligatoria y un monto para cada movimiento transaccional.
* **¿En qué beneficia al negocio?** Asegura que cada centavo que entra o sale de la caja chica esté plenamente justificado y registrado en el historial de auditoría de cierres del local.
