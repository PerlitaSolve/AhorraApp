import { getDatabase } from './database';

// Crear un nuevo presupuesto
export const crearPresupuesto = async (usuarioId, categoria, monto, periodo, mes, anio) => {
  try {
    const db = await getDatabase();
    
    // Validaciones
    if (!usuarioId || !categoria || !monto || !periodo || !anio) {
      return { success: false, message: 'Todos los campos son obligatorios' };
    }

    if (monto <= 0) {
      return { success: false, message: 'El monto debe ser mayor a 0' };
    }

    if (periodo === 'MENSUAL' && !mes) {
      return { success: false, message: 'Debe especificar el mes para presupuesto mensual' };
    }

    // Verificar si ya existe un presupuesto para esa categoría y período
    const existente = await db.getAllAsync(
      `SELECT * FROM presupuestos 
       WHERE usuario_id = ? AND categoria = ? AND periodo = ? AND anio = ? ${periodo === 'MENSUAL' ? 'AND mes = ?' : ''}`,
      periodo === 'MENSUAL' ? [usuarioId, categoria, periodo, anio, mes] : [usuarioId, categoria, periodo, anio]
    );

    if (existente.length > 0) {
      return { success: false, message: 'Ya existe un presupuesto para esta categoría y período' };
    }

    // Insertar el presupuesto
    const result = await db.runAsync(
      'INSERT INTO presupuestos (usuario_id, categoria, monto, periodo, mes, anio) VALUES (?, ?, ?, ?, ?, ?)',
      [usuarioId, categoria, monto, periodo, mes, anio]
    );

    return { 
      success: true, 
      message: 'Presupuesto creado exitosamente',
      presupuestoId: result.lastInsertRowId 
    };
  } catch (error) {
    console.error('Error al crear presupuesto:', error);
    return { success: false, message: 'Error al crear el presupuesto' };
  }
};

// Obtener todos los presupuestos de un usuario
export const obtenerPresupuestos = async (usuarioId) => {
  try {
    const db = await getDatabase();
    
    const presupuestos = await db.getAllAsync(
      'SELECT * FROM presupuestos WHERE usuario_id = ? ORDER BY anio DESC, mes DESC',
      [usuarioId]
    );

    return { success: true, presupuestos };
  } catch (error) {
    console.error('Error al obtener presupuestos:', error);
    return { success: false, message: 'Error al obtener presupuestos', presupuestos: [] };
  }
};

// Obtener presupuestos filtrados
export const obtenerPresupuestosFiltrados = async (usuarioId, filtros = {}) => {
  try {
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

    return { success: true, presupuestos };
  } catch (error) {
    console.error('Error al obtener presupuestos filtrados:', error);
    return { success: false, message: 'Error al obtener presupuestos', presupuestos: [] };
  }
};

// Actualizar un presupuesto
export const actualizarPresupuesto = async (presupuestoId, monto, categoria, periodo, mes, anio) => {
  try {
    const db = await getDatabase();

    if (monto <= 0) {
      return { success: false, message: 'El monto debe ser mayor a 0' };
    }

    await db.runAsync(
      'UPDATE presupuestos SET monto = ?, categoria = ?, periodo = ?, mes = ?, anio = ? WHERE id = ?',
      [monto, categoria, periodo, mes, anio, presupuestoId]
    );

    return { success: true, message: 'Presupuesto actualizado exitosamente' };
  } catch (error) {
    console.error('Error al actualizar presupuesto:', error);
    return { success: false, message: 'Error al actualizar el presupuesto' };
  }
};

// Eliminar un presupuesto
export const eliminarPresupuesto = async (presupuestoId) => {
  try {
    const db = await getDatabase();

    await db.runAsync('DELETE FROM presupuestos WHERE id = ?', [presupuestoId]);

    return { success: true, message: 'Presupuesto eliminado exitosamente' };
  } catch (error) {
    console.error('Error al eliminar presupuesto:', error);
    return { success: false, message: 'Error al eliminar el presupuesto' };
  }
};

