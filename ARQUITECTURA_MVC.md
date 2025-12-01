# Arquitectura MVC - AhorraApp

## 📁 Estructura del Proyecto

```
AhorraApp/
├── models/              # MODELO - Capa de Datos
│   ├── UserModel.js
│   ├── TransactionModel.js
│   ├── BudgetModel.js
│   └── index.js
│
├── controllers/         # CONTROLADOR - Lógica de Negocio
│   ├── AuthController.js
│   ├── TransactionController.js
│   ├── BudgetController.js
│   └── index.js
│
├── screens/            # VISTA - Interfaz de Usuario
│   ├── Autenticacion.js
│   ├── Registro.js
│   ├── Sesion.js
│   ├── Ingresos.js
│   ├── Gastos.js
│   ├── Transacciones.js
│   ├── Presupuesto1.js
│   └── Notificaciones.js
│
├── services/           # SERVICIOS - Capa de Abstracción
│   ├── authService.js
│   ├── transactionService.js
│   ├── budgetService.js
│   └── database.js
│
└── context/            # Estado Global
    └── UserContext.js
```

## 🏗️ Separación de Responsabilidades

### 1. **MODELO (models/)** - Capa de Acceso a Datos
**Responsabilidad:** Operaciones CRUD directas con la base de datos SQLite

#### UserModel.js
- `create()` - Insertar nuevo usuario
- `findByEmail()` - Buscar por email
- `findById()` - Buscar por ID
- `findByCredentials()` - Buscar por email y password
- `updatePassword()` - Actualizar contraseña
- `update()` - Actualizar información del usuario

#### TransactionModel.js
- `create()` - Insertar nueva transacción
- `findByUser()` - Obtener todas las transacciones de un usuario
- `findFiltered()` - Buscar con filtros
- `findByType()` - Filtrar por tipo (INGRESO/GASTO)
- `findByCategory()` - Filtrar por categoría
- `findByCategoryAndDateRange()` - Filtrar por categoría y fechas
- `findById()` - Buscar por ID
- `update()` - Actualizar transacción
- `delete()` - Eliminar transacción
- `getTotalGastosByCategory()` - Calcular total de gastos por categoría
- `getSummary()` - Obtener resumen de ingresos y gastos

#### BudgetModel.js
- `create()` - Insertar nuevo presupuesto
- `findByUser()` - Obtener todos los presupuestos de un usuario
- `findExisting()` - Buscar presupuesto existente
- `findFiltered()` - Buscar con filtros
- `findById()` - Buscar por ID
- `findByCategoryAndPeriod()` - Buscar por categoría y período
- `update()` - Actualizar presupuesto
- `delete()` - Eliminar presupuesto

---

### 2. **CONTROLADOR (controllers/)** - Lógica de Negocio
**Responsabilidad:** Validaciones, reglas de negocio, orquestación de modelos

#### AuthController.js
- `validarEmail()` - Validar formato de email
- `validarTelefono()` - Validar formato de teléfono (10 dígitos)
- `registrarUsuario()` - Registrar con validaciones completas
- `iniciarSesion()` - Autenticar usuario
- `recuperarPassword()` - Restablecer contraseña con validaciones
- `actualizarUsuario()` - Actualizar datos con validaciones

**Reglas de Negocio:**
- Email debe tener formato válido
- Contraseña mínimo 6 caracteres
- Teléfono debe tener 10 dígitos
- Email único (no duplicados)

#### TransactionController.js
- `crearTransaccion()` - Crear con validaciones y alertas de presupuesto
- `obtenerTransacciones()` - Obtener todas
- `obtenerTransaccionesFiltradas()` - Filtrar transacciones
- `obtenerTransaccionesPorTipo()` - Filtrar por INGRESO/GASTO
- `obtenerTransaccionPorId()` - Obtener una específica
- `actualizarTransaccion()` - Actualizar con validaciones
- `eliminarTransaccion()` - Eliminar con verificación
- `obtenerResumenTransacciones()` - Calcular totales y balance

**Reglas de Negocio:**
- Monto debe ser > 0
- Tipo debe ser "INGRESO" o "GASTO"
- Al crear GASTO, verificar exceso de presupuesto
- Generar alertas si se excede 80% o 100% del presupuesto

#### BudgetController.js
- `crearPresupuesto()` - Crear con validaciones
- `obtenerPresupuestos()` - Obtener todos
- `obtenerPresupuestosFiltrados()` - Filtrar presupuestos
- `actualizarPresupuesto()` - Actualizar con validaciones
- `eliminarPresupuesto()` - Eliminar con verificación
- `verificarExcesoPorCategoria()` - **Lógica compleja:** Comparar gastos vs presupuesto
- `obtenerResumenPresupuestos()` - **Lógica compleja:** Combinar datos de presupuestos y transacciones

