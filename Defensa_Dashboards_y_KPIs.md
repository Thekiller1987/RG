# 🎓 Guía Suprema de Defensa: Los 3 Dashboards e Inteligencia de Negocios (BI)

Este documento es la guía analítica oficial para la defensa del sistema de **Multirepuestos RG**. Detalla la arquitectura lógica de los 3 dashboards, analizando cada indicador clave mediante cinco ejes fundamentales: **¿Por qué existe? (Justificación)**, **¿Qué hace? (Definición Operativa)**, **¿Para qué sirve? (Objetivo Estratégico)**, **¿Cómo se calcula? (Fórmula/Mecánica)** y **Ejemplo Práctico Aplicado**.

---

# 🧠 ESTRUCTURA GENERAL Y COHERENCIA DE ROLES

Para garantizar la máxima seguridad operativa y la pertinencia de la información en todos los niveles jerárquicos de Multirepuestos RG, el sistema se estructuró en **tres dashboards distintos**. Esta separación lógica evita mezclar flujos de efectivo transaccionales con análisis de rentabilidad gerencial, protegiendo información de margen comercial sensible de accesos no autorizados.

## 1. Dashboard 1: Consola BI & Analítica Avanzada (`/bi-console`)
* **Destinatario:** Gerente General y Director Operativo.
* **Diseño Visual:** Entorno visual Cyberpunk Premium en modo oscuro de alta tecnología. El fondo oscuro con colores vibrantes (naranja, azul cian y verde neón) está diseñado específicamente para reducir la fatiga visual durante largas jornadas de monitoreo de datos.
* **Propósito:** Centro analítico de la empresa. Se divide en tres enfoques especializados:
  * **Flujo de Caja y Auditoría:** Centrado en la seguridad del punto de venta y en la auditoría del comportamiento transaccional físico.
  * **Rotación de Inventario:** Analiza qué productos rotan, el capital inmovilizado en stock y detecta quiebres de mercadería.
  * **Rentabilidad y Proyección:** Proyecta el rumbo financiero mediante modelos predictivos y propone combos de productos basados en minería de reglas de asociación.

## 2. Dashboard 2: Reporte Financiero Consolidado (`/finances`)
* **Destinatario:** Contador General y Administrador Financiero.
* **Diseño Visual:** Estilo corporativo formal, limpio, con fondo blanco y alto contraste. Optimizado para impresión física en formato A4 o exportación directa a PDF.
* **Propósito:** Mostrar la salud patrimonial y los márgenes del negocio, enfocándose en la valoración de los activos en bodega y el retorno porcentual de inversión (ROI) por familia de repuestos.

## 3. Dashboard 3: POS y Gestión Operativa de Caja (`/cash-report`)
* **Destinatario:** Cajeros del Local y Supervisor de Caja.
* **Diseño Visual:** Interfaz rápida de mostrador y alta legibilidad para facturación ágil.
* **Propósito:** Administrar el efectivo en tiempo real. Proporciona arqueos ciegos obligatorios, control de egresos de caja chica y emisión de cierres diarios.

---

# 📊 DESGLOSE TÉCNICO DE LOS 17 KPIs DE DEFENSA

---

## 🟢 ENFOQUE 1: Flujo de Caja y Auditoría (Seguridad Operativa)

### 1. Historial Forense y Consolidado de Auditoría Transaccional
* **¿Por qué existe? (Justificación):** En tiendas de repuestos con alto tráfico, la conciliación manual de fin de mes de múltiples bancos y pasarelas de pago toma días enteros. Los errores en el registro de si un pago fue efectivo, transferencia o tarjeta distorsionan los estados contables y facilitan fraudes.
* **¿Qué hace? (Definición Operativa):** Grafica las diferencias de arqueos de caja recientes clasificándolos por colores de alerta de riesgo (Rojo: Faltante, Amarillo: Sobrante, Verde: Cuadre Perfecto) y consolida la sumatoria de todos los fondos cobrados y auditados agrupándolos por su canal de origen.
* **¿Para qué sirve? (Objetivo Estratégico):** Identificar patrones de descuadre sistemáticos en el tiempo para auditoría interna y posibilitar la conciliación inmediata de depósitos bancarios frente a los cierres diarios de caja.
* **¿Cómo se calcula? (Fórmula y Mecánica):** Realiza una agregación SQL sobre el histórico de cierres de caja dentro del rango de fechas:
  `Cobros Consolidados = Suma(Efectivo) + Suma(Tarjeta) + Suma(Transferencia) + Suma(Dólares × Tipo Cambio)`
