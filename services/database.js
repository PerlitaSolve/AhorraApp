import * as SQLite from 'expo-sqlite';

let db = null;

// Inicializar la base de datos
export const initDatabase = async () => {
  try {
    db = await SQLite.openDatabaseAsync('ahorraapp.db');
    
    // Crear tabla de usuarios
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        telefono TEXT,
        fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Crear tabla de transacciones
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS transacciones (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        usuario_id INTEGER NOT NULL,
        tipo TEXT NOT NULL CHECK(tipo IN ('INGRESO', 'GASTO')),
        monto REAL NOT NULL,
        categoria TEXT NOT NULL,
        descripcion TEXT,
        fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
      );
    `);
    
    console.log('Base de datos inicializada correctamente');
    return db;
  } catch (error) {
    console.error('Error al inicializar la base de datos:', error);
    throw error;
  }
};

// Obtener la instancia de la base de datos
export const getDatabase = async () => {
  if (!db) {
    db = await initDatabase();
  }
  return db;
};

// Cerrar la base de datos
export const closeDatabase = async () => {
  if (db) {
    await db.closeAsync();
    db = null;
  }
};
