import TransactionModel from '../models/TransactionModel';
import BudgetController from './BudgetController';

/**
 * Controlador de Transacciones
 * Responsabilidad: Lógica de negocio, validaciones y orquestación
 */

class TransactionController {
  /**
   * Crear una nueva transacción
   */
  static async crearTransaccion(usuarioId, tipo, monto, categoria, descripcion, fecha = null) {
    try {
      // Validaciones de negocio
      if (!usuarioId || !tipo || !monto || !categoria) {
        return { success: false, message: 'Todos los campos son obligatorios' };
      }

      if (tipo !== 'INGRESO' && tipo !== 'GASTO') {
        return { success: false, message: 'El tipo debe ser INGRESO o GASTO' };
      }

      if (isNaN(monto) || parseFloat(monto) <= 0) {
        return { success: false, message: 'El monto debe ser un número mayor a 0' };
      }

      // Crear la transacción
      const transaccionId = await TransactionModel.create(
        usuarioId, 
        tipo, 
        monto, 
        categoria, 
        descripcion, 
        fecha
      );

      // Si es un gasto, verificar presupuesto
      let alertaPresupuesto = null;
      if (tipo === 'GASTO') {
        const fechaTransaccion = fecha ? new Date(fecha) : new Date();
        const mes = fechaTransaccion.getMonth() + 1;
        const anio = fechaTransaccion.getFullYear();
        
        const verificacion = await BudgetController.verificarExcesoPorCategoria(
          usuarioId, 
          categoria, 
          mes, 
          anio
        );
        
        if (verificacion.success && (verificacion.excedido || verificacion.porcentajeUsado >= 80)) {
          alertaPresupuesto = verificacion.mensaje;
        }
      }

      return { 
        success: true, 
        message: 'Transacción creada exitosamente',
        transaccionId,
        alertaPresupuesto
      };
    } catch (error) {
      console.error('Error al crear transacción:', error);
      return { success: false, message: 'Error al crear transacción' };
    }
  }

  /**
   * Obtener todas las transacciones de un usuario
   */
  static async obtenerTransacciones(usuarioId) {
    try {
      if (!usuarioId) {
        return { success: false, message: 'Usuario ID es requerido' };
      }

      const transacciones = await TransactionModel.findByUser(usuarioId);

      return { 
        success: true, 
        transacciones
      };
    } catch (error) {
      console.error('Error al obtener transacciones:', error);
      return { success: false, message: 'Error al obtener transacciones' };
    }
  }

  /**
   * Obtener transacciones con filtros
   */
  static async obtenerTransaccionesFiltradas(usuarioId, filtros = {}) {
    try {
      if (!usuarioId) {
        return { success: false, message: 'Usuario ID es requerido' };
      }

      const transacciones = await TransactionModel.findFiltered(usuarioId, filtros);

      return { 
        success: true, 
        transacciones
      };
    } catch (error) {
      console.error('Error al obtener transacciones filtradas:', error);
      return { success: false, message: 'Error al obtener transacciones' };
    }
  }

  /**
   * Obtener transacciones por tipo (INGRESO o GASTO)
   */
  static async obtenerTransaccionesPorTipo(usuarioId, tipo) {
    try {
      if (!usuarioId || !tipo) {
        return { success: false, message: 'Usuario ID y tipo son requeridos' };
      }

      if (tipo !== 'INGRESO' && tipo !== 'GASTO') {
        return { success: false, message: 'El tipo debe ser INGRESO o GASTO' };
      }

      const transacciones = await TransactionModel.findByType(usuarioId, tipo);

      return { 
        success: true, 
        transacciones
      };
    } catch (error) {
      console.error('Error al obtener transacciones por tipo:', error);
      return { success: false, message: 'Error al obtener transacciones' };
    }
  }

  /**
   * Obtener una transacción por ID
   */
  static async obtenerTransaccionPorId(id) {
    try {
      if (!id) {
        return { success: false, message: 'ID es requerido' };
      }

      const transaccion = await TransactionModel.findById(id);

      if (!transaccion) {
        return { success: false, message: 'Transacción no encontrada' };
      }

      return { 
        success: true, 
        transaccion
      };
    } catch (error) {
      console.error('Error al obtener transacción:', error);
      return { success: false, message: 'Error al obtener transacción' };
    }
  }

  /**
   * Actualizar una transacción
   */
  static async actualizarTransaccion(id, tipo, monto, categoria, descripcion, fecha) {
    try {
      // Validaciones de negocio
      if (!id || !tipo || !monto || !categoria || !fecha) {
        return { success: false, message: 'Todos los campos son obligatorios' };
      }

      if (tipo !== 'INGRESO' && tipo !== 'GASTO') {
        return { success: false, message: 'El tipo debe ser INGRESO o GASTO' };
      }

      if (isNaN(monto) || parseFloat(monto) <= 0) {
        return { success: false, message: 'El monto debe ser un número mayor a 0' };
      }

      // Verificar que la transacción existe
      const transaccionExistente = await TransactionModel.findById(id);
      if (!transaccionExistente) {
        return { success: false, message: 'Transacción no encontrada' };
      }

      // Actualizar transacción
      const actualizado = await TransactionModel.update(
        id, 
        tipo, 
        monto, 
        categoria, 
        descripcion, 
        fecha
      );

      if (!actualizado) {
        return { success: false, message: 'Error al actualizar transacción' };
      }

      return { 
        success: true, 
        message: 'Transacción actualizada exitosamente' 
      };
    } catch (error) {
      console.error('Error al actualizar transacción:', error);
      return { success: false, message: 'Error al actualizar transacción' };
    }
  }

  /**
   * Eliminar una transacción
   */
  static async eliminarTransaccion(id) {
    try {
      if (!id) {
        return { success: false, message: 'ID es requerido' };
      }

      // Verificar que la transacción existe
      const transaccionExistente = await TransactionModel.findById(id);
      if (!transaccionExistente) {
        return { success: false, message: 'Transacción no encontrada' };
      }

      // Eliminar transacción
      const eliminado = await TransactionModel.delete(id);

      if (!eliminado) {
        return { success: false, message: 'Error al eliminar transacción' };
      }

      return { 
        success: true, 
        message: 'Transacción eliminada exitosamente' 
      };
    } catch (error) {
      console.error('Error al eliminar transacción:', error);
      return { success: false, message: 'Error al eliminar transacción' };
    }
  }

  /**
   * Obtener resumen de transacciones (ingresos, gastos, balance)
   */
  static async obtenerResumenTransacciones(usuarioId, filtros = {}) {
    try {
      if (!usuarioId) {
        return { success: false, message: 'Usuario ID es requerido' };
      }

      const transacciones = await TransactionModel.findFiltered(usuarioId, filtros);
      
      let totalIngresos = 0;
      let totalGastos = 0;
      const categorias = {};

      transacciones.forEach(t => {
        if (t.tipo === 'INGRESO') {
          totalIngresos += parseFloat(t.monto);
        } else {
          totalGastos += parseFloat(t.monto);
          
          if (!categorias[t.categoria]) {
            categorias[t.categoria] = 0;
          }
          categorias[t.categoria] += parseFloat(t.monto);
        }
      });

      const balance = totalIngresos - totalGastos;

      return {
        success: true,
        resumen: {
          totalIngresos,
          totalGastos,
          balance,
          categorias,
          totalTransacciones: transacciones.length
        }
      };
    } catch (error) {
      console.error('Error al obtener resumen:', error);
      return { success: false, message: 'Error al obtener resumen' };
    }
  }
}

export default TransactionController;