**Reglas de Negocio:**
- Monto debe ser > 0
- No permitir presupuestos duplicados (misma categoría y período)
- Si es MENSUAL, mes es obligatorio
- Calcular porcentaje usado y generar alertas
- Alertas: ≥80% = Warning, >100% = Error

---

### 3. **SERVICIO (services/)** - Capa de Abstracción
**Responsabilidad:** Interface entre Vistas y Controladores

#### authService.js
```javascript
export const registrarUsuario = (nombre, email, password, telefono) => 
  AuthController.registrarUsuario(nombre, email, password, telefono);

export const iniciarSesion = (email, password) => 
  AuthController.iniciarSesion(email, password);

export const recuperarPassword = (email, nuevaPassword) => 
  AuthController.recuperarPassword(email, nuevaPassword);
```

#### transactionService.js
```javascript
export const crearTransaccion = (usuarioId, tipo, monto, categoria, descripcion, fecha) => 
  TransactionController.crearTransaccion(usuarioId, tipo, monto, categoria, descripcion, fecha);

export const obtenerTransacciones = (usuarioId) => 
  TransactionController.obtenerTransacciones(usuarioId);

export const obtenerResumenTransacciones = (usuarioId, filtros) => 
  TransactionController.obtenerResumenTransacciones(usuarioId, filtros);
```

#### budgetService.js
```javascript
export const crearPresupuesto = (usuarioId, categoria, monto, periodo, mes, anio) => 
  BudgetController.crearPresupuesto(usuarioId, categoria, monto, periodo, mes, anio);

export const verificarExcesoPorCategoria = (usuarioId, categoria, mes, anio) => 
  BudgetController.verificarExcesoPorCategoria(usuarioId, categoria, mes, anio);

export const obtenerResumenPresupuestos = (usuarioId, mes, anio) => 
  BudgetController.obtenerResumenPresupuestos(usuarioId, mes, anio);
```

---

### 4. **VISTA (screens/)** - Interfaz de Usuario
**Responsabilidad:** Renderizado, eventos de usuario, navegación

Las vistas solo:
- Renderizan componentes visuales
- Capturan eventos del usuario (onPress, onChange)
- Llaman a los servicios
- Actualizan el estado local
- Manejan navegación

**NO contienen:**
- ❌ Consultas SQL directas
- ❌ Validaciones de negocio
- ❌ Cálculos complejos
- ❌ Lógica de comparación de datos

---

## 🔄 Flujo de Datos Completo

### Ejemplo: Crear una Transacción de Gasto

```
┌─────────────────────────────────────────────────────────────┐
│ 1. VISTA (screens/Gastos.js)                               │
│    Usuario presiona "Guardar Gasto"                        │
│    Llama: crearTransaccion(...)                            │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. SERVICIO (services/transactionService.js)               │
│    Delega al controlador                                   │
│    TransactionController.crearTransaccion(...)             │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. CONTROLADOR (controllers/TransactionController.js)      │
│    ✅ Valida: monto > 0, tipo válido, campos obligatorios │
│    Llama: TransactionModel.create(...)                     │
│    🔍 Lógica: Verificar presupuesto si es GASTO           │
│    Llama: BudgetController.verificarExcesoPorCategoria()   │
│    📊 Retorna: {success, transaccionId, alertaPresupuesto} │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. MODELO (models/TransactionModel.js)                     │
│    Ejecuta: INSERT INTO transacciones...                   │
│    Retorna: lastInsertRowId                                │
└─────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. BASE DE DATOS (SQLite)                                  │
│    Almacena la transacción                                 │
└─────────────────────────────────────────────────────────────┘
```

### Ejemplo: Verificar Exceso de Presupuesto (Lógica Compleja)