* **Ejemplo Práctico:** Del 1 al 10 de junio se realizan 20 cierres de caja. El consolidador de auditoría totaliza de forma inmediata: Efectivo: C$ 80,000; Tarjeta: C$ 55,000; Transferencia: C$ 90,000; Dólares: $1,500 (equivalente a C$ 54,750 con tipo de cambio de 36.5). El auditor abre su banca en línea y confirma que la suma de transferencias en el banco sume exactamente C$ 90,000, detectando cualquier inconsistencia de inmediato.

### 2. Eficiencia de Arqueo de Caja (Últimos 30 días)
* **¿Por qué existe? (Justificación):** Los faltantes en caja suelen ignorarse si ocurren en montos pequeños ("robo hormiga"). Sin una métrica agregada que mida la disciplina del cajero en un periodo de tiempo, es imposible premiar la honestidad o detectar malos hábitos operativos.
* **¿Qué hace? (Definición Operativa):** Calcula la exactitud de los arqueos del local midiendo la proporción de cierres que terminaron con un descuadre de exactamente C$ 0.00 sobre el total de arqueos del mes.
* **¿Para qué sirve? (Objetivo Estratégico):** Fomentar una cultura de precisión en el manejo de efectivo de mostrador y evaluar objetivamente el desempeño laboral del personal de facturación.
* **¿Cómo se calcula? (Fórmula y Mecánica):**
  `Diferencia de Turno = Efectivo Declarado Físicamente - Efectivo Esperado por Sistema`
  `Eficiencia de Arqueo (%) = (Cierres con Diferencia = 0 / Total de Cierres en 30 días) × 100`
* **Ejemplo Práctico:** En los últimos 30 días, la sucursal registró 40 cierres de caja. En 38 de ellos, la diferencia de arqueo fue de exactamente C$ 0.00. En 2 cierres, se registraron faltantes de C$ 100 y C$ 50 respectivamente. El sistema calcula la eficiencia del periodo en: `(38 / 40) × 100 = 95.0%`, permitiendo al administrador auditar directamente los 2 turnos con fallas.

### 3. Recálculo Forense de Métodos de Pago desde Logs JSON
* **¿Por qué existe? (Justificación):** El software de punto de venta puede fallar al escribir en la base de datos o registrar desgloses vacíos en cierres debido a caídas de red. Esto causa que registros antiguos muestren cero en tarjetas o efectivo, rompiendo la integridad de reportes históricos.
* **¿Qué hace? (Definición Operativa):** Reconstruye de forma dinámica el desglose real de cobros leyendo el log completo de ventas en formato JSON del cierre de caja, actuando como un sistema autolimpiante en el backend.
* **¿Para qué sirve? (Objetivo Estratégico):** Garantizar la auditabilidad del histórico financiero a largo plazo, evitando lagunas en auditorías retrospectivas.
* **¿Cómo se calcula? (Fórmula y Mecánica):** El backend lee el log en `detalles_json` del cierre y procesa transacción por transacción:
  `Efectivo Neto = Suma(Monto Efectivo) + Suma(Monto Dólares × Tasa) - Suma(Cambio Entregado)`
  `Tarjeta = Suma(Monto Tarjeta)`
  `Transferencia = Suma(Monto Transferencia)`
* **Ejemplo Práctico:** Un arqueo del año pasado guardó accidentalmente C$ 0.00 en la columna de Tarjetas. Al ser consultado por la Consola BI, el backend detecta el valor vacío, procesa el log `detalles_json` del cierre y suma 5 transacciones que se cobraron vía tarjeta de crédito por un total de C$ 8,400. El tablero muestra instantáneamente C$ 8,400 en tarjetas, corrigiendo de forma transparente el error contable.

