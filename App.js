import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Screens
import Autenticacion from './screens/Autenticacion';
import Registro from './screens/Registro';
import Sesion from './screens/Sesion';
import Password from './screens/Password';
import Ingresos from './screens/Ingresos';
import Gastos from './screens/Gastos';
import Comparacion from './screens/Comparacion';
import Notificaciones from './screens/Notificaciones';
import Presupuesto1 from './screens/Presupuesto1';
import Presupuesto2 from './screens/Presupuesto2';
import CalendarioComparacion from './screens/CalendarioComparacion';
import MenuLateral from './screens/MenuLateral';
import CrearTrans from './screens/CrearTrans';
import EditarTrans from './screens/EditarTrans';
import Transacciones from './screens/Transacciones';

import { UserProvider } from './context/UserContext';
import { initDatabase } from './services/database';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#1D617A',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#E5E5EA',
          height: 85,
          paddingBottom: 25,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen 
        name="Ingresos" 
        component={Ingresos}
        options={{
          tabBarLabel: 'Ingresos',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="arrow-down-circle" size={26} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Gastos" 
        component={Gastos}
        options={{
          tabBarLabel: 'Gastos',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="arrow-up-circle" size={26} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Transacciones" 
        component={Transacciones}
        options={{
          tabBarLabel: 'Historial',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list" size={26} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Presupuestos" 
        component={Presupuesto1}
        options={{
          tabBarLabel: 'Presupuestos',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="wallet" size={26} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

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
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Autenticacion">
          <Stack.Screen 
            name="Autenticacion" 
            component={Autenticacion} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="Registro" 
            component={Registro} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="Sesion" 
            component={Sesion} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="Password" 
            component={Password} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="Home" 
            component={HomeTabs} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="Comparacion" 
            component={Comparacion} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="Notificaciones" 
            component={Notificaciones} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="Presupuesto2" 
            component={Presupuesto2} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="CalendarioComparacion" 
            component={CalendarioComparacion} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="MenuLateral" 
            component={MenuLateral} 
            options={{ 
              headerShown: false,
              presentation: 'transparentModal',
              animation: 'slide_from_right',
            }} 
          />
          <Stack.Screen 
            name="CrearTrans" 
            component={CrearTrans} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="EditarTrans" 
            component={EditarTrans} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="Transacciones" 
            component={Transacciones} 
            options={{ headerShown: false }} 
          />
        </Stack.Navigator>
      </NavigationContainer>
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

