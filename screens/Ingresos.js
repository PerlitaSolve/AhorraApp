import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { useUser } from '../context/UserContext';
import { obtenerTransaccionesFiltradas } from '../services/transactionService';

const screenWidth = Dimensions.get('window').width - 40;

export default function Ingresos({ navigation, volver }) {
  const { usuario } = useUser();
  const [periodo, setPeriodo] = useState('Mes'); // 'Semana', 'Mes', 'Año'
  const [datosGrafica, setDatosGrafica] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [totalIngresos, setTotalIngresos] = useState(0);
  const [transacciones, setTransacciones] = useState([]);

  const fechaActual = new Date();
  const mesActual = fechaActual.getMonth() + 1;
  const anioActual = fechaActual.getFullYear();

  // Obtener datos de transacciones según el período
  const cargarDatos = async () => {
    if (!usuario?.id) {
      console.log('No hay usuario autenticado');
      return;
    }

    setCargando(true);
    try {
      let filtros = { tipo: 'INGRESO' };

      if (periodo === 'Mes') {
        filtros.mes = mesActual;
        filtros.anio = anioActual;
      } else if (periodo === 'Año') {
        filtros.anio = anioActual;
      }
      // Para 'Semana' se podría agregar lógica de rango de fechas

      const resultado = await obtenerTransaccionesFiltradas(usuario.id, filtros);

      if (resultado.success) {
        setTransacciones(resultado.transacciones || []);
        
        // Procesar datos para la gráfica: agrupar por categoría
        const datosAgrupados = {};
        let total = 0;

        resultado.transacciones.forEach(trans => {
          const categoria = trans.categoria || 'Sin categoría';
          if (!datosAgrupados[categoria]) {
            datosAgrupados[categoria] = 0;
          }
          datosAgrupados[categoria] += trans.monto;
          total += trans.monto;
        });

        setTotalIngresos(total);

        // Convertir a formato para PieChart
        if (Object.keys(datosAgrupados).length > 0) {
          const labels = Object.keys(datosAgrupados);
          const data = Object.values(datosAgrupados);
          const colores = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F'];

          setDatosGrafica({
            labels,
            datasets: [{ data }],
            colores: colores.slice(0, labels.length)
          });
        } else {
          setDatosGrafica(null);
        }
      }
    } catch (error) {
      console.error('Error al cargar ingresos:', error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, [periodo, usuario?.id]);

  const mesesNombres = ['ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'];
  const mesNombre = mesesNombres[mesActual - 1];

  return (
    <SafeAreaView style={styles.container}>
      {volver && (
        <TouchableOpacity onPress={volver} style={styles.backButton}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
      )}
      <View style={styles.header}>
        <View style={styles.tabsContainer}>
          <TouchableOpacity style={[styles.tab, styles.inactiveTab]} onPress={() => navigation.navigate('Gastos')}>
            <Text style={styles.tabTextInactive}>EGRESOS</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.tab, styles.activeTab]}>
            <Text style={styles.tabTextActive}>INGRESOS</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.timeFilter}>
          <TouchableOpacity onPress={() => setPeriodo('Semana')}>
            <Text style={[styles.filterText, periodo === 'Semana' && styles.filterTextActive]}>Semana</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setPeriodo('Mes')}>
            <Text style={[styles.filterText, periodo === 'Mes' && styles.filterTextActive]}>Mes</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setPeriodo('Año')}>
            <Text style={[styles.filterText, periodo === 'Año' && styles.filterTextActive]}>Año</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.monthTitle}>{periodo === 'Mes' ? mesNombre : periodo.toUpperCase()}</Text>

        {cargando ? (
          <View style={styles.chartPlaceholder}>
            <ActivityIndicator size="large" color="#004A77" />
          </View>
        ) : datosGrafica ? (
          <>
            <View style={styles.chartContainer}>
              <PieChart
                data={{
                  labels: datosGrafica.labels,
                  datasets: [{ data: datosGrafica.datasets[0].data }],
                }}
                width={screenWidth}
                height={220}
                chartConfig={{
                  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                }}
                accessor={'data'}
                backgroundColor={'transparent'}
                paddingLeft={'0'}
                colors={datosGrafica.colores}
              />
            </View>

            <View style={styles.resumenContainer}>
              <Text style={styles.totalLabel}>Total Ingresos</Text>
              <Text style={styles.totalAmount}>$ {totalIngresos.toFixed(2)}</Text>
            </View>

            <View style={styles.listContainer}>
              <Text style={styles.listTitle}>Desglose por Categoría</Text>
              {transacciones.map((trans, idx) => (
                <View key={idx} style={styles.listItem}>
                  <View style={[styles.colorDot, { backgroundColor: datosGrafica.colores[datosGrafica.labels.indexOf(trans.categoria)] }]} />
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemCategory}>{trans.categoria}</Text>
                    <Text style={styles.itemDate}>{new Date(trans.fecha).toLocaleDateString()}</Text>
                  </View>
                  <Text style={styles.itemAmount}>$ {trans.monto.toFixed(2)}</Text>
                </View>
              ))}
            </View>
          </>
        ) : (
          <View style={styles.chartPlaceholder}>
            <Text style={styles.chartText}>No hay ingresos registrados en este período</Text>
          </View>
        )}

        <TouchableOpacity 
          style={styles.addButton} 
          onPress={() => navigation.navigate('CrearTrans', { tipo: 'INGRESO' })}
        >
          <Text style={styles.addButtonText}>Añadir Ingreso +</Text>
        </TouchableOpacity>

        <View style={styles.navButtons}>
          <Button title="Ir a Gastos" onPress={() => navigation.navigate('Gastos')} />
          <Button title="Ir a Comparación" onPress={() => navigation.navigate('Comparacion')} />
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
    borderBottomWidth: 2, 
    borderBottomColor: '#E0E0E0', 
    paddingBottom: 10,
  },
  filterText: { 
    color: '#888', 
    fontSize: 14,
    padding: 5,
  },
  filterTextActive: {
    color: '#004A77',
    fontWeight: 'bold',
    fontSize: 15,
  },
  monthTitle: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    marginBottom: 15,
    textAlign: 'center',
  },
  chartContainer: {
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 10,
  },
  chartPlaceholder: { 
    height: 200, 
    borderRadius: 12, 
    backgroundColor: '#F0F0F0', 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginBottom: 20, 
  },
  chartText: { 
    color: '#999', 
    fontSize: 16,
    textAlign: 'center',
  },
  resumenContainer: {
    backgroundColor: '#E8F4F8',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  totalAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#004A77',
  },
  listContainer: {
    marginBottom: 20,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    marginBottom: 8,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemCategory: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  itemDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  itemAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#004A77',
  },
  addButton: { 
    backgroundColor: '#004A77', 
    padding: 15, 
    borderRadius: 8, 
    alignItems: 'center', 
    marginTop: 20,
    marginBottom: 15,
  },
  backButton: { 
    position: 'absolute', 
    top: 50, 
    left: 20, 
    zIndex: 10 
  },
  backArrow: { 
    fontSize: 30, 
    color: 'white', 
    fontWeight: 'bold' 
  },
  addButtonText: { 
    color: '#FFF', 
    fontSize: 18, 
    fontWeight: 'bold'
  },
  navButtons: {
    marginBottom: 20,
  },
});