### 4. Alertas de Anomalía en Caja y Seguridad
* **¿Por qué existe? (Justificación):** Mantener un exceso de efectivo acumulado en las cajas de mostrador convierte al local en un objetivo atractivo para robos. Asimismo, mantener sesiones abiertas por más de 24 horas desvirtúa el proceso de cuadre y permite que múltiples cajeros operen sin rendir cuentas individuales.
* **¿Qué hace? (Definición Operativa):** Analiza continuamente las cajas abiertas y muestra banderas rojas de advertencia si los umbrales de dinero físico en caja o de duración del turno superan los límites seguros.
* **¿Para qué sirve? (Objetivo Estratégico):** Proteger físicamente el dinero de la tienda mediante depósitos oportunos a bóveda y asegurar la disciplina operativa de cierres de turno diarios.
* **¿Cómo se calcula? (Fórmula y Mecánica):**
  - Alerta de Retiro: Si `Efectivo Neto Estimado en Turno > C$ 15,000.00`
  - Alerta de Horario: Si `(Hora Actual - Hora de Apertura de Turno) > 24 horas`
* **Ejemplo Práctico:** La Caja 1 lleva acumulados C$ 18,200 de ventas en efectivo en un turno que inició hace 26 horas. La consola de BI muestra de inmediato dos alertas parpadeantes en rojo. El gerente acude al punto de venta, realiza un "Retiro de Seguridad" de C$ 13,000 en el POS (enviándolo a bóveda) y ordena al cajero hacer su cierre de turno, restableciendo el saldo esperado a C$ 5,200 y reduciendo la exposición al riesgo de asalto.

---

## 🟡 ENFOQUE 2: Rotación de Inventario (Eficiencia Logística)

### 5. Clasificación ABC de Inventario (Distribución y Balance Financiero)
* **¿Por qué existe? (Justificación):** El catálogo de repuestos automotrices suele tener miles de artículos. Si no se conoce qué productos generan el volumen de negocio y cuáles no rotan, se termina invirtiendo el capital de la empresa en piezas obsoletas mientras se descuidan las de mayor demanda.
* **¿Qué hace? (Definición Operativa):** Segmenta todos los repuestos según la cantidad de unidades vendidas en un periodo y calcula para cada categoría (A: Alta rotación, B: Media rotación, C: Baja rotación) la cantidad de ítems en catálogo, el stock físico acumulado en bodega y la valoración en córdobas del capital inmovilizado en estanterías.
* **¿Para qué sirve? (Objetivo Estratégico):** Asignar el capital de trabajo de forma inteligente, permitiendo asegurar compras de Clase A y planificar estrategias de liquidación para el inventario de Clase C.
* **¿Cómo se calcula? (Fórmula y Mecánica):**
  - Clase A: Ventas > 10 unidades. | Clase B: Ventas de 4 a 10 unidades. | Clase C: Ventas <= 3 unidades.
  - `Capital Inmovilizado por Clase = Suma(Stock Físico en Bodega × Costo Compra de cada Repuesto)`
* **Ejemplo Práctico:** El análisis ABC muestra que la Clase C contiene 1,500 productos con un stock acumulado de 4,000 unidades, representando C$ 380,000 de capital congelado en estantes sin generar ventas. En contraste, la Clase A tiene un capital inmovilizado de C$ 90,000 pero rota 12 veces más rápido. El gerente decide congelar las compras de Clase C y crea combos promocionales para liquidar ese stock muerto, liberando flujo de efectivo.

### 6. Sugerencia de Reposición Automática de Clase A
* **¿Por qué existe? (Justificación):** Los repuestos de alta rotación (filtros, pastillas de freno, bujías) generan el flujo transaccional diario. Quedarse sin stock de estas piezas clave debido a olvidos en compras provoca pérdida inmediata de ventas y de clientes recurrentes.
* **¿Qué hace? (Definición Operativa):** Identifica todos los productos de Clase A (alta rotación) cuyo stock disponible ha caído a niveles críticos (5 unidades o menos) y calcula la cantidad óptima a comprar junto con el presupuesto de compra estimado.
* **¿Para qué sirve? (Objetivo Estratégico):** Automatizar y agilizar el proceso de adquisiciones y evitar la ruptura de stock en productos estrella.
* **¿Cómo se calcula? (Fórmula y Mecánica):**
  Si Producto es Clase A y `Existencia Actual <= 5`:
  - `Cantidad Sugerida a Comprar = Máximo(10, 15 - Existencia Actual)`
  - `Presupuesto Proyectado = Cantidad Sugerida × Costo de Compra`
