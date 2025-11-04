import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Comparacion() {
  const navigation = useNavigation();

  const data = {
    labels: ['INGRESOS', 'GASTOS'],
    datasets: [
      {
        data: [1800, 5200],
      },
    ],
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.simpleHeader}>
        <Text style={styles.headerText}>AHORRA + APP</Text>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.title}>COMPARACIÓN DE INGRESOS Y GASTOS</Text>
        <Text style={styles.monthName}>SEPTIEMBRE</Text>

        <View style={styles.chartArea}>
          <Text style={styles.chartText}>[Aquí va el gráfico de barras]</Text>

          
          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <View style={[styles.colorBox, { backgroundColor: '#66CDAA' }]} />
              <Text style={styles.legendLabel}> INGRESOS</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.colorBox, { backgroundColor: '#FF4500' }]} />
              <Text style={styles.legendLabel}> GASTOS</Text>
            </View>
          </View>
        </View>

        <View style={styles.alertBox}>
          <Text style={styles.alertText}>¡Atención! Tus gastos superan tus ingresos este mes.</Text>
        </View>

        <View style={{ padding: 16 }}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Ingresos')}
            style={{ marginTop: 12, padding: 10, backgroundColor: '#2196F3', borderRadius: 6 }}
          >
            <Text style={{ color: '#fff', textAlign: 'center' }}>Ir a Ingresos</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('Gastos')}
            style={{ marginTop: 8, padding: 10, backgroundColor: '#4CAF50', borderRadius: 6 }}
          >
            <Text style={{ color: '#fff', textAlign: 'center' }}>Ir a Gastos</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
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