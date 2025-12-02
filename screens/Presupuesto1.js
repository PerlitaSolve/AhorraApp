import { Text, StyleSheet, View, StatusBar, ScrollView, TouchableOpacity, Image, Alert, TextInput, Modal, ActivityIndicator, FlatList, Keyboard, TouchableWithoutFeedback } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const CATEGORIAS = ['Alimentacion', 'Educacion', 'Transporte', 'Servicios', 'Salud', 'Otros'];
import { 
  crearPresupuesto, 
  obtenerPresupuestos, 
  actualizarPresupuesto, 
  eliminarPresupuesto,
  obtenerResumenPresupuestos 
} from '../services/budgetService';

export default function Presupuesto1({ navigation, volver }) {
  const { usuario } = useUser();
  const [presupuestos, setPresupuestos] = useState([]);
  const [resumen, setResumen] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editando, setEditando] = useState(null);
  const [modalCategoriaVisible, setModalCategoriaVisible] = useState(false);
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [modalCategoriaFiltroVisible, setModalCategoriaFiltroVisible] = useState(false);
  const [categoriaFiltro, setCategoriaFiltro] = useState('');
  const [ordenFecha, setOrdenFecha] = useState('reciente'); // 'reciente' o 'antiguo'
  
  // Formulario
  const [categoria, setCategoria] = useState('');
  const [monto, setMonto] = useState('');
  const [periodo, setPeriodo] = useState('MENSUAL');
  const [mes, setMes] = useState(new Date().getMonth() + 1);
  const [anio, setAnio] = useState(new Date().getFullYear());

  useEffect(() => {
    if (usuario?.id) {
      cargarPresupuestos();
      cargarResumen();
    }
  }, [usuario?.id]);

  // Recargar datos cuando la pantalla recibe foco
  useFocusEffect(
    React.useCallback(() => {
      if (usuario?.id) {
        cargarPresupuestos();
        cargarResumen();
      }
    }, [usuario?.id])
  );

  const cargarPresupuestos = async () => {
    setLoading(true);
    try {
      const resultado = await obtenerPresupuestos(usuario.id);
      if (resultado.success) {
        setPresupuestos(resultado.presupuestos);
      }
    } catch (error) {
      console.error('Error al cargar presupuestos:', error);
    } finally {
      setLoading(false);
    }
  };

  const cargarResumen = async () => {
    try {
      const fechaActual = new Date();
      const mes = fechaActual.getMonth() + 1;
      const anio = fechaActual.getFullYear();
      
      const resultado = await obtenerResumenPresupuestos(
        usuario.id,
        mes,
        anio
      );
      
      if (resultado.success) {
        setResumen(resultado.resumen);
      }
    } catch (error) {
      console.error('Error al cargar resumen:', error);
    }
  };

  const abrirModal = (presupuesto = null) => {
    if (presupuesto) {
      setEditando(presupuesto);
      setCategoria(presupuesto.categoria);
      setMonto(presupuesto.monto.toString());
      setPeriodo(presupuesto.periodo);
      setMes(presupuesto.mes || new Date().getMonth() + 1);
      setAnio(presupuesto.anio);
    } else {
      setEditando(null);
      setCategoria('');
      setMonto('');
      setPeriodo('MENSUAL');
      setMes(new Date().getMonth() + 1);
      setAnio(new Date().getFullYear());
    }
    setModalVisible(true);
  };

  const cerrarModal = () => {
    setModalVisible(false);
    setEditando(null);
    setCategoria('');
    setMonto('');
    setPeriodo('MENSUAL');
  };

  const guardarPresupuesto = async () => {
    if (!categoria || !monto || !anio) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    }

    if (isNaN(monto) || parseFloat(monto) <= 0) {
      Alert.alert('Error', 'El monto debe ser un número válido mayor a 0');
      return;
    }

    setLoading(true);
    try {
      let resultado;
      if (editando) {
        resultado = await actualizarPresupuesto(
          editando.id,
          parseFloat(monto),
          categoria,
          periodo,
          periodo === 'MENSUAL' ? mes : null,
          anio
        );
      } else {
        resultado = await crearPresupuesto(
          usuario.id,
          categoria,
          parseFloat(monto),
          periodo,
          periodo === 'MENSUAL' ? mes : null,
          anio
        );
      }

      if (resultado.success) {
        Alert.alert('Éxito', resultado.message);
        cerrarModal();
        cargarPresupuestos();
        cargarResumen();
      } else {
        Alert.alert('Error', resultado.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Ocurrió un error al guardar el presupuesto');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = (id) => {
    Alert.alert(
      'Confirmar eliminación',
      '¿Estás seguro de que deseas eliminar este presupuesto?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            const resultado = await eliminarPresupuesto(id);
            if (resultado.success) {
              Alert.alert('Éxito', 'Presupuesto eliminado');
              cargarPresupuestos();
              cargarResumen();
            } else {
              Alert.alert('Error', resultado.message);
            }
          },
        },
      ]
    );
  };

  const handleRecargar = async () => {
    if (usuario?.id) {
      await cargarPresupuestos();
      await cargarResumen();
    }
  };

  const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1D617A" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.navigate('Home')} style={styles.logoButton}>
          <Image source={require('../assets/L-SFon.png')} style={styles.logoIcon} />
        </TouchableOpacity>
        <Text style={styles.titulo}>PRESUPUESTOS</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity 
            style={styles.reloadButton} 
            onPress={handleRecargar}
            disabled={loading}
          >
            <Ionicons name="reload" size={24} color={loading ? "#ccc" : "white"} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.filterButton} 
            onPress={() => setMostrarFiltros(true)}
          >
            <Ionicons name="filter" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuButton} onPress={() => navigation?.navigate('MenuLateral')}>
            <Ionicons name="menu" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {resumen.length > 0 && (
          <View style={styles.resumenContainer}>
            <Text style={styles.resumenTitulo}>
              {resumen.some(item => item.periodo === 'MENSUAL') && resumen.some(item => item.periodo === 'ANUAL') 
                ? 'Resumen de Presupuestos' 
                : resumen[0]?.periodo === 'ANUAL' 
                  ? 'Resumen Anual' 
                  : 'Resumen del mes actual'}
            </Text>
            {resumen.map((item, index) => (
              <View key={index} style={styles.resumenItem}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                  <Text style={styles.resumenCategoria}>{item.categoria}</Text>
                  <Text style={styles.resumenPeriodoBadge}>{item.periodo === 'ANUAL' ? 'Anual' : 'Mensual'}</Text>
                </View>
                <Text style={styles.resumenDetalle}>
                  ${item.gastado?.toFixed(2) || 0} / ${item.presupuesto?.toFixed(2) || 0}
                </Text>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill, 
                      { 
                        width: `${Math.min(item.porcentajeUsado || 0, 100)}%`,
                        backgroundColor: item.excedido ? '#d32f2f' : item.porcentajeUsado >= 80 ? '#ff9800' : '#4caf50'
                      }
                    ]} 
                  />
                </View>
                <Text style={[
                  styles.resumenPorcentaje,
                  { color: item.excedido ? '#d32f2f' : item.porcentajeUsado >= 80 ? '#ff9800' : '#666' }
                ]}>
                  {item.porcentajeUsado?.toFixed(0)}% usado
                </Text>
                {item.excedido && (
                  <View style={styles.alertaBadge}>
                    <Ionicons name="warning" size={16} color="#d32f2f" />
                    <Text style={styles.alertaTexto}>¡Presupuesto excedido!</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        <Text style={styles.listaTitulo}>Mis Presupuestos</Text>
        
        {loading && presupuestos.length === 0 ? (
          <ActivityIndicator size="large" color="#1D617A" style={{ marginTop: 20 }} />
        ) : presupuestos.length === 0 ? (
          <Text style={styles.emptyText}>No tienes presupuestos registrados</Text>
        ) : (
          presupuestos
            .filter(item => !categoriaFiltro || item.categoria === categoriaFiltro)
            .sort((a, b) => {
              const fechaA = new Date(a.anio, a.mes || 0);
              const fechaB = new Date(b.anio, b.mes || 0);
              return ordenFecha === 'reciente' ? fechaB - fechaA : fechaA - fechaB;
            })
            .map((item) => (
            <View key={item.id} style={styles.presupuestoCard}>
              <View style={styles.presupuestoInfo}>
                <Text style={styles.presupuestoCategoria}>{item.categoria}</Text>
                <Text style={styles.presupuestoMonto}>$ {item.monto.toFixed(2)}</Text>
                <Text style={styles.presupuestoPeriodo}>
                  {item.periodo === 'MENSUAL' ? `${meses[item.mes - 1]} ${item.anio}` : `Anual ${item.anio}`}
                </Text>
              </View>
              <View style={styles.presupuestoAcciones}>
                <TouchableOpacity onPress={() => abrirModal(item)} style={styles.btnEditar}>
                  <Text style={styles.btnEditarText}>✎</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleEliminar(item.id)} style={styles.btnEliminar}>
                  <Text style={styles.btnEliminarText}>✕</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}

        <TouchableOpacity style={styles.btnAgregar} onPress={() => abrirModal()}>
          <Text style={styles.btnAgregarText}>+ Agregar Presupuesto</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={cerrarModal}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.modalContainer}>
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitulo}>
              {editando ? 'Editar Presupuesto' : 'Nuevo Presupuesto'}
            </Text>

            <Text style={styles.labelInput}>Categoría</Text>
            <TouchableOpacity 
              style={styles.categoriaButton}
              onPress={() => setModalCategoriaVisible(true)}
            >
              <Text style={categoria ? styles.categoriaButtonTextSelected : styles.categoriaButtonText}>
                {categoria || 'Selecciona una categoría'}
              </Text>
              <Ionicons name="chevron-down" size={20} color={categoria ? "#000" : "#999"} />
            </TouchableOpacity>

            <Text style={styles.labelInput}>Monto del Presupuesto</Text>
            <TextInput
              style={styles.input}
              placeholder="0.00"
              value={monto}
              onChangeText={setMonto}
              keyboardType="decimal-pad"
            />

            <Text style={styles.labelInput}>Período</Text>

            <View style={styles.periodoContainer}>
              <TouchableOpacity
                style={[styles.periodoBtn, periodo === 'MENSUAL' && styles.periodoBtnActive]}
                onPress={() => setPeriodo('MENSUAL')}
              >
                <Text style={[styles.periodoBtnText, periodo === 'MENSUAL' && styles.periodoBtnTextActive]}>
                  Mensual
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.periodoBtn, periodo === 'ANUAL' && styles.periodoBtnActive]}
                onPress={() => setPeriodo('ANUAL')}
              >
                <Text style={[styles.periodoBtnText, periodo === 'ANUAL' && styles.periodoBtnTextActive]}>
                  Anual
                </Text>
              </TouchableOpacity>
            </View>

            {periodo === 'MENSUAL' && (
              <>
                <Text style={styles.labelInput}>Fecha del Presupuesto</Text>
                <View style={styles.fechaContainer}>
                  <View style={{ flex: 1, marginRight: 10 }}>
                    <Text style={styles.subLabelInput}>Mes</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="1-12"
                      value={mes.toString()}
                      onChangeText={(text) => setMes(parseInt(text) || 1)}
                      keyboardType="number-pad"
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.subLabelInput}>Año</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="2025"
                      value={anio.toString()}
                      onChangeText={(text) => setAnio(parseInt(text) || new Date().getFullYear())}
                      keyboardType="number-pad"
                    />
                  </View>
                </View>
              </>
            )}

            {periodo === 'ANUAL' && (
              <>
                <Text style={styles.labelInput}>Año del Presupuesto</Text>
                <TextInput
                  style={styles.input}
                  placeholder="2025"
                  value={anio.toString()}
                  onChangeText={(text) => setAnio(parseInt(text) || new Date().getFullYear())}
                  keyboardType="number-pad"
                />
              </>
            )}

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.btnCancelar} onPress={cerrarModal}>
                <Text style={styles.btnCancelarText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnGuardar} onPress={guardarPresupuesto} disabled={loading}>
                {loading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.btnGuardarText}>Guardar</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
          </TouchableWithoutFeedback>

          {/* Modal anidado para seleccionar categoría */}
          {modalCategoriaVisible && (
            <View style={styles.modalOverlayNested}>
              <TouchableOpacity 
                style={styles.modalOverlay}
                activeOpacity={1}
                onPress={() => setModalCategoriaVisible(false)}
              >
                <TouchableOpacity 
                  activeOpacity={1} 
                  onPress={(e) => e.stopPropagation()}
                >
                  <View style={styles.modalContentCategoria}>
                    <Text style={styles.modalTituloCategoria}>Selecciona una categoría</Text>
                    <FlatList
                      data={CATEGORIAS}
                      keyExtractor={(item) => item}
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          style={styles.categoriaItem}
                          onPress={() => {
                            setCategoria(item);
                            setModalCategoriaVisible(false);
                          }}
                        >
                          <Text style={styles.categoriaItemText}>{item}</Text>
                          {categoria === item && (
                            <Ionicons name="checkmark" size={24} color="#4c79e3" />
                          )}
                        </TouchableOpacity>
                      )}
                    />
                  </View>
                </TouchableOpacity>
              </TouchableOpacity>
            </View>
          )}
        </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Modal de Filtros */}
      <Modal
        visible={mostrarFiltros}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setMostrarFiltros(false)}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.modalContainerFiltro}>
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
          <View style={styles.modalContentFiltro}>
            <Text style={styles.modalTituloFiltro}>Filtrar Presupuestos</Text>
            
            <Text style={styles.labelInput}>Ordenar por Fecha:</Text>
            <View style={{flexDirection: 'row', gap: 10, marginBottom: 15}}>
              <TouchableOpacity 
                style={[styles.filtroBtn, ordenFecha === 'reciente' && styles.filtroBtnActivo]}
                onPress={() => setOrdenFecha('reciente')}
              >
                <Text style={[styles.filtroBtnText, ordenFecha === 'reciente' && styles.filtroBtnTextActivo]}>Más Reciente</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.filtroBtn, ordenFecha === 'antiguo' && styles.filtroBtnActivo]}
                onPress={() => setOrdenFecha('antiguo')}
              >
                <Text style={[styles.filtroBtnText, ordenFecha === 'antiguo' && styles.filtroBtnTextActivo]}>Más Antiguo</Text>
              </TouchableOpacity>
            </View>
            
            <Text style={styles.labelInput}>Categoría:</Text>
            <TouchableOpacity 
              style={styles.categoriaButton}
              onPress={() => setModalCategoriaFiltroVisible(true)}
            >
              <Text style={categoriaFiltro ? styles.categoriaButtonTextSelected : styles.categoriaButtonText}>
                {categoriaFiltro || 'Todas las categorías'}
              </Text>
              <Ionicons name="chevron-down" size={20} color={categoriaFiltro ? "#000" : "#999"} />
            </TouchableOpacity>

            <View style={{flexDirection: 'row', gap: 10, marginTop: 20}}>
              <TouchableOpacity 
                style={styles.btnFiltroAplicar} 
                onPress={() => setMostrarFiltros(false)}
              >
                <Text style={styles.btnFiltroText}>Aplicar</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.btnFiltroLimpiar} 
                onPress={() => {
                  setCategoriaFiltro('');
                  setOrdenFecha('reciente');
                  setMostrarFiltros(false);
                }}
              >
                <Text style={styles.btnFiltroText}>Limpiar</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.btnFiltroCerrar} 
                onPress={() => setMostrarFiltros(false)}
              >
                <Text style={styles.btnFiltroText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
          </TouchableWithoutFeedback>

          {/* Modal anidado para seleccionar categoría de filtro */}
          {modalCategoriaFiltroVisible && (
            <View style={styles.modalOverlayNested}>
              <TouchableOpacity 
                style={styles.modalOverlay}
                activeOpacity={1}
                onPress={() => setModalCategoriaFiltroVisible(false)}
              >
                <TouchableOpacity 
                  activeOpacity={1} 
                  onPress={(e) => e.stopPropagation()}
                >
                  <View style={styles.modalContentCategoria}>
                    <Text style={styles.modalTituloCategoria}>Selecciona una categoría</Text>
                    <FlatList
                      data={[{label: 'Todas las categorías', value: ''}, ...CATEGORIAS.map(cat => ({label: cat, value: cat}))]}
                      keyExtractor={(item) => item.value || 'todas'}
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          style={styles.categoriaItem}
                          onPress={() => {
                            setCategoriaFiltro(item.value);
                            setModalCategoriaFiltroVisible(false);
                          }}
                        >
                          <Text style={styles.categoriaItemText}>{item.label}</Text>
                          {categoriaFiltro === item.value && (
                            <Ionicons name="checkmark" size={24} color="#1D617A" />
                          )}
                        </TouchableOpacity>
                      )}
                    />
                  </View>
                </TouchableOpacity>
              </TouchableOpacity>
            </View>
          )}
        </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { backgroundColor: '#1D617A', paddingTop: 50, paddingBottom: 20, paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  logoButton: { padding: 5 },
  logoIcon: { width: 35, height: 35, resizeMode: 'contain' },
  backButton: { padding: 5 },
  backArrow: { fontSize: 28, color: 'white', fontWeight: 'bold' },
  titulo: { fontSize: 20, fontWeight: 'bold', color: 'white', flex: 1, textAlign: 'center' },
  headerButtons: { flexDirection: 'row', gap: 10 },
  reloadButton: { padding: 5 },
  filterButton: { padding: 5 },
  menuButton: { padding: 5 },
  menuIcon: { fontSize: 24, color: 'white' },
  content: { flex: 1, padding: 20 },
  resumenContainer: { backgroundColor: 'white', borderRadius: 10, padding: 15, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  resumenTitulo: { fontSize: 18, fontWeight: 'bold', color: '#1D617A', marginBottom: 15 },
  resumenItem: { marginBottom: 15 },
  resumenCategoria: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 5 },
  resumenPeriodoBadge: { 
    fontSize: 11, 
    fontWeight: '600', 
    color: '#1D617A', 
    backgroundColor: '#e3f2fd', 
    paddingHorizontal: 8, 
    paddingVertical: 3, 
    borderRadius: 10 
  },
  resumenDetalle: { fontSize: 14, color: '#666', marginBottom: 5 },
  progressBar: { height: 8, backgroundColor: '#e0e0e0', borderRadius: 4, overflow: 'hidden', marginBottom: 5 },
  progressFill: { height: '100%' },
  resumenPorcentaje: { fontSize: 12, fontWeight: '600' },
  alertaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffebee',
    padding: 8,
    borderRadius: 5,
    marginTop: 5,
    gap: 5,
  },
  alertaTexto: {
    fontSize: 12,
    fontWeight: '600',
    color: '#d32f2f',
  },
  listaTitulo: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 15 },
  emptyText: { textAlign: 'center', color: '#999', fontSize: 16, marginTop: 20 },
  presupuestoCard: { backgroundColor: 'white', borderRadius: 10, padding: 15, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
  presupuestoInfo: { flex: 1 },
  presupuestoCategoria: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  presupuestoMonto: { fontSize: 18, color: '#1D617A', fontWeight: '600', marginTop: 5 },
  presupuestoPeriodo: { fontSize: 12, color: '#999', marginTop: 3 },
  presupuestoAcciones: { flexDirection: 'row', gap: 10 },
  btnEditar: { backgroundColor: '#4caf50', width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  btnEditarText: { color: 'white', fontSize: 20 },
  btnEliminar: { backgroundColor: '#f44336', width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  btnEliminarText: { color: 'white', fontSize: 20 },
  btnAgregar: { backgroundColor: '#1D617A', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 20, marginBottom: 30 },
  btnAgregarText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { backgroundColor: 'white', borderRadius: 10, padding: 20, width: '90%', maxWidth: 400 },
  modalTitulo: { fontSize: 20, fontWeight: 'bold', color: '#1D617A', marginBottom: 20, textAlign: 'center' },
  labelInput: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8 },
  subLabelInput: { fontSize: 12, fontWeight: '500', color: '#666', marginBottom: 5 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginBottom: 15, fontSize: 16, backgroundColor: '#f9f9f9' },
  categoriaButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  categoriaButtonText: {
    fontSize: 16,
    color: '#999',
  },
  categoriaButtonTextSelected: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlayNested: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContentCategoria: {
    width: '80%',
    maxHeight: '60%',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTituloCategoria: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#1D617A',
    textAlign: 'center',
  },
  categoriaItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  categoriaItemText: {
    fontSize: 16,
    color: '#000',
  },
  periodoContainer: { flexDirection: 'row', gap: 10, marginBottom: 15 },
  periodoBtn: { flex: 1, padding: 12, borderWidth: 1, borderColor: '#1D617A', borderRadius: 8, alignItems: 'center' },
  periodoBtnActive: { backgroundColor: '#1D617A' },
  periodoBtnText: { color: '#1D617A', fontSize: 14, fontWeight: '600' },
  periodoBtnTextActive: { color: 'white' },
  fechaContainer: { flexDirection: 'row' },
  modalButtons: { flexDirection: 'row', gap: 10, marginTop: 10 },
  btnCancelar: { flex: 1, padding: 12, borderWidth: 1, borderColor: '#999', borderRadius: 8, alignItems: 'center' },
  btnCancelarText: { color: '#666', fontSize: 16 },
  btnGuardar: { flex: 1, padding: 12, backgroundColor: '#1D617A', borderRadius: 8, alignItems: 'center' },
  btnGuardarText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  modalContainerFiltro: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContentFiltro: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    width: '85%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTituloFiltro: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1D617A',
    marginBottom: 20,
    textAlign: 'center',
  },
  btnFiltroAplicar: {
    flex: 1,
    backgroundColor: '#1D617A',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnFiltroLimpiar: {
    flex: 1,
    backgroundColor: '#7bdcb5',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnFiltroCerrar: {
    flex: 1,
    backgroundColor: '#999',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnFiltroText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  filtroBtn: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#1D617A',
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  filtroBtnActivo: {
    backgroundColor: '#1D617A',
  },
  filtroBtnText: {
    color: '#1D617A',
    fontSize: 14,
    fontWeight: '600',
  },
  filtroBtnTextActivo: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
