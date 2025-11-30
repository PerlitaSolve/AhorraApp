import * as SQLite from 'expo-sqlite';

let db = null;
let isInitializing = false;
let initPromise = null;

// Inicializar la base de datos
export const initDatabase = async () => {
  // Si ya está inicializando, esperar a que termine
  if (isInitializing && initPromise) {
    return initPromise;
  }
  
  // Si ya está inicializada, retornar la instancia
  if (db) {
    return db;
  }

  isInitializing = true;
  
  initPromise = (async () => {
    try {
      console.log('Inicializando base de datos...');
      
      // Abrir la base de datos
      db = await SQLite.openDatabaseAsync('ahorraapp.db');
      
      if (!db) {
        throw new Error('No se pudo abrir la base de datos');
      }
      
      console.log('Base de datos abierta, creando tablas...');
      
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
      
      console.log('Tabla usuarios creada');
      
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
      
      console.log('Tabla transacciones creada');
      
      // Crear tabla de presupuestos
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS presupuestos (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          usuario_id INTEGER NOT NULL,
          categoria TEXT NOT NULL,
          monto REAL NOT NULL,
          periodo TEXT NOT NULL CHECK(periodo IN ('MENSUAL', 'ANUAL')),
          mes INTEGER,
          anio INTEGER NOT NULL,
          fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
        );
      `);
      
      console.log('Tabla presupuestos creada');
      console.log('Base de datos inicializada correctamente');
      
      isInitializing = false;
      return db;
    } catch (error) {
      console.error('Error al inicializar la base de datos:', error);
      isInitializing = false;
      db = null;
      initPromise = null;
      throw error;
    }
  })();
  
  return initPromise;
};

// Obtener la instancia de la base de datos
export const getDatabase = async () => {
  if (!db) {
    return await initDatabase();
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
