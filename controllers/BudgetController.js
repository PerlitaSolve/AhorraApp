import BudgetModel from '../models/BudgetModel';
import TransactionModel from '../models/TransactionModel';

/**
 * Controlador de Presupuestos
 * Responsabilidad: Lógica de negocio, validaciones y orquestación
 */

class BudgetController {
  /**
   * Crear un nuevo presupuesto
   */
  static async crearPresupuesto(usuarioId, categoria, monto, periodo, mes, anio) {
    try {
      // Validaciones de negocio
      if (!usuarioId || !categoria || !monto || !periodo || !anio) {
        return { success: false, message: 'Todos los campos son obligatorios' };
      }

      if (monto <= 0) {
        return { success: false, message: 'El monto debe ser mayor a 0' };
      }

      if (periodo === 'MENSUAL' && !mes) {
        return { success: false, message: 'Debe especificar el mes para presupuesto mensual' };
      }

      // Verificar si ya existe un presupuesto
      const existente = await BudgetModel.findExisting(
        usuarioId, 
        categoria, 
        periodo, 
        anio, 
        mes
      );

      if (existente) {
        return { success: false, message: 'Ya existe un presupuesto para esta categoría y período' };
      }

      // Crear el presupuesto
      const presupuestoId = await BudgetModel.create(
        usuarioId, 
        categoria, 
        monto, 
        periodo, 
        mes, 
        anio
      );

      return { 
        success: true, 
        message: 'Presupuesto creado exitosamente',
        presupuestoId 
      };
    } catch (error) {
      console.error('Error al crear presupuesto:', error);
      return { success: false, message: 'Error al crear el presupuesto' };
    }
  }

  /**
   * Obtener todos los presupuestos de un usuario
   */
  static async obtenerPresupuestos(usuarioId) {
    try {
      if (!usuarioId) {
        return { success: false, message: 'Usuario ID es requerido' };
      }

      const presupuestos = await BudgetModel.findByUser(usuarioId);

      return { 
        success: true, 
        presupuestos 
      };
    } catch (error) {
      console.error('Error al obtener presupuestos:', error);
      return { success: false, message: 'Error al obtener presupuestos', presupuestos: [] };
    }
  }

  /**
   * Obtener presupuestos filtrados
   */
  static async obtenerPresupuestosFiltrados(usuarioId, filtros = {}) {
    try {
      if (!usuarioId) {
        return { success: false, message: 'Usuario ID es requerido' };
      }

      const presupuestos = await BudgetModel.findFiltered(usuarioId, filtros);

      return { 
        success: true, 
        presupuestos 
      };
    } catch (error) {
      console.error('Error al obtener presupuestos filtrados:', error);
      return { success: false, message: 'Error al obtener presupuestos' };
    }
  }

  /**
   * Actualizar un presupuesto
   */
  static async actualizarPresupuesto(id, monto, categoria, periodo, mes, anio) {
    try {
      // Validaciones de negocio
      if (!id || !monto || !categoria || !periodo || !anio) {
        return { success: false, message: 'Todos los campos son obligatorios' };
      }

      if (monto <= 0) {
        return { success: false, message: 'El monto debe ser mayor a 0' };
      }

      if (periodo === 'MENSUAL' && !mes) {
        return { success: false, message: 'Debe especificar el mes para presupuesto mensual' };
      }

      // Verificar que el presupuesto existe
      const presupuestoExistente = await BudgetModel.findById(id);
      if (!presupuestoExistente) {
        return { success: false, message: 'Presupuesto no encontrado' };
      }

      // Actualizar presupuesto
      const actualizado = await BudgetModel.update(
        id, 
        monto, 
        categoria, 
        periodo, 
        mes, 
        anio
      );

      if (!actualizado) {
        return { success: false, message: 'Error al actualizar presupuesto' };
      }

      return { 
        success: true, 
        message: 'Presupuesto actualizado exitosamente' 
      };
    } catch (error) {
      console.error('Error al actualizar presupuesto:', error);
      return { success: false, message: 'Error al actualizar el presupuesto' };
    }
  }