* **Ejemplo Práctico:** El "Filtro de Aceite Hilux" (Clase A) cuenta con solo 2 unidades físicas en la estantería. El motor analítico de la consola BI calcula que se requiere comprar: `15 - 2 = 13` unidades (ya que 13 es mayor al pedido mínimo de 10). A un costo unitario de C$ 180, el sistema genera de forma automática una recomendación de compra de 13 unidades por un valor de C$ 2,340, lista para ser enviada al proveedor.

### 7. Pérdida Proyectada por Quiebre de Stock (Stockout Loss)
* **¿Por qué existe? (Justificación):** Tradicionalmente, cuando un producto se agota (stock = 0), su ausencia no se refleja en los balances de pérdidas contables, ya que simplemente "no hubo venta". No obstante, la pérdida es real y afecta directamente la rentabilidad mensual.
* **¿Qué hace? (Definición Operativa):** Identifica los repuestos que están agotados (Existencia = 0) pero registran ventas históricas en los últimos 180 días, y calcula cuánto dinero diario está dejando de percibir el negocio tanto en ingresos brutos como en utilidad neta.
* **¿Para qué sirve? (Objetivo Estratégico):** Cuantificar el costo de oportunidad del desabastecimiento, permitiendo al administrador priorizar compras basándose en el impacto financiero de la escasez.
* **¿Cómo se calcula? (Fórmula y Mecánica):**
  - `Ventas Diarias Promedio (180d) = Unidades Vendidas en 180 días / 180`
  - `Pérdida Diaria en Ventas (C$) = Ventas Diarias Promedio × Precio Venta Público`
  - `Pérdida Diaria en Utilidad (C$) = Ventas Diarias Promedio × (Precio Venta Público - Costo Compra)`
* **Ejemplo Práctico:** Las "Pastillas de Freno Hilux" están agotadas (stock = 0). Históricamente se vendieron 180 unidades en los últimos 180 días (promedio de 1 unidad diaria). Con un precio de venta de C$ 900 y costo de C$ 600, el sistema alerta que el negocio pierde C$ 900 diarios en facturación y C$ 300 diarios en utilidad neta. Si el repuesto tarda 10 días en llegar, la pérdida total acumulada de ganancia real es de C$ 3,000, justificando realizar un pedido express.

### 8. Riesgo de Capital Estancado (Dead Stock)
* **¿Por qué existe? (Justificación):** El inventario almacenado en bodega que no rota representa dinero en efectivo congelado. Con el tiempo, estas piezas corren el riesgo de dañarse, volverse obsoletas o requerir altos costos de espacio físico.
* **¿Qué hace? (Definición Operativa):** Alerta y totaliza el costo financiero de aquellos productos en existencia física (Stock > 0) que no han registrado una sola venta en los últimos 90 días o más.
* **¿Para qué sirve? (Objetivo Estratégico):** Identificar el stock muerto y diseñar estrategias de salida (como descuentos agresivos o paquetes de promoción) para retornar liquidez al negocio.
* **¿Cómo se calcula? (Fórmula y Mecánica):** Filtra productos activos donde `Existencia Actual > 0` y la fecha de su última venta registrada sea mayor a 90 días (o no posean ventas en absoluto):
  - `Capital Estancado (C$) = Suma(Existencia Actual de cada Producto inactivo × Costo Compra)`
* **Ejemplo Práctico:** Un lote de 8 "Alternadores Toyota Corolla 2005" con un costo unitario de C$ 2,500 (total C$ 20,000) no ha tenido ninguna venta en los últimos 110 días. El sistema los cataloga como "Riesgo de Capital Estancado" sumando C$ 20,000 al indicador global. El administrador decide lanzar una promoción especial ofreciendo el alternador a precio de costo para recuperar el efectivo atrapado y destinarlo a mercadería de alta rotación.

