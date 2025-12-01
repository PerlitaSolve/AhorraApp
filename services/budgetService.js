/**
 * Servicio de Presupuestos
 * CAPA DE SERVICIO - Actúa como interfaz para las vistas
 * Delega la lógica de negocio al controlador
 */

import BudgetController from '../controllers/BudgetController';

// Crear un nuevo presupuesto
export const crearPresupuesto = async (usuarioId, categoria, monto, periodo, mes, anio) => {
  return await BudgetController.crearPresupuesto(usuarioId, categoria, monto, periodo, mes, anio);
};

// Obtener todos los presupuestos de un usuario
export const obtenerPresupuestos = async (usuarioId) => {
  return await BudgetController.obtenerPresupuestos(usuarioId);
};

// Obtener presupuestos filtrados
export const obtenerPresupuestosFiltrados = async (usuarioId, filtros = {}) => {
  return await BudgetController.obtenerPresupuestosFiltrados(usuarioId, filtros);
};

// Actualizar un presupuesto
export const actualizarPresupuesto = async (id, monto, categoria, periodo, mes, anio) => {
  return await BudgetController.actualizarPresupuesto(id, monto, categoria, periodo, mes, anio);
};

// Eliminar un presupuesto
export const eliminarPresupuesto = async (id) => {
  return await BudgetController.eliminarPresupuesto(id);
};

// Verificar si se excede el presupuesto de una categoría
export const verificarExcesoPorCategoria = async (usuarioId, categoria, mes, anio) => {
  return await BudgetController.verificarExcesoPorCategoria(usuarioId, categoria, mes, anio);
};

// Obtener resumen de todos los presupuestos con gastos actuales
export const obtenerResumenPresupuestos = async (usuarioId, mes, anio) => {
  return await BudgetController.obtenerResumenPresupuestos(usuarioId, mes, anio);
};
