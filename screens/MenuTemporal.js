import { Text, StyleSheet, View, Button, ScrollView } from 'react-native';
import React, { useState } from 'react';

// interfaces (pantallas)
import Autenticacion from './Autenticacion';
import CalendarioComparacion from './CalendarioComparacion';
import Comparacion from './Comparacion';
import CrearTrans from './CrearTrans';
import EditarTrans from './EditarTrans';
import Gastos from './Gastos';
import Ingresos from './Ingresos';
import MenuLateral from './MenuLateral';
import Notificaciones from './Notificaciones';
import Password from './Password';
import Presupuesto1 from './Presupuesto1';
import Presupuesto2 from './Presupuesto2';
import Registro from './Registro';
import Sesion from './Sesion';
import Transacciones from './Transacciones';

export default function MenuTemporal() {
  const [screen, setScreen] = useState('menu');

  switch (screen) {
    case 'Autenticacion':
      return <Autenticacion volver={() => setScreen('menu')} />;
    case 'CalendarioComparacion':
      return <CalendarioComparacion volver={() => setScreen('menu')} />;
    case 'Comparacion':
      return <Comparacion volver={() => setScreen('menu')} />;
    case 'CrearTrans':
      return <CrearTrans volver={() => setScreen('menu')} />;
    case 'EditarTrans':
      return <EditarTrans volver={() => setScreen('menu')} />;
    case 'Gastos':
      return <Gastos volver={() => setScreen('menu')} />;
    case 'Ingresos':
      return <Ingresos volver={() => setScreen('menu')} />;
    case 'MenuLateral':
      return <MenuLateral volver={() => setScreen('menu')} />;
    case 'Notificaciones':
      return <Notificaciones volver={() => setScreen('menu')} />;
    case 'Password':
      return <Password volver={() => setScreen('menu')} />;
    case 'Presupuesto1':
      return <Presupuesto1 volver={() => setScreen('menu')} />;
    case 'Presupuesto2':
      return <Presupuesto2 volver={() => setScreen('menu')} />;
    case 'Registro':
      return <Registro volver={() => setScreen('menu')} />;
    case 'Sesion':
      return <Sesion volver={() => setScreen('menu')} />;
    case 'Transacciones':
      return <Transacciones volver={() => setScreen('menu')} />;
    case 'menu':
    default:
      return (
        <View style={styles.container}>
          <Text style={styles.texto}>Menu de Screens Temporal</Text>

          {/* 🔽 ScrollView para desplazamiento */}
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <Button color="#843110ff" onPress={() => setScreen('Autenticacion')} title="Screen: Autenticacion" />
            <Button color="#843110ff" onPress={() => setScreen('CalendarioComparacion')} title="Screen: CalendarioComparacion" />
            <Button color="#843110ff" onPress={() => setScreen('Comparacion')} title="Screen: Comparacion" />
            <Button color="#843110ff" onPress={() => setScreen('CrearTrans')} title="Screen: CrearTrans" />
            <Button color="#843110ff" onPress={() => setScreen('EditarTrans')} title="Screen: EditarTrans" />
            <Button color="#843110ff" onPress={() => setScreen('Gastos')} title="Screen: Gastos" />
            <Button color="#843110ff" onPress={() => setScreen('Ingresos')} title="Screen: Ingresos" />
            <Button color="#843110ff" onPress={() => setScreen('MenuLateral')} title="Screen: MenuLateral" />
            <Button color="#843110ff" onPress={() => setScreen('Notificaciones')} title="Screen: Notificaciones" />
            <Button color="#843110ff" onPress={() => setScreen('Password')} title="Screen: Password" />
            <Button color="#843110ff" onPress={() => setScreen('Presupuesto1')} title="Screen: Presupuesto1" />
            <Button color="#843110ff" onPress={() => setScreen('Presupuesto2')} title="Screen: Presupuesto2" />
            <Button color="#843110ff" onPress={() => setScreen('Registro')} title="Screen: Registro" />
            <Button color="#843110ff" onPress={() => setScreen('Sesion')} title="Screen: Sesion" />
            <Button color="#843110ff" onPress={() => setScreen('Transacciones')} title="Screen: Transacciones" />
          </ScrollView>
        </View>
      );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#cfcfcfff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
  },
  texto: {
    fontFamily: 'Times New Roman',
    fontSize: 22,
    color: '#000000ff',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  scrollContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 50,
    gap: 10, // espaciado entre botones
  },
});
