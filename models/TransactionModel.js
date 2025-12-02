import { getDatabase } from '../services/database';

// Modelo de Transacción - Capa de acceso a datos
// Responsabilidad: Operaciones CRUD directas con la base de datos
 

class TransactionModel {
  
   // Crear una nueva transacción
   
  static async create(usuarioId, tipo, monto, categoria, descripcion, fecha = null) {
    const db = await getDatabase();
    
    let query = 'INSERT INTO transacciones (usuario_id, tipo, monto, categoria, descripcion';
    let values = [usuarioId, tipo, parseFloat(monto), categoria, descripcion || ''];
    
    if (fecha) {
      query += ', fecha) VALUES (?, ?, ?, ?, ?, ?)';
      values.push(fecha);
    } else {
      query += ') VALUES (?, ?, ?, ?, ?)';
    }

    const result = await db.runAsync(query, values);
    return result.lastInsertRowId;
  }

  // Obtener todas las transacciones de un usuario
  
  static async findByUser(usuarioId) {
    const db = await getDatabase();
    const transacciones = await db.getAllAsync(
      `SELECT * FROM transacciones 
       WHERE usuario_id = ? 
       ORDER BY fecha DESC`,
      [usuarioId]
    );
    return transacciones || [];
  }

  // Obtener transacciones con filtros
  
  static async findFiltered(usuarioId, filtros = {}) {
    const db = await getDatabase();
    
    let query = 'SELECT * FROM transacciones WHERE usuario_id = ?';
    let params = [usuarioId];

    if (filtros.categoria) {
      query += ' AND categoria = ?';
      params.push(filtros.categoria);
    }

    if (filtros.tipo) {
      query += ' AND tipo = ?';
      params.push(filtros.tipo);
    }

    if (filtros.fechaInicio && filtros.fechaFin) {
      query += ' AND fecha BETWEEN ? AND ?';
      params.push(filtros.fechaInicio, filtros.fechaFin);
    }

    query += ' ORDER BY fecha DESC';

    const transacciones = await db.getAllAsync(query, params);
    return transacciones || [];
  }

  // Obtener transacciones por tipo
  static async findByType(usuarioId, tipo) {
    const db = await getDatabase();
    const transacciones = await db.getAllAsync(
      'SELECT * FROM transacciones WHERE usuario_id = ? AND tipo = ? ORDER BY fecha DESC',
      [usuarioId, tipo]
    );
    return transacciones || [];
  }

  // Obtener transacciones por categoría
  static async findByCategory(usuarioId, categoria) {
    const db = await getDatabase();
    const transacciones = await db.getAllAsync(
      'SELECT * FROM transacciones WHERE usuario_id = ? AND categoria = ? ORDER BY fecha DESC',
      [usuarioId, categoria]
    );
    return transacciones || [];
  }

  // Obtener transacciones por categoría y rango de fechas
  static async findByCategoryAndDateRange(usuarioId, categoria, mes, anio) {
    const db = await getDatabase();
    
    let query;
    let params;
    
    if (mes === null || mes === undefined) {
      // Para todo el año
      query = `SELECT * FROM transacciones 
               WHERE usuario_id = ? 
               AND categoria = ? 
               AND strftime('%Y', fecha) = ?
               ORDER BY fecha DESC`;
      params = [usuarioId, categoria, anio.toString()];
    } else {
      // Para un mes específico
      query = `SELECT * FROM transacciones 
               WHERE usuario_id = ? 
               AND categoria = ? 
               AND strftime('%m', fecha) = ? 
               AND strftime('%Y', fecha) = ?
               ORDER BY fecha DESC`;
      params = [usuarioId, categoria, mes.toString().padStart(2, '0'), anio.toString()];
    }
    
    const transacciones = await db.getAllAsync(query, params);
    return transacciones || [];
  }

  // Obtener una transacción por ID
  static async findById(id) {
    const db = await getDatabase();
    const transaccion = await db.getFirstAsync(
      'SELECT * FROM transacciones WHERE id = ?',
      [id]
    );
    return transaccion;
  }

  // Actualizar una transacción
  static async update(id, tipo, monto, categoria, descripcion, fecha) {
    const db = await getDatabase();
    const result = await db.runAsync(
      'UPDATE transacciones SET tipo = ?, monto = ?, categoria = ?, descripcion = ?, fecha = ? WHERE id = ?',
      [tipo, parseFloat(monto), categoria, descripcion, fecha, id]
    );
    return result.changes > 0;
  }

  // Eliminar una transacción
  static async delete(id) {
    const db = await getDatabase();
    const result = await db.runAsync(
      'DELETE FROM transacciones WHERE id = ?',
      [id]
    );
    return result.changes > 0;
  }

  // Calcular total de gastos por categoría en un período
  static async getTotalGastosByCategory(usuarioId, categoria, mes, anio) {
    const db = await getDatabase();
    
    let query;
    let params;
    
    if (mes === null || mes === undefined) {
      // Para presupuestos anuales - sumar todos los meses del año
      query = `SELECT COALESCE(SUM(monto), 0) as total
               FROM transacciones 
               WHERE usuario_id = ? 
               AND categoria = ? 
               AND tipo = 'GASTO'
               AND strftime('%Y', fecha) = ?`;
      params = [usuarioId, categoria, anio.toString()];
    } else {
      // Para presupuestos mensuales
      query = `SELECT COALESCE(SUM(monto), 0) as total
               FROM transacciones 
               WHERE usuario_id = ? 
               AND categoria = ? 
               AND tipo = 'GASTO'
               AND strftime('%m', fecha) = ? 
               AND strftime('%Y', fecha) = ?`;
      params = [usuarioId, categoria, mes.toString().padStart(2, '0'), anio.toString()];
    }
    
    const result = await db.getFirstAsync(query, params);
    return parseFloat(result?.total || 0);
  }

  // Calcular resumen de transacciones (ingresos y gastos)
  
  static async getSummary(usuarioId) {
    const db = await getDatabase();
    
    const ingresos = await db.getFirstAsync(
      `SELECT COALESCE(SUM(monto), 0) as total
       FROM transacciones 
       WHERE usuario_id = ? AND tipo = 'INGRESO'`,
      [usuarioId]
    );

    const gastos = await db.getFirstAsync(
      `SELECT COALESCE(SUM(monto), 0) as total
       FROM transacciones 
       WHERE usuario_id = ? AND tipo = 'GASTO'`,
      [usuarioId]
    );

    return {
      totalIngresos: parseFloat(ingresos?.total || 0),
      totalGastos: parseFloat(gastos?.total || 0)
    };
  }
}

export default TransactionModel;
