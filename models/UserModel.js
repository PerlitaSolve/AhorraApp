import { getDatabase } from '../services/database';

/**
 * Modelo de Usuario - Capa de acceso a datos
 * Responsabilidad: Operaciones CRUD directas con la base de datos
 */

class UserModel {
  /**
   * Crear un nuevo usuario en la base de datos
   */
  static async create(nombre, email, password, telefono) {
    const db = await getDatabase();
    const result = await db.runAsync(
      'INSERT INTO usuarios (nombre, email, password, telefono) VALUES (?, ?, ?, ?)',
      [nombre, email, password, telefono]
    );
    return result.lastInsertRowId;
  }

  /**
   * Buscar usuario por email
   */
  static async findByEmail(email) {
    const db = await getDatabase();
    const usuario = await db.getFirstAsync(
      'SELECT * FROM usuarios WHERE email = ?',
      [email]
    );
    return usuario;
  }

  /**
   * Buscar usuario por ID
   */
  static async findById(id) {
    const db = await getDatabase();
    const usuario = await db.getFirstAsync(
      'SELECT * FROM usuarios WHERE id = ?',
      [id]
    );
    return usuario;
  }

  /**
   * Buscar usuario por email y password
   */
  static async findByCredentials(email, password) {
    const db = await getDatabase();
    const usuario = await db.getFirstAsync(
      'SELECT * FROM usuarios WHERE email = ? AND password = ?',
      [email, password]
    );
    return usuario;
  }

  /**
   * Actualizar contraseña de un usuario
   */
  static async updatePassword(email, nuevaPassword) {
    const db = await getDatabase();
    const result = await db.runAsync(
      'UPDATE usuarios SET password = ? WHERE email = ?',
      [nuevaPassword, email]
    );
    return result.changes > 0;
  }

  /**
   * Actualizar información del usuario
   */
  static async update(id, datos) {
    const db = await getDatabase();
    const { nombre, email, telefono } = datos;
    const result = await db.runAsync(
      'UPDATE usuarios SET nombre = ?, email = ?, telefono = ? WHERE id = ?',
      [nombre, email, telefono, id]
    );
    return result.changes > 0;
  }
}

export default UserModel;
