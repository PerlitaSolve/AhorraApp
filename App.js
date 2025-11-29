import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import Autenticacion from './screens/Autenticacion'; // importar nuestra pantalla de contador 
import Ingresos from './screens/Ingresos';
import Gastos from './screens/Gastos';
import Comparacion from './screens/Comparacion';
import Notificaciones from './screens/Notificaciones';
import Presupuesto1 from './screens/Presupuesto1';
import Presupuesto2 from './screens/Presupuesto2';
import CalendarioComparacion from './screens/CalendarioComparacion';
import MenuLateral from './screens/MenuLateral';
import MenuTemporal from './screens/MenuTemporal';
import { UserProvider } from './context/UserContext';
import { initDatabase } from './services/database';

// 2. Main: Zona de componentes
export default function App() {

  useEffect(() => {
    // Inicializar la base de datos cuando la app arranca
    initDatabase().then(() => {
      console.log('Base de datos inicializada correctamente');
    }).catch(error => {
      console.error('Error al inicializar la base de datos:', error);
    });
  }, []);

  return (
    <UserProvider>
      <MenuTemporal/>
    </UserProvider>
  );
  
}

