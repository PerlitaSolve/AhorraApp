/**
 * Servicio de Autenticación
 * CAPA DE SERVICIO - Actúa como interfaz para las vistas
 * Delega la lógica de negocio al controlador
 */

import AuthController from '../controllers/AuthController';

// Registrar un nuevo usuario
export const registrarUsuario = async (nombre, email, password, telefono) => {
  return await AuthController.registrarUsuario(nombre, email, password, telefono);
};

// Iniciar sesión
export const iniciarSesion = async (email, password) => {
  return await AuthController.iniciarSesion(email, password);
};

// Recuperar contraseña (actualizar contraseña)
export const recuperarPassword = async (email, nuevaPassword) => {
  return await AuthController.recuperarPassword(email, nuevaPassword);
};
