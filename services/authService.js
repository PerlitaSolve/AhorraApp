import { getDatabase } from './database';

// Validar formato de email
const validarEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validar formato de teléfono
const validarTelefono = (telefono) => {
  const telefonoRegex = /^[0-9]{10}$/;
  return telefonoRegex.test(telefono);
};

// Registrar un nuevo usuario
export const registrarUsuario = async (nombre, email, password, telefono) => {
  try {
    // Validaciones
    if (!nombre || !email || !password || !telefono) {
      return { success: false, message: 'Todos los campos son obligatorios' };
    }

    if (!validarEmail(email)) {
      return { success: false, message: 'El formato del email no es válido' };
    }

    if (password.length < 6) {
      return { success: false, message: 'La contraseña debe tener al menos 6 caracteres' };
    }

    if (!validarTelefono(telefono)) {
      return { success: false, message: 'El teléfono debe tener 10 dígitos' };
    }

    const db = await getDatabase();
    
    // Verificar si el email ya existe
    const usuarioExistente = await db.getFirstAsync(
      'SELECT * FROM usuarios WHERE email = ?',
      [email]
    );

    if (usuarioExistente) {
      return { success: false, message: 'El email ya está registrado' };
    }

    // Insertar nuevo usuario
    const result = await db.runAsync(
      'INSERT INTO usuarios (nombre, email, password, telefono) VALUES (?, ?, ?, ?)',
      [nombre, email, password, telefono]
    );

    return { 
      success: true, 
      message: 'Usuario registrado exitosamente',
      userId: result.lastInsertRowId 
    };
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    return { success: false, message: 'Error al registrar usuario' };
  }
};

// Iniciar sesión
export const iniciarSesion = async (email, password) => {
  try {
    if (!email || !password) {
      return { success: false, message: 'Email y contraseña son obligatorios' };
    }

    const db = await getDatabase();
    
    const usuario = await db.getFirstAsync(
      'SELECT * FROM usuarios WHERE email = ? AND password = ?',
      [email, password]
    );

    if (!usuario) {
      return { success: false, message: 'Email o contraseña incorrectos' };
    }

    return { 
      success: true, 
      message: 'Inicio de sesión exitoso',
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        telefono: usuario.telefono
      }
    };
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    return { success: false, message: 'Error al iniciar sesión' };
  }
};

// Recuperar contraseña (actualizar contraseña)
export const recuperarPassword = async (email, nuevaPassword) => {
  try {
    if (!email || !nuevaPassword) {
      return { success: false, message: 'Email y nueva contraseña son obligatorios' };
    }

    if (!validarEmail(email)) {
      return { success: false, message: 'El formato del email no es válido' };
    }

    if (nuevaPassword.length < 6) {
      return { success: false, message: 'La contraseña debe tener al menos 6 caracteres' };
    }

    const db = await getDatabase();
    
    // Verificar si el usuario existe
    const usuario = await db.getFirstAsync(
      'SELECT * FROM usuarios WHERE email = ?',
      [email]
    );

    if (!usuario) {
      return { success: false, message: 'El email no está registrado' };
    }

    // Actualizar contraseña
    await db.runAsync(
      'UPDATE usuarios SET password = ? WHERE email = ?',
      [nuevaPassword, email]
    );

    return { 
      success: true, 
      message: 'Contraseña actualizada exitosamente'
    };
  } catch (error) {
    console.error('Error al recuperar contraseña:', error);
    return { success: false, message: 'Error al recuperar contraseña' };
  }
};

// Obtener usuario por ID
export const obtenerUsuarioPorId = async (userId) => {
  try {
    const db = await getDatabase();
    
    const usuario = await db.getFirstAsync(
      'SELECT id, nombre, email, telefono FROM usuarios WHERE id = ?',
      [userId]
    );

    if (!usuario) {
      return { success: false, message: 'Usuario no encontrado' };
    }

    return { 
      success: true, 
      usuario 
    };
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    return { success: false, message: 'Error al obtener usuario' };
  }
};
