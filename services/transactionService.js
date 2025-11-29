import { getDatabase } from './database';

// Crear una nueva transacción
export const crearTransaccion = async (usuarioId, tipo, monto, categoria, descripcion, fecha = null) => {
  try {
    if (!usuarioId || !tipo || !monto || !categoria) {
      return { success: false, message: 'Todos los campos son obligatorios' };
    }

    if (tipo !== 'INGRESO' && tipo !== 'GASTO') {
      return { success: false, message: 'El tipo debe ser INGRESO o GASTO' };
    }

    if (isNaN(monto) || parseFloat(monto) <= 0) {
      return { success: false, message: 'El monto debe ser un número mayor a 0' };
    }

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

    return { 
      success: true, 
      message: 'Transacción creada exitosamente',
      transaccionId: result.lastInsertRowId 
    };
  } catch (error) {
    console.error('Error al crear transacción:', error);
    return { success: false, message: 'Error al crear transacción' };
  }
};

// Obtener todas las transacciones de un usuario
export const obtenerTransacciones = async (usuarioId) => {
  try {
    const db = await getDatabase();
    
    const transacciones = await db.getAllAsync(
      `SELECT * FROM transacciones 
       WHERE usuario_id = ? 
       ORDER BY fecha DESC`,
      [usuarioId]
    );

    return { 
      success: true, 
      transacciones: transacciones || []
    };
  } catch (error) {
    console.error('Error al obtener transacciones:', error);
    return { success: false, message: 'Error al obtener transacciones' };
  }
};

// Obtener transacciones con filtros
export const obtenerTransaccionesFiltradas = async (usuarioId, filtros = {}) => {
  try {
    const db = await getDatabase();
    
    let query = 'SELECT * FROM transacciones WHERE usuario_id = ?';
    let params = [usuarioId];

    // Filtro por categoría
    if (filtros.categoria) {
      query += ' AND categoria = ?';
      params.push(filtros.categoria);
    }

    // Filtro por tipo
    if (filtros.tipo) {
      query += ' AND tipo = ?';
      params.push(filtros.tipo);
    }

    // Filtro por rango de fechas
    if (filtros.fechaInicio && filtros.fechaFin) {
      query += ' AND date(fecha) BETWEEN date(?) AND date(?)';
      params.push(filtros.fechaInicio, filtros.fechaFin);
    } else if (filtros.fechaInicio) {
      query += ' AND date(fecha) >= date(?)';
      params.push(filtros.fechaInicio);
    } else if (filtros.fechaFin) {
      query += ' AND date(fecha) <= date(?)';
      params.push(filtros.fechaFin);
    }

    // Filtro por mes y año
    if (filtros.mes && filtros.anio) {
      query += ` AND strftime('%m', fecha) = ? AND strftime('%Y', fecha) = ?`;
      params.push(filtros.mes.toString().padStart(2, '0'), filtros.anio.toString());
    }

    query += ' ORDER BY fecha DESC';

    const transacciones = await db.getAllAsync(query, params);

    return { 
      success: true, 
      transacciones: transacciones || []
    };
  } catch (error) {
    console.error('Error al obtener transacciones filtradas:', error);
    return { success: false, message: 'Error al obtener transacciones' };
  }
};

