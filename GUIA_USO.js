/**
 * GUÍA DE USO - FUNCIONES DE LA BASE DE DATOS
 * 
 * Este archivo contiene ejemplos de cómo usar todas las funciones
 * implementadas en los servicios de autenticación y transacciones.
 */

// ============================================
// 1. AUTENTICACIÓN
// ============================================

import { registrarUsuario, iniciarSesion, recuperarPassword } from './services/authService';

// --- REGISTRAR USUARIO ---
async function ejemploRegistro() {
  const resultado = await registrarUsuario(
    'Juan Pérez',           // nombre
    'juan@email.com',       // email
    'miPassword123',        // password
    '5512345678'            // telefono (10 dígitos)
  );
  
  if (resultado.success) {
    console.log('Usuario registrado con ID:', resultado.userId);
  } else {
    console.log('Error:', resultado.message);
  }
}

// --- INICIAR SESIÓN ---
async function ejemploLogin() {
  const resultado = await iniciarSesion(
    'juan@email.com',       // email
    'miPassword123'         // password
  );
  
  if (resultado.success) {
    console.log('Usuario logueado:', resultado.usuario);
    // resultado.usuario contiene: { id, nombre, email, telefono }
    const usuarioId = resultado.usuario.id;
  } else {
    console.log('Error:', resultado.message);
  }
}

// --- RECUPERAR CONTRASEÑA ---
async function ejemploRecuperarPassword() {
  const resultado = await recuperarPassword(
    'juan@email.com',       // email
    'nuevaPassword456'      // nueva password
  );
  
  if (resultado.success) {
    console.log('Contraseña actualizada');
  } else {
    console.log('Error:', resultado.message);
  }
}

// ============================================
// 2. TRANSACCIONES
// ============================================

import { 
  crearTransaccion, 
  obtenerTransacciones, 
  obtenerTransaccionesFiltradas,
  actualizarTransaccion,
  eliminarTransaccion,
  obtenerResumenTransacciones,
  obtenerCategorias
} from './services/transactionService';

// --- CREAR TRANSACCIÓN ---
async function ejemploCrearTransaccion(usuarioId) {
  const resultado = await crearTransaccion(
    usuarioId,              // ID del usuario logueado
    'GASTO',                // tipo: 'INGRESO' o 'GASTO'
    150.50,                 // monto
    'Supermercado',         // categoría
    'Compra semanal'        // descripción (opcional)
  );
  
  if (resultado.success) {
    console.log('Transacción creada con ID:', resultado.transaccionId);
  }
}

// --- OBTENER TODAS LAS TRANSACCIONES ---
async function ejemploObtenerTransacciones(usuarioId) {
  const resultado = await obtenerTransacciones(usuarioId);
  
  if (resultado.success) {
    console.log('Total de transacciones:', resultado.transacciones.length);
    resultado.transacciones.forEach(t => {
      console.log(`${t.tipo}: $${t.monto} - ${t.categoria}`);
    });
  }
}

// --- FILTRAR TRANSACCIONES ---
async function ejemploFiltrarTransacciones(usuarioId) {
  // Filtro por categoría
  const porCategoria = await obtenerTransaccionesFiltradas(usuarioId, {
    categoria: 'Supermercado'
  });
  
  // Filtro por tipo
  const soloGastos = await obtenerTransaccionesFiltradas(usuarioId, {
    tipo: 'GASTO'
  });
  
  // Filtro por rango de fechas
  const porFecha = await obtenerTransaccionesFiltradas(usuarioId, {
    fechaInicio: '2024-01-01',
    fechaFin: '2024-12-31'
  });
  
  // Filtro por mes y año
  const porMes = await obtenerTransaccionesFiltradas(usuarioId, {
    mes: 11,        // noviembre
    anio: 2024
  });
  
  // Filtros combinados
  const combinado = await obtenerTransaccionesFiltradas(usuarioId, {
    tipo: 'GASTO',
    categoria: 'Supermercado',
    fechaInicio: '2024-11-01',
    fechaFin: '2024-11-30'
  });
}

// --- ACTUALIZAR TRANSACCIÓN ---
async function ejemploActualizarTransaccion(transaccionId, usuarioId) {
  const resultado = await actualizarTransaccion(
    transaccionId,
    usuarioId,
    {
      tipo: 'GASTO',
      monto: 200.00,
      categoria: 'Transporte',
      descripcion: 'Gasolina'
    }
  );
  
  if (resultado.success) {
    console.log('Transacción actualizada');
  }
}

// --- ELIMINAR TRANSACCIÓN ---
async function ejemploEliminarTransaccion(transaccionId, usuarioId) {
  const resultado = await eliminarTransaccion(transaccionId, usuarioId);
  
  if (resultado.success) {
    console.log('Transacción eliminada');
  }
}

