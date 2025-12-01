/**
 * Servicio de Transacciones
 * CAPA DE SERVICIO - Actúa como interfaz para las vistas
 * Delega la lógica de negocio al controlador
 */

import TransactionController from '../controllers/TransactionController';

// Crear una nueva transacción
export const crearTransaccion = async (usuarioId, tipo, monto, categoria, descripcion, fecha = null) => {
  return await TransactionController.crearTransaccion(usuarioId, tipo, monto, categoria, descripcion, fecha);
};

// Obtener todas las transacciones de un usuario
export const obtenerTransacciones = async (usuarioId) => {
  return await TransactionController.obtenerTransacciones(usuarioId);
};

// Obtener transacciones con filtros
export const obtenerTransaccionesFiltradas = async (usuarioId, filtros = {}) => {
  return await TransactionController.obtenerTransaccionesFiltradas(usuarioId, filtros);
};

// Obtener transacciones por tipo
export const obtenerTransaccionesPorTipo = async (usuarioId, tipo) => {
  return await TransactionController.obtenerTransaccionesPorTipo(usuarioId, tipo);
};

// Obtener una transacción por ID
export const obtenerTransaccionPorId = async (id) => {
  return await TransactionController.obtenerTransaccionPorId(id);
};

// Actualizar una transacción
export const actualizarTransaccion = async (id, tipo, monto, categoria, descripcion, fecha) => {
  return await TransactionController.actualizarTransaccion(id, tipo, monto, categoria, descripcion, fecha);
};

// Eliminar una transacción
export const eliminarTransaccion = async (id) => {
  return await TransactionController.eliminarTransaccion(id);
};

// Obtener resumen de transacciones (ingresos, gastos, balance)
export const obtenerResumenTransacciones = async (usuarioId, filtros = {}) => {
  return await TransactionController.obtenerResumenTransacciones(usuarioId, filtros);
};
