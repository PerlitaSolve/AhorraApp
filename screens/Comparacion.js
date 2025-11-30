import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar, ScrollView, TouchableOpacity, Image, SafeAreaView, Dimensions, ActivityIndicator } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useUser } from '../context/UserContext';
import { obtenerResumenTransacciones } from '../services/transactionService';
import MenuLateral from './MenuLateral';

const screenWidth = Dimensions.get('window').width - 40;

export default function Comparacion({ navigation, volver }) {
  const { usuario } = useUser();
  const [mesSeleccionado, setMesSeleccionado] = useState(new Date().getMonth() + 1);
  const [anioSeleccionado, setAnioSeleccionado] = useState(new Date().getFullYear());
  const [cargando, setCargando] = useState(false);
  const [datosGrafica, setDatosGrafica] = useState(null);
  const [resumen, setResumen] = useState({ ingresos: 0, gastos: 0, balance: 0 });
  const [alerta, setAlerta] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);

  const mesesNombres = ['ENE','FEB','MAR','ABR','MAY','JUN','JUL','AGO','SEP','OCT','NOV','DIC'];
  const mesesCompletos = ['ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'];

  const cargarDatos = async () => {
    if (!usuario?.id) {
      console.log('No hay usuario autenticado');
      return;
    }

    setCargando(true);
    try {
      const resultado = await obtenerResumenTransacciones(usuario.id, {
        mes: mesSeleccionado,
        anio: anioSeleccionado
      });

      if (resultado.success) {
        const { ingresos, gastos, balance } = resultado.resumen;
        setResumen({ ingresos, gastos, balance });

        // Crear gráfica
        setDatosGrafica({
          labels: ['INGRESOS', 'GASTOS'],
          datasets: [
            {
              data: [ingresos, gastos],
            },
          ],
        });

        // Generar alerta según el balance
        if (gastos > ingresos) {
          setAlerta(`Este mes tus gastos superaron a tus ingresos en $${(gastos - ingresos).toFixed(2)}. Considera revisar tus presupuestos.`);
        } else if (ingresos > gastos) {
          setAlerta(`¡Excelente! Este mes ahorraste $${(ingresos - gastos).toFixed(2)}. Continúa así.`);
        } else {
          setAlerta('Este mes tus ingresos y gastos fueron iguales.');
        }
      }
    } catch (error) {
      console.error('Error al cargar comparación:', error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, [mesSeleccionado, anioSeleccionado, usuario?.id]);

  const chartConfig = {
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    fillShadowGradient: '#66CDAA',
    fillShadowGradientOpacity: 1,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: { borderRadius: 8 },
  };

  const getAlertColor = () => {
    if (resumen.balance > 0) return '#4CAF50'; // Verde
    if (resumen.balance < 0) return '#D32F2F'; // Rojo
    return '#0E8AA7'; // Azul neutro
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#1D617A" />

      {/* Header */}
      <View style={styles.header}>
        {volver && (
          <TouchableOpacity onPress={volver} style={styles.backButton}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
        )}
        <Image source={require('../assets/L-SFon.png')} style={styles.logo} />
        <Text style={styles.headerTitle}>AHORRA + APP</Text>
      </View>

      <TouchableOpacity 
        style={styles.menuButton}
        onPress={() => setMenuVisible(!menuVisible)}
      >
        <MaterialCommunityIcons name="menu" size={28} color="#357D8B" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.sectionTitle}>"COMPARACIÓN DEL MES"</Text>

        {/* Card centrada con mes y gráfica */}
        <View style={styles.card}>
          <Text style={styles.monthLabel}>{mesesNombres[mesSeleccionado - 1]}</Text>
          <Text style={styles.monthTitle}>{mesesCompletos[mesSeleccionado - 1]}</Text>

          {cargando ? (
            <View style={{ height: 220, justifyContent: 'center', width: '100%' }}>
              <ActivityIndicator size="large" color="#004A77" />
            </View>
          ) : datosGrafica ? (
            <View style={styles.chartWrapper}>
              <BarChart
                data={datosGrafica}
                width={screenWidth}
                height={220}
                yAxisLabel="$"
                chartConfig={chartConfig}
                verticalLabelRotation={0}
                fromZero
                showBarTops={false}
                withInnerLines={false}
                style={{ borderRadius: 12 }}
              />
            </View>
          ) : null}

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Ingresos</Text>
              <Text style={styles.statAmount}>$ {resumen.ingresos.toFixed(2)}</Text>
            </View>
            <View style={[styles.statBox, { borderLeftWidth: 1, borderLeftColor: '#E0E0E0' }]}>
              <Text style={styles.statLabel}>Gastos</Text>
              <Text style={[styles.statAmount, { color: '#D32F2F' }]}>$ {resumen.gastos.toFixed(2)}</Text>
            </View>
          </View>

          <View style={styles.balanceBox}>
            <Text style={styles.balanceLabel}>Balance del Mes</Text>
            <Text style={[styles.balanceAmount, { color: getAlertColor() }]}>$ {resumen.balance.toFixed(2)}</Text>
          </View>

          <View style={[styles.alertBox, { backgroundColor: getAlertColor() }]}>
            <Text style={styles.alertText}>{alerta}</Text>
          </View>

          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View style={[styles.legendBox, { backgroundColor: '#66CDAA' }]} />
              <Text style={styles.legendText}>Ingresos</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendBox, { backgroundColor: '#FF4500' }]} />
              <Text style={styles.legendText}>Gastos</Text>
            </View>
          </View>
        </View>

        {/* Selector de meses (simple fila) */}
        <View style={styles.monthsRow}>
          {mesesNombres.map((m, idx) => (
            <TouchableOpacity
              key={m}
              onPress={() => setMesSeleccionado(idx + 1)}
              style={[styles.monthChip, mesSeleccionado === idx + 1 && styles.monthChipActive]}
            >
              <Text style={[styles.monthChipText, mesSeleccionado === idx + 1 && styles.monthChipTextActive]}>{m}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.navButtons}>
          <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Ingresos')}>
            <Text style={styles.navButtonText}>Ir a Ingresos</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Gastos')}>
            <Text style={styles.navButtonText}>Ir a Gastos</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {menuVisible && (
        <View style={styles.menuOverlay}>
          <TouchableOpacity 
            style={styles.menuBackdrop}
            onPress={() => setMenuVisible(false)}
          />
          <View style={styles.menuContent}>
            <MenuLateral 
              navigation={navigation}
              volver={() => setMenuVisible(false)}
            />
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#1D617A' },
  header: { height: 80, backgroundColor: '#1D617A', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12 },
  backButton: { marginRight: 10 },
  backArrow: { fontSize: 30, color: 'white', fontWeight: 'bold' },
  logo: { width: 56, height: 56 },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginLeft: 12, flex: 1 },
  menuButton: { 
    position: 'absolute', 
    top: 50, 
    right: 20, 
    zIndex: 50, 
    padding: 10 
  },

  container: { alignItems: 'center', paddingVertical: 20 },
  sectionTitle: { color: '#E8F6F7', fontSize: 16, marginBottom: 16, textAlign: 'center' },

  card: { width: '90%', backgroundColor: '#fff', borderRadius: 12, padding: 16, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 8, elevation: 4, marginBottom: 20 },
  monthLabel: { color: '#004A77', fontSize: 12, fontWeight: '600' },
  monthTitle: { color: '#004A77', fontSize: 22, fontWeight: 'bold', marginVertical: 8 },
  chartWrapper: { marginTop: 6, width: '100%' },

  statsRow: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 16,
    marginBottom: 12,
  },
  statBox: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  statAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#004A77',
  },

  balanceBox: {
    width: '100%',
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  balanceLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: 24,
    fontWeight: 'bold',
  },

  legendRow: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#E0E0E0' },
  legendItem: { flexDirection: 'row', alignItems: 'center' },
  legendBox: { width: 12, height: 12, borderRadius: 3, marginRight: 8 },
  legendText: { fontSize: 12, color: '#333' },

  alertBox: { padding: 12, borderRadius: 8, marginTop: 12, width: '100%' },
  alertText: { color: '#fff', textAlign: 'center', fontSize: 13, fontWeight: '500' },

  monthsRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', width: '100%', marginBottom: 20 },
  monthChip: { paddingHorizontal: 8, paddingVertical: 6, margin: 6, borderRadius: 6, backgroundColor: 'transparent' },
  monthChipActive: { backgroundColor: '#0F9DD6' },
  monthChipText: { color: '#E8F6F7' },
  monthChipTextActive: { color: '#fff', fontWeight: '600' },

  navButtons: {
    flexDirection: 'row',
    gap: 10,
    width: '90%',
    marginBottom: 20,
  },
  navButton: {
    flex: 1,
    backgroundColor: '#004A77',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  navButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  menuOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    zIndex: 100,
  },
  menuBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  menuContent: {
    width: '70%',
    backgroundColor: '#FFF',
    height: '100%',
  },
});