### 9. Días de Inventario Disponible (DIO)
* **¿Por qué existe? (Justificación):** Para el análisis de salud logística general, el volumen físico bruto de la bodega (ej. 10,000 piezas) no dice nada sobre su velocidad de rotación. Se requiere una métrica de tiempo que traduzca el tamaño físico del stock en tiempo estimado de liquidación.
* **¿Qué hace? (Definición Operativa):** Calcula cuántos días le tomaría al negocio agotar el inventario actual basándose en el ritmo de ventas de los últimos 30 días.
* **¿Para qué sirve? (Objetivo Estratégico):** Medir la agilidad de la bodega, comparar la eficiencia logística contra estándares de la industria y evitar el sobrestock.
* **¿Cómo se calcula? (Fórmula y Mecánica):**
  - `Venta Diaria Promedio (30d) = Unidades totales vendidas en 30 días / 30`
  - `DIO = Stock Físico Total en Bodega / Venta Diaria Promedio (30d)`
* **Ejemplo Práctico:** El almacén de Multirepuestos RG cuenta con 6,000 repuestos en stock. En el último mes, se vendieron un total de 900 repuestos (promedio de 30 unidades al día). El DIO resultante es: `6,000 / 30 = 200 días`. Si el objetivo del negocio es mantener el DIO en 120 días, la administración sabe que debe suspender compras masivas no urgentes hasta que el volumen en bodega baje y la liquidez aumente.

---

## 🔵 ENFOQUE 3: Rentabilidad y Proyección (Planificación Financiera)

### 10. Regresión Financiera de Ventas, Costos y Utilidad Neta
* **¿Por qué existe? (Justificación):** Analizar únicamente las ventas históricas de forma empírica impide anticipar la rentabilidad futura. Planificar el crecimiento empresarial requiere modelos matemáticos que estimen por separado cómo evolucionarán los ingresos y los costos para asegurar que las ganancias sigan subiendo.
* **¿Qué hace? (Definición Operativa):** Procesa el histórico de ventas brutas, costo de adquisición (COGS) y utilidad neta real mediante regresión de mínimos cuadrados e incluye proyecciones para los meses futuros con líneas de tendencia y cálculo de R² (coeficiente de determinación).
* **¿Para qué sirve? (Objetivo Estratégico):** Evaluar de forma confiable la viabilidad a futuro del negocio, proyectar márgenes de utilidad neta y programar inversiones importantes basándose en tendencias estadísticas sólidas.
* **¿Cómo se calcula? (Fórmula y Mecánica):**
  Ajusta la ecuación lineal `y = m · x + b` para cada una de las series (Venta, Costo, Utilidad):
  - `y` = Monto estimado | `x` = Período de tiempo (mes proyectado)
  - `m` = Coeficiente de inclinación (tendencia de crecimiento/decrecimiento mensual)
  - `b` = Intercepto de la recta | Se calcula `R²` para asegurar el ajuste estadístico del modelo lineal.
* **Ejemplo Práctico:** En los últimos 4 meses, la utilidad neta mensual ha crecido a un ritmo constante de C$ 8,000 mensuales, con un R² de 0.96. El algoritmo proyecta que para los meses 5 y 6 la utilidad neta será de C$ 52,000 y C$ 60,000 respectivamente. El gerente utiliza esta proyección positiva para contratar un ayudante de bodega adicional, sabiendo que el flujo de efectivo proyectado respaldará el gasto operativo extra.

### 11. Simulador Run-Rate y Cumplimiento de Metas Mensuales
* **¿Por qué existe? (Justificación):** Evaluar el cumplimiento de las metas comerciales al final del mes es una estrategia pasiva. Si las ventas van a la baja en la primera quincena, se deben tomar acciones comerciales inmediatas (como rebajas o metas dinámicas de ventas) antes de que el periodo termine.
* **¿Qué hace? (Definición Operativa):** Estima en tiempo real el cierre de ventas del mes en curso basándose en la venta promedio diaria actual, y calcula la brecha respecto a la meta configurada, la venta diaria necesaria para corregir déficits y la aceleración comercial requerida.
* **¿Para qué sirve? (Objetivo Estratégico):** Controlar el presupuesto de ingresos mensuales de manera proactiva, aplicando correctivos en el transcurso del mes.
* **¿Cómo se calcula? (Fórmula y Mecánica):**
  - `Cierre Proyectado = (Venta Acumulada Mes / Días Transcurridos del Mes) × Días Totales del Mes`
  - `Brecha Meta = Cierre Proyectado - Meta Configurada`
  Si la brecha es negativa:
  - `Venta Diaria Requerida = (Meta Configurada - Venta Acumulada Mes) / Días Restantes del Mes`
  - `Aceleración Requerida (%) = ((Venta Diaria Requerida - Promedio Diario Actual) / Promedio Diario Actual) × 100`
