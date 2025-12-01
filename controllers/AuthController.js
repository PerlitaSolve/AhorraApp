import UserModel from '../models/UserModel';

/**
 * Controlador de Autenticación
 * Responsabilidad: Lógica de negocio, validaciones y orquestación
 */

class AuthController {
  /**
   * Validar formato de email
   */
  static validarEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validar formato de teléfono
   */
  static validarTelefono(telefono) {
    const telefonoRegex = /^[0-9]{10}$/;
    return telefonoRegex.test(telefono);
  }

  /**
   * Registrar un nuevo usuario
   */
  static async registrarUsuario(nombre, email, password, telefono) {
    try {
      // Validaciones de negocio
      if (!nombre || !email || !password || !telefono) {
        return { success: false, message: 'Todos los campos son obligatorios' };
      }

      if (!this.validarEmail(email)) {
        return { success: false, message: 'El formato del email no es válido' };
      }

      if (password.length < 6) {
        return { success: false, message: 'La contraseña debe tener al menos 6 caracteres' };
      }

      if (!this.validarTelefono(telefono)) {
        return { success: false, message: 'El teléfono debe tener 10 dígitos' };
      }

      // Verificar si el email ya existe
      const usuarioExistente = await UserModel.findByEmail(email);
      if (usuarioExistente) {
        return { success: false, message: 'El email ya está registrado' };
      }

      // Crear el usuario
      const userId = await UserModel.create(nombre, email, password, telefono);

      return { 
        success: true, 
        message: 'Usuario registrado exitosamente',
        userId 
      };
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      return { success: false, message: 'Error al registrar usuario' };
    }
  }

  /**
   * Iniciar sesión
   */
  static async iniciarSesion(email, password) {
    try {
      // Validaciones de negocio
      if (!email || !password) {
        return { success: false, message: 'Email y contraseña son obligatorios' };
      }

      // Buscar usuario por credenciales
      const usuario = await UserModel.findByCredentials(email, password);

      if (!usuario) {
        return { success: false, message: 'Email o contraseña incorrectos' };
      }

      // Retornar datos del usuario sin la contraseña
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
  }

  /**
   * Recuperar contraseña
   */
  static async recuperarPassword(email, nuevaPassword) {
    try {
      // Validaciones de negocio
      if (!email || !nuevaPassword) {
        return { success: false, message: 'Email y nueva contraseña son obligatorios' };
      }

      if (!this.validarEmail(email)) {
        return { success: false, message: 'El formato del email no es válido' };
      }

      if (nuevaPassword.length < 6) {
        return { success: false, message: 'La nueva contraseña debe tener al menos 6 caracteres' };
      }

      // Verificar si el usuario existe
      const usuario = await UserModel.findByEmail(email);
      if (!usuario) {
        return { success: false, message: 'No existe un usuario con ese email' };
      }

      // Actualizar la contraseña
      const actualizado = await UserModel.updatePassword(email, nuevaPassword);

      if (!actualizado) {
        return { success: false, message: 'Error al actualizar la contraseña' };
      }

      return { 
        success: true, 
        message: 'Contraseña actualizada exitosamente' 
      };
    } catch (error) {
      console.error('Error al recuperar contraseña:', error);
      return { success: false, message: 'Error al recuperar la contraseña' };
    }
  }

  /**
   * Actualizar información del usuario
   */
  static async actualizarUsuario(id, nombre, email, telefono) {
    try {
      // Validaciones de negocio
      if (!id || !nombre || !email || !telefono) {
        return { success: false, message: 'Todos los campos son obligatorios' };
      }

      if (!this.validarEmail(email)) {
        return { success: false, message: 'El formato del email no es válido' };
      }

      if (!this.validarTelefono(telefono)) {
        return { success: false, message: 'El teléfono debe tener 10 dígitos' };
      }

      // Verificar si el usuario existe
      const usuario = await UserModel.findById(id);
      if (!usuario) {
        return { success: false, message: 'Usuario no encontrado' };
      }

      // Actualizar datos
      const actualizado = await UserModel.update(id, { nombre, email, telefono });

      if (!actualizado) {
        return { success: false, message: 'Error al actualizar usuario' };
      }

      return { 
        success: true, 
        message: 'Usuario actualizado exitosamente' 
      };
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      return { success: false, message: 'Error al actualizar usuario' };
    }
  }
}

export default AuthController;