  /**
   * Eliminar un presupuesto
   */
  static async eliminarPresupuesto(id) {
    try {
      if (!id) {
        return { success: false, message: 'ID es requerido' };
      }

      // Verificar que el presupuesto existe
      const presupuestoExistente = await BudgetModel.findById(id);
      if (!presupuestoExistente) {
        return { success: false, message: 'Presupuesto no encontrado' };
      }

      // Eliminar presupuesto
      const eliminado = await BudgetModel.delete(id);

      if (!eliminado) {
        return { success: false, message: 'Error al eliminar presupuesto' };
      }

      return { 
        success: true, 
        message: 'Presupuesto eliminado exitosamente' 
      };
    } catch (error) {
      console.error('Error al eliminar presupuesto:', error);
      return { success: false, message: 'Error al eliminar el presupuesto' };
    }
  }

  /**
   * Verificar si se excede el presupuesto de una categoría
   * Lógica de negocio compleja: comparar gastos vs presupuesto
   */
  static async verificarExcesoPorCategoria(usuarioId, categoria, mes, anio) {
    try {
      // Buscar el presupuesto para esa categoría y período
      const presupuesto = await BudgetModel.findByCategoryAndPeriod(
        usuarioId, 
        categoria, 
        mes, 
        anio
      );

      if (!presupuesto) {
        return { 
          success: true, 
          excedido: false, 
          mensaje: 'No hay presupuesto definido para esta categoría' 
        };
      }

      // Calcular total de gastos en esa categoría
      const totalGastado = await TransactionModel.getTotalGastosByCategory(
        usuarioId, 
        categoria, 
        mes, 
        anio
      );

      const porcentajeUsado = (totalGastado / presupuesto.monto) * 100;
      const excedido = totalGastado > presupuesto.monto;

      let mensaje = '';
      if (excedido) {
        mensaje = `Se excedió el presupuesto de "${categoria}". Has gastado $${totalGastado.toFixed(2)} de $${presupuesto.monto.toFixed(2)}`;
      } else if (porcentajeUsado >= 80) {
        mensaje = `Falta poco para llegar al límite del presupuesto de "${categoria}". Has usado el ${porcentajeUsado.toFixed(0)}%`;
      }

      return {
        success: true,
        excedido,
        presupuesto: presupuesto.monto,
        gastado: totalGastado,
        porcentajeUsado,
        mensaje
      };
    } catch (error) {
      console.error('Error al verificar exceso de presupuesto:', error);
      return { success: false, message: 'Error al verificar presupuesto' };
    }
  }

  /**
   * Obtener resumen de todos los presupuestos con gastos actuales
   * Lógica de negocio: combinar datos de presupuestos y transacciones
   */
  static async obtenerResumenPresupuestos(usuarioId, mes, anio) {
    try {
      if (!usuarioId || !mes || !anio) {
        return { success: false, message: 'Usuario ID, mes y año son requeridos' };
      }

      // Obtener presupuestos del mes
      const presupuestos = await BudgetModel.findFiltered(usuarioId, { mes, anio });

      // Para cada presupuesto, calcular gastos
      const resumen = await Promise.all(
        presupuestos.map(async (presupuesto) => {
          const totalGastado = await TransactionModel.getTotalGastosByCategory(
            usuarioId,
            presupuesto.categoria,
            mes,
            anio
          );

          const porcentajeUsado = (totalGastado / presupuesto.monto) * 100;
          const excedido = totalGastado > presupuesto.monto;

          return {
            id: presupuesto.id,
            categoria: presupuesto.categoria,
            presupuesto: presupuesto.monto,
            gastado: totalGastado,
            restante: presupuesto.monto - totalGastado,
            porcentajeUsado,
            excedido
          };
        })
      );

      return {
        success: true,
        resumen
      };
    } catch (error) {
      console.error('Error al obtener resumen de presupuestos:', error);
      return { success: false, message: 'Error al obtener resumen' };
    }
  }
}

export default BudgetController;