* **Ejemplo Práctico:** La meta de junio es C$ 600,000. Al día 12 del mes, la venta acumulada es de C$ 200,000 (promedio diario de C$ 16,666). El sistema calcula el cierre proyectado: `(200,000 / 12) × 30 = C$ 500,000`. Esto genera un déficit proyectado de -C$ 100,000. El simulador indica que en los 18 días restantes se debe facturar un promedio diario de C$ 22,222, lo que exige una aceleración del `((22,222 - 16,666) / 16,666) × 100 = +33.3%`. El gerente convoca a los vendedores y lanza una campaña de ventas de kits de afinamiento para lograr la aceleración requerida.

### 12. Venta Cruzada y Minería de Reglas de Asociación (Algoritmo Apriori)
* **¿Por qué existe? (Justificación):** En repuestos automotrices, la mayoría de reparaciones requieren piezas complementarias (ej. pastillas con discos de freno, amortiguadores con bases). Si el vendedor no ofrece estos artículos relacionados, el negocio pierde facturación y el cliente sufre retrasos al tener que regresar por piezas olvidadas.
* **¿Qué hace? (Definición Operativa):** Analiza miles de combinaciones de productos en facturas históricas para identificar qué repuestos se compran juntos con mayor frecuencia, calculando la probabilidad y fuerza de la asociación (Soporte, Confianza y Lift).
* **¿Para qué sirve? (Objetivo Estratégico):** Diseñar combos comerciales basados en datos duros de consumo para aumentar la venta cruzada y el ticket promedio de compra por cliente.
* **¿Cómo se calcula? (Fórmula y Mecánica):**
  - `Soporte(A ∩ B) = Tickets con A y B / Total Tickets`
  - `Confianza(A -> B) = Tickets con A y B / Tickets con A`
  - `Lift(A -> B) = Confianza(A -> B) / Soporte(B)`
  Un valor de `Lift > 1.0` demuestra que la presencia del producto A estimula significativamente la compra del producto B de forma no aleatoria.
* **Ejemplo Práctico:** El motor Apriori analiza 4,000 facturas y detecta que el 65% de quienes compraron "Bujías de Iridio" compraron también "Cables de Bujía", arrojando un Lift de 3.8. El sistema propone formalmente la creación del "Combo Encendido RG" (Bujías + Cables) con un 8% de descuento. Al ofrecerlo en el mostrador, el ticket de venta promedio sube de C$ 800 a C$ 1,250.

### 13. Top 5 Repuestos de Mayor Rentabilidad (Utilidad Neta total)
* **¿Por qué existe? (Justificación):** Centrarse solo en los productos que más se venden ("best sellers" por volumen) es un error común. Un producto de bajo costo y alto volumen de venta (ej. arandelas) puede aportar menos ganancia real al negocio que un repuesto de alta gama que rota menos pero genera márgenes masivos.
* **¿Qué hace? (Definición Operativa):** Clasifica y muestra en una tabla de alta legibilidad (con nombres de productos completos) los 5 repuestos que mayor utilidad neta total han aportado en el rango de fechas seleccionado.
* **¿Para qué sirve? (Objetivo Estratégico):** Direccionar las estrategias comerciales de marketing y compras a las piezas que realmente sostienen la rentabilidad del negocio.
* **¿Cómo se calcula? (Fórmula y Mecánica):**
  Para cada artículo vendido en el periodo:
  - `Utilidad Neta por Artículo = Cantidad Vendida × (Precio Venta Público - Costo Compra)`
  - Se ordenan de forma descendente en base a la utilidad neta total y se listan los primeros 5.
* **Ejemplo Práctico:** La "Cremallera de Dirección Hilux" vendió solo 8 unidades en el mes a un precio de C$ 12,000 (con costo de C$ 8,000), aportando `8 × 4,000 = C$ 32,000` de utilidad neta. En contraste, las "Bujías Standard" vendieron 600 unidades a C$ 100 (con costo de C$ 70), aportando `600 × 30 = C$ 18,000`. El sistema sitúa la cremallera de dirección en el primer puesto de rentabilidad, demostrando que la cremallera merece mayor prioridad de stock y publicidad que la bujía común.