```
┌─────────────────────────────────────────────────────────────┐
│ CONTROLADOR (controllers/BudgetController.js)              │
│ verificarExcesoPorCategoria(usuarioId, categoria, mes, año)│
└────────────────────────┬────────────────────────────────────┘
                         │
         ┌───────────────┴───────────────┐
         ▼                               ▼
┌──────────────────────┐       ┌──────────────────────┐
│ BudgetModel          │       │ TransactionModel     │
│ findByCategoryAnd    │       │ getTotalGastos       │
│ Period()             │       │ ByCategory()         │
│                      │       │                      │
│ Retorna: presupuesto │       │ Retorna: totalGastado│
└──────────────────────┘       └──────────────────────┘
         │                               │
         └───────────────┬───────────────┘
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ CONTROLADOR - Lógica de Negocio                            │
│ 1. Calcula: porcentajeUsado = (gastado / presupuesto) * 100│
│ 2. Evalúa: excedido = gastado > presupuesto               │
│ 3. Genera mensaje según:                                   │
│    - Si > 100%: "Se excedió el presupuesto..."            │
│    - Si ≥ 80%: "Falta poco para llegar al límite..."      │
│ 4. Retorna: {success, excedido, porcentaje, mensaje}      │
└─────────────────────────────────────────────────────────────┘
```

---

## ✅ Beneficios de esta Arquitectura

### 1. **Separación Clara de Responsabilidades**
- Cada capa tiene una función específica
- Fácil de entender qué hace cada archivo

### 2. **Mantenibilidad**
- Cambios en la UI no afectan la lógica de negocio
- Cambios en la base de datos solo afectan los Modelos

### 3. **Testabilidad**
- Controladores y Modelos pueden testearse independientemente
- Mock fácil de servicios para testing de UI

### 4. **Reutilización**
- Lógica de negocio reutilizable en diferentes vistas
- Modelos reutilizables en diferentes controladores

### 5. **Escalabilidad**
- Fácil agregar nuevas funcionalidades
- Estructura sostenible a largo plazo

---

## 📋 Ejemplo de Uso en las Vistas

### Antes (Sin MVC - ❌ Malo)
```javascript
// Gastos.js - TODO mezclado
const guardarGasto = async () => {
  // Validaciones en la vista ❌
  if (!monto || monto <= 0) {
    Alert.alert('Error', 'Monto inválido');
    return;
  }
  
  // SQL directo en la vista ❌
  const db = await getDatabase();
  await db.runAsync('INSERT INTO transacciones...');
  
  // Lógica de negocio en la vista ❌
  const gastos = await db.getAllAsync('SELECT...');
  const total = gastos.reduce((sum, g) => sum + g.monto, 0);
  if (total > presupuesto) {
    Alert.alert('Excediste el presupuesto');
  }
};
```

### Después (Con MVC - ✅ Bueno)
```javascript
// Gastos.js - Solo UI y llamadas a servicios
import { crearTransaccion } from '../services/transactionService';

const guardarGasto = async () => {
  const resultado = await crearTransaccion(
    usuario.id,
    'GASTO',
    monto,
    categoria,
    descripcion,
    fecha
  );
  
  if (resultado.success) {
    Alert.alert('Éxito', resultado.message);
    
    // Mostrar alerta de presupuesto si existe
    if (resultado.alertaPresupuesto) {
      Alert.alert('Atención', resultado.alertaPresupuesto);
    }
    
    cargarDatos();
  } else {
    Alert.alert('Error', resultado.message);
  }
};
```

---

## 🎯 Principios Aplicados

1. **Single Responsibility Principle (SRP)**
   - Cada clase/función tiene una única responsabilidad

2. **Separation of Concerns**
   - UI, lógica de negocio y datos están separados

3. **Don't Repeat Yourself (DRY)**
   - Lógica compartida en controladores, no duplicada en vistas

4. **Dependency Inversion**
   - Vistas dependen de servicios, no de implementación directa

---

## 📝 Convenciones de Código

### Modelos
- Métodos estáticos
- Retornan datos directamente (no objetos con success/message)
- Solo operaciones de base de datos

### Controladores
- Métodos estáticos
- Siempre retornan: `{ success: boolean, message?: string, ...data }`
- Contienen try/catch
- Incluyen validaciones de negocio

### Servicios
- Funciones exportadas
- Delegan directamente a controladores
- No modifican parámetros ni respuestas

### Vistas
- Componentes funcionales con hooks
- Manejan estado local con useState
- Usan useFocusEffect para refrescar datos
- Solo llaman a servicios, nunca a modelos o controladores directamente

---

## 🚀 Próximos Pasos

1. ✅ Modelos creados (UserModel, TransactionModel, BudgetModel)
2. ✅ Controladores creados (AuthController, TransactionController, BudgetController)
3. ✅ Servicios actualizados para usar controladores
4. 📝 Las vistas ya estaban usando servicios, por lo que NO requieren cambios
5. ✅ Arquitectura MVC completamente implementada

**¡Tu app ahora tiene una arquitectura profesional y sostenible! 🎉**
