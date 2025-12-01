import { getDatabase } from '../services/database';

/**
 * Modelo de Presupuesto - Capa de acceso a datos
 * Responsabilidad: Operaciones CRUD directas con la base de datos
 */

class BudgetModel {
  /**
   * Crear un nuevo presupuesto
   */
  static async create(usuarioId, categoria, monto, periodo, mes, anio) {
    const db = await getDatabase();
    const result = await db.runAsync(
      'INSERT INTO presupuestos (usuario_id, categoria, monto, periodo, mes, anio) VALUES (?, ?, ?, ?, ?, ?)',
      [usuarioId, categoria, monto, periodo, mes, anio]
    );
    return result.lastInsertRowId;
  }

  /**
   * Obtener todos los presupuestos de un usuario
   */
  static async findByUser(usuarioId) {
    const db = await getDatabase();
    const presupuestos = await db.getAllAsync(
      'SELECT * FROM presupuestos WHERE usuario_id = ? ORDER BY anio DESC, mes DESC',
      [usuarioId]
    );
    return presupuestos || [];
  }

  /**
   * Buscar presupuesto existente
   */
  static async findExisting(usuarioId, categoria, periodo, anio, mes = null) {
    const db = await getDatabase();
    
    if (periodo === 'MENSUAL' && mes) {
      const presupuesto = await db.getFirstAsync(
        `SELECT * FROM presupuestos 
         WHERE usuario_id = ? AND categoria = ? AND periodo = ? AND anio = ? AND mes = ?`,
        [usuarioId, categoria, periodo, anio, mes]
      );
      return presupuesto;
    } else {
      const presupuesto = await db.getFirstAsync(
        `SELECT * FROM presupuestos 
         WHERE usuario_id = ? AND categoria = ? AND periodo = ? AND anio = ?`,
        [usuarioId, categoria, periodo, anio]
      );
      return presupuesto;
    }
  }

  /**
   * Obtener presupuestos filtrados
   */
  static async findFiltered(usuarioId, filtros = {}) {
    const db = await getDatabase();
    
    let query = 'SELECT * FROM presupuestos WHERE usuario_id = ?';
    const params = [usuarioId];

    if (filtros.categoria) {
      query += ' AND categoria = ?';
      params.push(filtros.categoria);
    }

    if (filtros.periodo) {
      query += ' AND periodo = ?';
      params.push(filtros.periodo);
    }

    if (filtros.mes) {
      query += ' AND mes = ?';
      params.push(filtros.mes);
    }

    if (filtros.anio) {
      query += ' AND anio = ?';
      params.push(filtros.anio);
    }

    query += ' ORDER BY anio DESC, mes DESC';

    const presupuestos = await db.getAllAsync(query, params);
    return presupuestos || [];
  }

  /**
   * Obtener un presupuesto por ID
   */
  static async findById(id) {
    const db = await getDatabase();
    const presupuesto = await db.getFirstAsync(
      'SELECT * FROM presupuestos WHERE id = ?',
      [id]
    );
    return presupuesto;
  }

  /**
   * Obtener presupuesto por categoría y período
   */
  static async findByCategoryAndPeriod(usuarioId, categoria, mes, anio) {
    const db = await getDatabase();
    const presupuesto = await db.getFirstAsync(
      `SELECT * FROM presupuestos 
       WHERE usuario_id = ? AND categoria = ? AND mes = ? AND anio = ?`,
      [usuarioId, categoria, mes, anio]
    );
    return presupuesto;
  }

  /**
   * Actualizar un presupuesto
   */
  static async update(id, monto, categoria, periodo, mes, anio) {
    const db = await getDatabase();
    const result = await db.runAsync(
      'UPDATE presupuestos SET monto = ?, categoria = ?, periodo = ?, mes = ?, anio = ? WHERE id = ?',
      [monto, categoria, periodo, mes, anio, id]
    );
    return result.changes > 0;
  }

  /**
   * Eliminar un presupuesto
   */
  static async delete(id) {
    const db = await getDatabase();
    const result = await db.runAsync(
      'DELETE FROM presupuestos WHERE id = ?',
      [id]
    );
    return result.changes > 0;
  }
}

export default BudgetModel;