---

## 🔴 ENFOQUE 4: Reporte Financiero Consolidado (`/finances`)

### 14. Margen Comercial y ROI por Categoría Financiera
* **¿Por qué existe? (Justificación):** Evaluar los márgenes producto por producto impide a la administración tener una visión global. El negocio necesita clasificar su rentabilidad por familias o categorías (Motores, Frenos, Suspensión) para definir políticas de precios generales y presupuestar las compras anuales.
* **¿Qué hace? (Definición Operativa):** Agrupa las ventas por categoría contable y calcula el Retorno de Inversión (ROI) comercial porcentual promedio obtenido sobre los costos de adquisición de la mercadería vendida.
* **¿Para qué sirve? (Objetivo Estratégico):** Identificar qué líneas de negocio son sumamente rentables y renegociar precios con proveedores de categorías con bajo rendimiento.
* **¿Cómo se calcula? (Fórmula y Mecánica):**
  - `ROI Categoría (%) = ((Ventas Totales de la Categoría - Costo de la Mercadería Vendida) / Costo de la Mercadería Vendida) × 100`
* **Ejemplo Práctico:** La categoría "Frenos" genera C$ 300,000 en ventas con un costo de compra de C$ 187,500. Su ROI comercial es del `((300,000 - 187,500) / 187,500) × 100 = 60.0%`. Por otro lado, la categoría "Sistema Eléctrico" genera C$ 100,000 en ventas con un costo de C$ 80,000 (ROI de 25.0%). Al ver el reporte contable, el administrador decide ajustar la lista de precios del sistema eléctrico para llevar el ROI de esa línea a un mínimo del 40%.

### 15. Valoración de Capital de Trabajo en Bodega (Costo vs. Venta Proyectada)
* **¿Por qué existe? (Justificación):** El inventario de una importadora o distribuidora de repuestos representa la mayor parte de su patrimonio. No conocer el valor monetario preciso de las existencias impide presentar balances financieros verídicos a bancos para solicitar créditos o evaluar la salud de la inversión.
* **¿Qué hace? (Definición Operativa):** Suma el costo de adquisición de todas las existencias en inventario y calcula simultáneamente el valor potencial de venta, detallando de esta forma el margen latente del almacén.
* **¿Para qué sirve? (Objetivo Estratégico):** Respaldar balances generales corporativos, auditar pérdidas en caso de siniestros cubiertos por seguros y conocer la ganancia potencial latente en bodega.
* **¿Cómo se calcula? (Fórmula y Mecánica):**
  - `Valoración a Costo (C$) = Suma(Existencia Actual de cada Repuesto × Costo Compra)`
  - `Valoración a Venta (C$) = Suma(Existencia Actual de cada Repuesto × Precio Venta)`
  - `Ganancia Latente en Bodega = Valoración a Venta - Valoración a Costo`
* **Ejemplo Práctico:** La base de datos registra 12,000 piezas en el inventario. La sumatoria a costo es de C$ 1,400,000, y a precio de venta es de C$ 2,250,000. El administrador puede certificar ante una entidad bancaria que la empresa cuenta con C$ 1.4 millones en activos realizables de inventario y proyecta un beneficio bruto potencial de C$ 850,000 sobre esas existencias.

---

## 🔴 ENFOQUE 5: POS y Gestión Operativa de Caja (`/cash-report`)

### 16. Arqueo Ciego de Caja y Auditoría Operativa
* **¿Por qué existe? (Justificación):** En un arqueo "abierto", donde el cajero puede ver en pantalla que el sistema espera C$ 7,500 en efectivo, si el cajero cuenta físicamente C$ 7,550 puede sustraer los C$ 50 sobrantes sin levantar sospechas. Si cuenta C$ 7,450, puede rellenarlo con su dinero para ocultar un error de cambio. Ambos escenarios ocultan problemas operativos y distorsionan la auditoría.
* **¿Qué hace? (Definición Operativa):** Obliga al cajero a ingresar de forma manual el dinero físico contado en caja sin mostrarle el cálculo del sistema. El sistema realiza la comparación a nivel de base de datos e informa de inmediato la diferencia al administrador.
* **¿Para qué sirve? (Objetivo Estratégico):** Garantizar la veracidad e imparcialidad del proceso de arqueo de caja chica y desalentar irregularidades en el mostrador.
* **¿Cómo se calcula? (Fórmula y Mecánica):**
  - `Diferencia de Arqueo = Efectivo Declarado (Ingresado por Cajero) - Efectivo Calculado por el Sistema`