// --- RESUMEN DE TRANSACCIONES ---
async function ejemploResumen(usuarioId) {
  // Resumen total
  const resumenTotal = await obtenerResumenTransacciones(usuarioId);
  
  if (resumenTotal.success) {
    console.log('Ingresos:', resumenTotal.resumen.ingresos);
    console.log('Gastos:', resumenTotal.resumen.gastos);
    console.log('Balance:', resumenTotal.resumen.balance);
  }
  
  // Resumen del mes actual
  const resumenMes = await obtenerResumenTransacciones(usuarioId, {
    mes: 11,
    anio: 2024
  });
}

// --- OBTENER CATEGORÍAS ÚNICAS ---
async function ejemploCategorias(usuarioId) {
  const resultado = await obtenerCategorias(usuarioId);
  
  if (resultado.success) {
    console.log('Categorías:', resultado.categorias);
    // Ejemplo: ['Supermercado', 'Transporte', 'Servicios', ...]
  }
}

// ============================================
// 3. EJEMPLO DE FLUJO COMPLETO
// ============================================

async function flujoCompletoEjemplo() {
  // 1. Registrar usuario
  const registro = await registrarUsuario(
    'María García',
    'maria@email.com',
    'password123',
    '5598765432'
  );
  
  if (!registro.success) {
    console.log('Error en registro:', registro.message);
    return;
  }
  
  // 2. Iniciar sesión
  const login = await iniciarSesion('maria@email.com', 'password123');
  
  if (!login.success) {
    console.log('Error en login:', login.message);
    return;
  }
  
  const usuarioId = login.usuario.id;
  console.log('Usuario logueado:', login.usuario.nombre);
  
  // 3. Crear algunas transacciones
  await crearTransaccion(usuarioId, 'INGRESO', 5000, 'Salario', 'Pago quincenal');
  await crearTransaccion(usuarioId, 'GASTO', 150, 'Supermercado', 'Despensa');
  await crearTransaccion(usuarioId, 'GASTO', 50, 'Transporte', 'Gasolina');
  
  // 4. Obtener todas las transacciones
  const transacciones = await obtenerTransacciones(usuarioId);
  console.log('Total de transacciones:', transacciones.transacciones.length);
  
  // 5. Obtener resumen
  const resumen = await obtenerResumenTransacciones(usuarioId);
  console.log('Balance:', resumen.resumen.balance);
  
  // 6. Filtrar solo gastos
  const gastos = await obtenerTransaccionesFiltradas(usuarioId, {
    tipo: 'GASTO'
  });
  console.log('Total de gastos:', gastos.transacciones.length);
}

// ============================================
// 4. VALIDACIONES
// ============================================

/**
 * VALIDACIONES AUTOMÁTICAS:
 * 
 * authService.js:
 * - Email debe tener formato válido
 * - Password mínimo 6 caracteres
 * - Teléfono debe tener exactamente 10 dígitos
 * - Email debe ser único (no duplicados)
 * 
 * transactionService.js:
 * - Monto debe ser número positivo
 * - Tipo debe ser 'INGRESO' o 'GASTO'
 * - Categoría es obligatoria
 * - Usuario debe existir
 */

// ============================================
// 5. MANEJO DE ERRORES
// ============================================

async function ejemploManejoErrores() {
  // Todas las funciones retornan un objeto con:
  // { success: boolean, message: string, ...datos }
  
  const resultado = await registrarUsuario(
    '',                     // nombre vacío - ERROR
    'email-invalido',       // email sin formato - ERROR
    '123',                  // password muy corta - ERROR
    '123'                   // teléfono inválido - ERROR
  );
  
  if (!resultado.success) {
    console.log('Error:', resultado.message);
    // Muestra el primer error encontrado
  }
}

// ============================================
// 6. FORMATO DE DATOS
// ============================================

/**
 * ESTRUCTURA DE USUARIO:
 * {
 *   id: 1,
 *   nombre: 'Juan Pérez',
 *   email: 'juan@email.com',
 *   telefono: '5512345678'
 * }
 * 
 * ESTRUCTURA DE TRANSACCIÓN:
 * {
 *   id: 1,
 *   usuario_id: 1,
 *   tipo: 'GASTO' | 'INGRESO',
 *   monto: 150.50,
 *   categoria: 'Supermercado',
 *   descripcion: 'Compra semanal',
 *   fecha: '2024-11-29 10:30:00'
 * }
 * 
 * ESTRUCTURA DE RESUMEN:
 * {
 *   ingresos: 5000,
 *   gastos: 1500,
 *   balance: 3500
 * }
 */

export {
  ejemploRegistro,
  ejemploLogin,
  ejemploRecuperarPassword,
  ejemploCrearTransaccion,
  ejemploObtenerTransacciones,
  ejemploFiltrarTransacciones,
  ejemploActualizarTransaccion,
  ejemploEliminarTransaccion,
  ejemploResumen,
  ejemploCategorias,
  flujoCompletoEjemplo
};
