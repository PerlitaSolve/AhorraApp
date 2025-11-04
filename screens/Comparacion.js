import React, { useState } from 'react';
import { View, Text, StyleSheet, StatusBar, ScrollView, TouchableOpacity, Image } from 'react-native';

export default function Comparacion({ navigation }) {
  const [mesSeleccionado, setMesSeleccionado] = useState(null);

  const meses = [
    { id: 1, nombre: 'ENE', activo: true },
    { id: 2, nombre: 'FEB', activo: false },
    { id: 3, nombre: 'MAR', activo: true },
    { id: 4, nombre: 'ABR', activo: false },
    { id: 5, nombre: 'MAY', activo: false },
    { id: 6, nombre: 'JUN', activo: true },
    { id: 7, nombre: 'JUL', activo: false },
    { id: 8, nombre: 'AGO', activo: true },
    { id: 9, nombre: 'SEP', activo: true },
    { id: 10, nombre: 'OCT', activo: false },
    { id: 11, nombre: 'NOV', activo: true },
    { id: 12, nombre: 'DIC', activo: false },
  ];

  const handleMesPress = (mesId) => {
    setMesSeleccionado(mesId);
    console.log('Mes seleccionado:', mesId);
    // Aquí puedes navegar a la pantalla de comparación con el mes seleccionado
    // navigation?.navigate('DetalleComparacion', { mes: mesId });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1D617A" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.backButton}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Image 
          source={require('../assets/logo.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.titulo}>AHORRA + APP</Text>
        <TouchableOpacity style={styles.menuButton}>
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>
      </View>

      {/* Título de la sección */}
      <Text style={styles.subtitulo}>"COMPARACIÓN DEL MES"</Text>

      {/* Año */}
      <View style={styles.añoContainer}>
        <Text style={styles.añoTexto}>2025</Text>
      </View>

      {/* Contenedor principal con grid de meses */}
      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
        <View style={styles.mesesContainer}>
          
          {/* Icono de calendario */}
          <View style={styles.calendarioIconContainer}>
            <View style={styles.calendarioIcon}>
              <View style={styles.calendarioHeader}>
                <View style={styles.calendarioLinea} />
                <View style={styles.calendarioLinea} />
                <View style={styles.calendarioLinea} />
              </View>
              <View style={styles.calendarioBody}>
                <View style={styles.calendarioCuadro} />
                <View style={styles.calendarioCuadro} />
                <View style={styles.calendarioCuadro} />
                <View style={styles.calendarioCuadro} />
              </View>
            </View>
          </View>

          {/* Grid de meses */}
          <View style={styles.gridMeses}>
            {meses.map((mes) => (
              <TouchableOpacity
                key={mes.id}
                style={[
                  styles.mesButton,
                  mes.activo ? styles.mesActivo : styles.mesInactivo,
                  mesSeleccionado === mes.id && styles.mesSeleccionado
                ]}
                onPress={() => handleMesPress(mes.id)}
              >
                <Text style={[
                  styles.mesTexto,
                  mes.activo ? styles.mesTextoActivo : styles.mesTextoInactivo
                ]}>
                  {mes.nombre}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FFF',
},
  simpleHeader: { 
    padding: 12, 
    backgroundColor: '#004A77', 
    alignItems: 'center',
},
  headerText: { 
    color: '#FFF', 
    fontSize: 16, 
    fontWeight: 'bold',
},

  content: { 
    flex: 1, 
    padding: 12,
},
  title: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    textAlign: 'center', 
    marginBottom: 8, 
    color: '#004A77',
},
  monthName: { 
    fontSize: 16, 
    textAlign: 'center', 
    marginBottom: 12,
},

  chartArea: { 
    alignItems: 'center', 
    marginBottom: 16, 
    padding: 10, 
    backgroundColor: '#F9F9F9', 
    borderRadius: 8,
},
  chartText: { 
    color: '#333', 
    marginBottom: 8,
},

  legend: { 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    width: '100%', 
    marginTop: 6,
},
  legendItem: { 
    flexDirection: 'row', 
    alignItems: 'center',
},
  colorBox: { 
    width: 14, 
    height: 14, 
    borderRadius: 3, 
    marginRight: 6, 
},
  legendLabel: { 
    fontSize: 14, 
    color: '#333',
},

  alertBox: { 
    backgroundColor: '#FFF0F0', 
    borderColor: '#FF4500', 
    borderWidth: 1, 
    padding: 12, 
    borderRadius: 8, 
    marginBottom: 12,
},
  alertText: { 
    color: '#555', 
    fontSize: 14,
},
});