// Obtener una transacción por ID
export const obtenerTransaccionPorId = async (transaccionId, usuarioId) => {
  try {
    const db = await getDatabase();
    
    const transaccion = await db.getFirstAsync(
      'SELECT * FROM transacciones WHERE id = ? AND usuario_id = ?',
      [transaccionId, usuarioId]
    );

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
};

// Actualizar una transacción
export const actualizarTransaccion = async (transaccionId, usuarioId, datos) => {
  try {
    const db = await getDatabase();
    
    // Verificar que la transacción existe y pertenece al usuario
    const transaccionExistente = await db.getFirstAsync(
      'SELECT * FROM transacciones WHERE id = ? AND usuario_id = ?',
      [transaccionId, usuarioId]
    );

    if (!transaccionExistente) {
      return { success: false, message: 'Transacción no encontrada' };
    }

    let campos = [];
    let valores = [];

    if (datos.tipo) {
      if (datos.tipo !== 'INGRESO' && datos.tipo !== 'GASTO') {
        return { success: false, message: 'El tipo debe ser INGRESO o GASTO' };
      }
      campos.push('tipo = ?');
      valores.push(datos.tipo);
    }

    if (datos.monto) {
      if (isNaN(datos.monto) || parseFloat(datos.monto) <= 0) {
        return { success: false, message: 'El monto debe ser un número mayor a 0' };
      }
      campos.push('monto = ?');
      valores.push(parseFloat(datos.monto));
    }

    if (datos.categoria) {
      campos.push('categoria = ?');
      valores.push(datos.categoria);
    }

    if (datos.descripcion !== undefined) {
      campos.push('descripcion = ?');
      valores.push(datos.descripcion);
    }

    if (datos.fecha) {
      campos.push('fecha = ?');
      valores.push(datos.fecha);
    }

    if (campos.length === 0) {
      return { success: false, message: 'No hay campos para actualizar' };
    }

    valores.push(transaccionId, usuarioId);
    const query = `UPDATE transacciones SET ${campos.join(', ')} WHERE id = ? AND usuario_id = ?`;

    await db.runAsync(query, valores);

    return { 
      success: true, 
      message: 'Transacción actualizada exitosamente'
    };
  } catch (error) {
    console.error('Error al actualizar transacción:', error);
    return { success: false, message: 'Error al actualizar transacción' };
  }
};

// Eliminar una transacción
export const eliminarTransaccion = async (transaccionId, usuarioId) => {
  try {
    const db = await getDatabase();
    
    const result = await db.runAsync(
      'DELETE FROM transacciones WHERE id = ? AND usuario_id = ?',
      [transaccionId, usuarioId]
    );

    if (result.changes === 0) {
      return { success: false, message: 'Transacción no encontrada' };
    }

    return { 
      success: true, 
      message: 'Transacción eliminada exitosamente'
    };
  } catch (error) {
    console.error('Error al eliminar transacción:', error);
    return { success: false, message: 'Error al eliminar transacción' };
  }
};

// Obtener resumen de transacciones (ingresos y gastos totales)
export const obtenerResumenTransacciones = async (usuarioId, filtros = {}) => {
  try {
    const db = await getDatabase();
    
    let queryBase = 'SELECT tipo, SUM(monto) as total FROM transacciones WHERE usuario_id = ?';
    let params = [usuarioId];

    // Aplicar filtros de fecha si existen
    if (filtros.fechaInicio && filtros.fechaFin) {
      queryBase += ' AND date(fecha) BETWEEN date(?) AND date(?)';
      params.push(filtros.fechaInicio, filtros.fechaFin);
    } else if (filtros.mes && filtros.anio) {
      queryBase += ` AND strftime('%m', fecha) = ? AND strftime('%Y', fecha) = ?`;
      params.push(filtros.mes.toString().padStart(2, '0'), filtros.anio.toString());
    }

    queryBase += ' GROUP BY tipo';

    const resultados = await db.getAllAsync(queryBase, params);

    let totalIngresos = 0;
    let totalGastos = 0;

    resultados.forEach(item => {
      if (item.tipo === 'INGRESO') {
        totalIngresos = item.total || 0;
      } else if (item.tipo === 'GASTO') {
        totalGastos = item.total || 0;
      }
    });

    return { 
      success: true, 
      resumen: {
        ingresos: totalIngresos,
        gastos: totalGastos,
        balance: totalIngresos - totalGastos
      }
    };
  } catch (error) {
    console.error('Error al obtener resumen:', error);
    return { success: false, message: 'Error al obtener resumen' };
  }
};

// Obtener categorías únicas de un usuario
export const obtenerCategorias = async (usuarioId) => {
  try {
    const db = await getDatabase();
    
    const categorias = await db.getAllAsync(
      'SELECT DISTINCT categoria FROM transacciones WHERE usuario_id = ? ORDER BY categoria',
      [usuarioId]
    );

    return { 
      success: true, 
      categorias: categorias.map(c => c.categoria)
    };
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    return { success: false, message: 'Error al obtener categorías' };
  }
};
