import React, { useState } from 'react';
import { View, Text, StyleSheet, StatusBar, ScrollView, TouchableOpacity, Image, SafeAreaView, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width - 40; // chart width inside card

export default function Comparacion({ navigation, volver }) {
  // Por defecto mostrar SEPTIEMBRE
  const [mesSeleccionado, setMesSeleccionado] = useState(9);

  // Datos de ejemplo (reemplaza con tus datos reales)
  const data = {
    labels: ['INGRESOS', 'GASTOS'],
    datasets: [
      {
        data: [1800, 5200],
      },
    ],
  };

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

  const mesesNombres = ['ENE','FEB','MAR','ABR','MAY','JUN','JUL','AGO','SEP','OCT','NOV','DIC'];

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
        <TouchableOpacity onPress={() => navigation?.openDrawer && navigation.openDrawer()} style={styles.hamburger}>
          <Text style={{ color: '#fff', fontSize: 20 }}>≡</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.sectionTitle}>"COMPARACIÓN DEL MES"</Text>

        {/* Card centrada con mes y gráfica */}
        <View style={styles.card}>
          <Text style={styles.monthLabel}>{mesesNombres[mesSeleccionado - 1]}</Text>
          <Text style={styles.monthTitle}>SEPTIEMBRE</Text>

          <View style={styles.chartWrapper}>
            <BarChart
              data={data}
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

          <View style={styles.alertBox}>
            <Text style={styles.alertText}>Este mes tus gastos superaron a tus ingresos. Considera revisar tus presupuestos para mejorar tu balance.</Text>
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
      </ScrollView>
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
  hamburger: { padding: 8 },

  container: { alignItems: 'center', paddingVertical: 20 },
  sectionTitle: { color: '#E8F6F7', fontSize: 16, marginBottom: 16, textAlign: 'center' },

  card: { width: '90%', backgroundColor: '#fff', borderRadius: 12, padding: 16, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 8, elevation: 4, marginBottom: 20 },
  monthLabel: { color: '#004A77', fontSize: 12, fontWeight: '600' },
  monthTitle: { color: '#004A77', fontSize: 22, fontWeight: 'bold', marginVertical: 8 },
  chartWrapper: { marginTop: 6 },

  legendRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 12 },
  legendItem: { flexDirection: 'row', alignItems: 'center' },
  legendBox: { width: 12, height: 12, borderRadius: 3, marginRight: 8 },
  legendText: { fontSize: 12, color: '#333' },

  alertBox: { backgroundColor: '#0E8AA7', padding: 12, borderRadius: 8, marginTop: 14, width: '100%' },
  alertText: { color: '#fff', textAlign: 'center' },

  monthsRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', width: '100%' },
  monthChip: { paddingHorizontal: 8, paddingVertical: 6, margin: 6, borderRadius: 6, backgroundColor: 'transparent' },
  monthChipActive: { backgroundColor: '#0F9DD6' },
  monthChipText: { color: '#E8F6F7' },
  monthChipTextActive: { color: '#fff', fontWeight: '600' },
});