* **Ejemplo Práctico:** Al finalizar el turno de la tarde, el cajero cuenta el efectivo físico en su gaveta e introduce en el sistema C$ 5,820. El sistema calcula internamente un esperado de C$ 5,850 basándose en los registros de facturación de las ventas del día. El arqueo se procesa con una diferencia de -C$ 30.00 (faltante), enviando la alerta al administrador y guardando un log forense inalterable con fecha, hora y cajero.

### 17. Control de Egresos e Ingresos Operativos de Caja Chica
* **¿Por qué existe? (Justificación):** Durante la operación diaria, es necesario utilizar efectivo directo de la caja para gastos menores rápidos (fletes, agua embotellada, insumos rápidos). Si estos egresos menores no se registran en el mismo instante, el arqueo final del cajero arrojará un faltante inexplicable, entorpeciendo la auditoría contable.
* **¿Qué hace? (Definición Operativa):** Registra y clasifica las entradas y salidas excepcionales de efectivo realizadas dentro del turno de caja abierto, detallando el monto, el concepto y recalculando en tiempo real el efectivo que debe haber físicamente.
* **¿Para qué sirve? (Objetivo Estratégico):** Transparentar el gasto menor operativo del negocio y evitar la generación de falsos descuadres en los cierres de turno.
* **¿Cómo se calcula? (Fórmula y Mecánica):**
  - `Efectivo Esperado = Saldo Inicial de Apertura + Ventas en Efectivo + Ingresos Registrados - Egresos Registrados`
* **Ejemplo Práctico:** Una caja inicia el día con C$ 2,000 de fondo de cambio. Realiza ventas en efectivo por C$ 5,000. Por la tarde, el administrador retira C$ 350 para pagar la papelería de la oficina y registra en el POS: "Egreso de Caja: Compra de Resmas de Papel - C$ 350". El sistema calcula que al final del día el efectivo esperado es de `2,000 + 5,000 - 350 = C$ 6,650`. El cajero entrega C$ 6,650 y la caja cuadra perfectamente gracias al registro oportuno de los egresos.

---

# 🛡️ DEFENSA DE ALINEAMIENTO: CUMPLIMIENTO ABSOLUTO DE KPIs

La arquitectura de tres tableros diseñada para Multirepuestos RG cumple con la totalidad de los KPIs gracias a tres principios metodológicos fundamentales:

1. **Separación de Niveles de Decisión (Roles Coherentes):**
   * **Operativo:** El cajero opera exclusivamente el *Punto de Venta* (`/cash-report`), interactuando únicamente con el arqueo ciego y los movimientos de egresos cotidianos. Esto evita filtraciones de márgenes de beneficio.
   * **Táctico:** El contador visualiza el *Reporte Financiero* (`/finances`), encargado del balance de bodega y el ROI contable por categorías para auditoría tributaria y patrimonial.
   * **Estratégico:** El gerente dispone del *Panel de BI* (`/bi-console`), desde donde toma decisiones críticas y proyecta compras y ventas con la analítica más avanzada sin interferir con la operación diaria.

2. **Diferenciación Estilística por Escenario:**
   * La Consola BI utiliza el **modo oscuro cyberpunk** para facilitar la concentración analítica y mitigar el agotamiento visual del gerente.
   * El Reporte Financiero utiliza un **modo claro clásico de alto contraste** optimizado para su exportación limpia y lectura en PDF o impresión en papel físico.

3. **Prevención de Pérdidas y Control de Riesgos Activo:**
   Los dashboards no son meros visualizadores pasivos de datos; son sistemas activos que **previenen fugas** mediante alarmas operativas en efectivo, automatizan compras críticas de reposición logrando mantener el stock estrella, y visibilizan costos ocultos calculando la utilidad neta diaria que se pierde por desabastecimiento.
