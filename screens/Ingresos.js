import React from 'react';
import { View, Text, Button, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';

export default function Ingresos({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.tabsContainer}>
          <TouchableOpacity style={[styles.tab, styles.inactiveTab]}>
            <Text style={styles.tabTextInactive}>EGRESOS</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.tab, styles.activeTab]}>
            <Text style={styles.tabTextActive}>INGRESOS</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.timeFilter}>
          <Text style={styles.filterText}>Semana</Text>
          <Text style={styles.filterText}>Mes</Text>
          <Text style={styles.filterText}>Año</Text>
        </View>

        <Text style={styles.monthTitle}>ANUAL</Text>

        <View style={[styles.chartPlaceholder, styles.annualChart]}>
          <Text style={styles.chartText}>Gráfico Anual de Ingresos</Text>
        </View>

        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>Añadir +</Text>
        </TouchableOpacity>

        {/* Botones de ejemplo que navegan a otras pantallas por nombre */}
        <Button title="Ir a Gastos" onPress={() => navigation.navigate('Gastos')} />
        <Button title="Ir a Comparación" onPress={() => navigation.navigate('Comparacion')} />
        <Button title="Ir al Menú" onPress={() => (navigation.openDrawer ? navigation.openDrawer() : navigation.navigate('MenuLateral'))} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FFF',
},
  header: { 
    backgroundColor: '#004A77', 
    padding: 20, 
    paddingBottom: 50, 
},
  tabsContainer: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    marginTop: 20,
},
  tab: { 
    paddingVertical: 8, 
    paddingHorizontal: 15, 
    marginHorizontal: 5, 
    borderRadius: 20,
},
  activeTab: { 
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
},
  inactiveTab: { 
    backgroundColor: 'transparent', 
},
  tabTextActive: { 
    color: '#FFF', 
    fontWeight: 'bold', 
},
  tabTextInactive: { 
    color: '#BEE6F2', 
},

  content: { 
    flex: 1, 
    padding: 20,
},
  timeFilter: { 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    marginBottom: 20, 
    marginTop: 10, 
    borderBottomWidth: 1, 
    borderBottomColor: '#EEE', 
    paddingBottom: 10,
},
  filterText: { 
    color: '#888', 
    fontSize: 16, 
},

  monthTitle: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    marginBottom: 15, 
},
  chartPlaceholder: { 
    height: 180, 
    borderRadius: 90, 
    backgroundColor: '#ADD8E6', 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginBottom: 20, 
},
  chartText: { 
    color: '#555', 
    fontSize: 16, 
},

  addButton: { 
    backgroundColor: '#004A77', 
    padding: 15, 
    borderRadius: 8, 
    alignItems: 'center', 
    marginTop: 20. 
},
  addButtonText: { 
    color: '#FFF', 
    fontSize: 18, 
    fontWeight: 'bold'
},
});

