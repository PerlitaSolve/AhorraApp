import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
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
  const [dbInitialized, setDbInitialized] = useState(false);
  const [dbError, setDbError] = useState(null);

  useEffect(() => {
    // Inicializar la base de datos cuando la app arranca
    const setupDatabase = async () => {
      try {
        await initDatabase();
        console.log('Base de datos inicializada correctamente');
        setDbInitialized(true);
      } catch (error) {
        console.error('Error al inicializar la base de datos:', error);
        setDbError(error.message);
      }
    };
    
    setupDatabase();
  }, []);

  // Mostrar loading mientras se inicializa la BD
  if (!dbInitialized) {
    if (dbError) {
      return (
        <View style={styles.container}>
          <Text style={styles.errorText}>Error al inicializar la base de datos:</Text>
          <Text style={styles.errorDetail}>{dbError}</Text>
        </View>
      );
    }
    
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#1D617A" />
        <Text style={styles.loadingText}>Inicializando base de datos...</Text>
      </View>
    );
  }

  return (
    <UserProvider>
      <MenuTemporal/>
    </UserProvider>
  );
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 18,
    color: '#d32f2f',
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  errorDetail: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});