// Verificar si se ha excedido el presupuesto
export const verificarExcesoPorCategoria = async (usuarioId, categoria, mes, anio) => {
  try {
    const db = await getDatabase();

    // Obtener presupuesto para la categoría
    const presupuesto = await db.getAllAsync(
      `SELECT * FROM presupuestos 
       WHERE usuario_id = ? AND categoria = ? AND anio = ? 
       AND (periodo = 'ANUAL' OR (periodo = 'MENSUAL' AND mes = ?))
       LIMIT 1`,
      [usuarioId, categoria, anio, mes]
    );

    if (presupuesto.length === 0) {
      return { success: true, excedido: false, mensaje: 'No hay presupuesto asignado para esta categoría' };
    }

    const presupuestoData = presupuesto[0];

    // Calcular gastos según el período
    let gastosQuery;
    let gastosParams;

    if (presupuestoData.periodo === 'MENSUAL') {
      gastosQuery = `
        SELECT SUM(monto) as total 
        FROM transacciones 
        WHERE usuario_id = ? AND categoria = ? AND tipo = 'GASTO'
        AND strftime('%m', fecha) = ? AND strftime('%Y', fecha) = ?
      `;
      gastosParams = [usuarioId, categoria, mes.toString().padStart(2, '0'), anio.toString()];
    } else {
      gastosQuery = `
        SELECT SUM(monto) as total 
        FROM transacciones 
        WHERE usuario_id = ? AND categoria = ? AND tipo = 'GASTO'
        AND strftime('%Y', fecha) = ?
      `;
      gastosParams = [usuarioId, categoria, anio.toString()];
    }

    const gastos = await db.getAllAsync(gastosQuery, gastosParams);
    const totalGastado = gastos[0]?.total || 0;
    const montoPresupuesto = presupuestoData.monto;
    const disponible = montoPresupuesto - totalGastado;
    const porcentajeUsado = (totalGastado / montoPresupuesto) * 100;

    const excedido = totalGastado > montoPresupuesto;

    return {
      success: true,
      excedido,
      presupuesto: montoPresupuesto,
      gastado: totalGastado,
      disponible,
      porcentajeUsado: porcentajeUsado.toFixed(2),
      mensaje: excedido 
        ? `¡ALERTA! Has excedido el presupuesto de ${categoria} en $${(totalGastado - montoPresupuesto).toFixed(2)}`
        : porcentajeUsado >= 80
        ? `¡ADVERTENCIA! Has usado el ${porcentajeUsado.toFixed(0)}% de tu presupuesto de ${categoria}`
        : `Presupuesto de ${categoria}: ${porcentajeUsado.toFixed(0)}% usado`
    };
  } catch (error) {
    console.error('Error al verificar exceso de presupuesto:', error);
    return { success: false, message: 'Error al verificar presupuesto' };
  }
};

// Obtener resumen de todos los presupuestos
export const obtenerResumenPresupuestos = async (usuarioId, mes, anio) => {
  try {
    const db = await getDatabase();

    // Obtener todos los presupuestos del usuario para el período
    const presupuestos = await db.getAllAsync(
      `SELECT * FROM presupuestos 
       WHERE usuario_id = ? AND anio = ? 
       AND (periodo = 'ANUAL' OR (periodo = 'MENSUAL' AND mes = ?))`,
      [usuarioId, anio, mes]
    );

    const resumen = [];

    for (const presupuesto of presupuestos) {
      const verificacion = await verificarExcesoPorCategoria(
        usuarioId, 
        presupuesto.categoria, 
        mes, 
        anio
      );

      resumen.push({
        ...presupuesto,
        ...verificacion
      });
    }

    return { success: true, resumen };
  } catch (error) {
    console.error('Error al obtener resumen de presupuestos:', error);
    return { success: false, message: 'Error al obtener resumen', resumen: [] };
  }
};
