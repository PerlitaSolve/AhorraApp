import { Text, StyleSheet, View, ImageBackground, Image, Pressable, TextInput, Alert, TouchableOpacity, ActivityIndicator, Modal, FlatList, Keyboard, TouchableWithoutFeedback } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Ionicons } from '@expo/vector-icons';
import { actualizarTransaccion } from '../services/transactionService';
import { initDatabase } from '../services/database';

const CATEGORIAS = ['Alimentacion', 'Educacion', 'Transporte', 'Servicios', 'Salud', 'Otros'];



export default function EditarTrans({ volver, usuarioId, transaccion, onTransaccionEditada, navigation }) {
  const [tipo, setTipo] = useState(transaccion?.tipo || 'GASTO');
  const [monto, setMonto] = useState(transaccion?.monto?.toString() || '');
  const [categoria, setCategoria] = useState(transaccion?.categoria || '');
  const [descripcion, setDescripcion] = useState(transaccion?.descripcion || '');
  const [fecha, setFecha] = useState(transaccion?.fecha || '');
  const [loading, setLoading] = useState(false);
  const [modalCategoriaVisible, setModalCategoriaVisible] = useState(false);

  useEffect(() => {
    initDatabase();
  }, []);

  const formatearFechaParaMostrar = (fechaISO) => {
    if (!fechaISO) return '';
    const date = new Date(fechaISO);
    const dia = date.getDate().toString().padStart(2, '0');
    const mes = (date.getMonth() + 1).toString().padStart(2, '0');
    const anio = date.getFullYear();
    return `${dia}/${mes}/${anio}`;
  };

  const Guardar = async () => {
    if (!monto || !categoria) {
      Alert.alert('Error', 'El monto y la categoría son obligatorios');
      return;
    }

    if (isNaN(monto) || parseFloat(monto) <= 0) {
      Alert.alert('Error', 'El monto debe ser un número válido mayor a 0');
      return;
    }

    if (!usuarioId || !transaccion?.id) {
      Alert.alert('Error', 'No se puede actualizar la transacción');
      return;
    }

    setLoading(true);

    try {
      const resultado = await actualizarTransaccion(
        transaccion.id,
        tipo,
        parseFloat(monto),
        categoria,
        descripcion,
        transaccion.fecha
      );

      if (resultado.success) {
        Alert.alert('Éxito', 'Transacción actualizada correctamente');
        if (onTransaccionEditada) {
          onTransaccionEditada();
        }
        if (volver) {
          volver();
        }
      } else {
        Alert.alert('Error', resultado.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Ocurrió un error al actualizar la transacción');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ImageBackground style={styles.background} source={require('../assets/FEdita.png')}>
        <View style={styles.container}>
            {volver && (
              <TouchableOpacity onPress={volver} style={styles.backButton}>
                <Text style={styles.backArrow}>←</Text>
              </TouchableOpacity>
            )}
            <Image source={require('../assets/L-SFon.png')} style={styles.logo}/>
            <Text style={styles.titulo}>Editar Transacción</Text>
            <Text style={styles.subtitulos}>Fecha</Text>

            <View style={styles.fecha}>
              <TextInput
                style={[styles.input2]}
                placeholder="DD/MM/YYYY"
                placeholderTextColor="#003d4d"
                value={formatearFechaParaMostrar(fecha)}
                editable={false}
              />
              <Ionicons name="calendar-outline" size={24} color="#52b8d5ff" style={styles.iconos} />
            </View>

            <Text style={styles.subtitulos}>Tipo de Movimiento</Text>

            <View style={styles.botones}>
              <TouchableOpacity
                style={[ styles.tipoBtn,
                  { backgroundColor: tipo === 'INGRESO' ? '#7bdcb5' : '#dce5e8' } ]}
                onPress={() => setTipo('INGRESO')}
              >
                <Text style={styles.Texto}>INGRESO</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.tipoBtn,
                  { backgroundColor: tipo === 'GASTO' ? '#7bdcb5' : '#dce5e8' }]}
                onPress={() => setTipo('GASTO')}
              >
                <Text style={styles.Texto}>GASTO</Text>
              </TouchableOpacity>
            </View>
            
            <View/>
            <Text style={styles.subtitulos}>Cantidad</Text>
            <TextInput 
              style={styles.input} 
              placeholder="Monto" 
              keyboardType="numeric"
              value={monto}
              onChangeText={setMonto}
            />

            <Text style={styles.subtitulos}>Categoría</Text>
            <TouchableOpacity 
              style={styles.categoriaButton}
              onPress={() => setModalCategoriaVisible(true)}
            >
              <Text style={categoria ? styles.categoriaButtonTextSelected : styles.categoriaButtonText}>
                {categoria || 'Selecciona una categoría'}
              </Text>
              <Ionicons name="chevron-down" size={20} color={categoria ? "#000" : "#999"} />
            </TouchableOpacity>
            
            <Text style={styles.subtitulos}>Descripción</Text>
            <TextInput 
              style={styles.input} 
              placeholder="Descripción"
              value={descripcion}
              onChangeText={setDescripcion}
            />

            {loading ? (
              <ActivityIndicator size="large" color="#fff" style={{marginTop: 20}} />
            ) : (
              <View style={styles.botones}>
                <Pressable style={styles.boton} onPress={Guardar}>
                    <Text style={styles.botonTexto}>Guardar cambios</Text>
                </Pressable>
              </View>
            )}

            {/* Modal para seleccionar categoría */}
            <Modal
              visible={modalCategoriaVisible}
              transparent={true}
              animationType="fade"
              onRequestClose={() => setModalCategoriaVisible(false)}
            >
              <TouchableOpacity 
                style={styles.modalOverlay}
                activeOpacity={1}
                onPress={() => setModalCategoriaVisible(false)}
              >
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitulo}>Selecciona una categoría</Text>
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
            </Modal>
        </View>
      </ImageBackground>
      </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
  background: {
        flex:1,
        width:'100%',
        height:'100%',
    },
    container: {
        flex: 1,
        padding: 16,
        alignContent:'center',
        alignItems:'center',
    },
     nombre: {  
        fontSize: 24,
        fontWeight: 'bold',
        fontFamily:'Italic',
        color: '#fff',
    },
    iconos: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        
    },
    titulo: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 8,
        fontFamily:'Italic',
        color: '#fff',
    },
    input:{
        width: '50%',
        borderWidth:2,
        borderColor:'#d0d0d0ff',
        borderRadius:8,
        padding:10,
        marginBottom:10,
        backgroundColor: '#f1eeeec1',
        fontFamily:'Italic',
    },
    input2:{
        width: '60%',
        flex: 1,
        borderWidth:2,
        borderColor:'#d0d0d0ff',
        borderRadius:8,
        padding:10,
        marginBottom:10,
        backgroundColor: '#f1eeeec1',
        fontFamily:'Italic',
        alignItems:'center',
        alignContent:'center',
    },
    subtitulos:{
        color: '#fff',
        fontFamily:'Italic',
    },
    logo:{
        width:80, 
        height:80, 
        marginBottom:10,
        flexDirection: 'row',
    },
    botones:{
        flexDirection: 'row',
        padding: 20,
        justifyContent: 'center', 
        alignItems: 'center',    
        gap: 15,

    },
    categoriaButton: {
        width: 280,
        height: 55,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        marginVertical: 10,
        backgroundColor: '#f1eeeeff',
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
    modalContent: {
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
    modalTitulo: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#003d4d',
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
    tipoBtn: {
        flex: 1,
        borderRadius: 8,
        paddingVertical: 5,
        padding: 20,
        marginTop:8,
        width: 120,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    Texto: {
        textAlign: 'center',
        fontSize: 16, 
        fontWeight: 'bold',
        color: '#003d4d',
                 
    },
    backButton: { position: 'absolute', top: 50, left: 20, zIndex: 10 },
    backArrow: { fontSize: 30, color: 'white', fontWeight: 'bold' },
    boton:{
        marginTop: 10,
        backgroundColor: '#4c79e3ce',
        paddingVertical: 14,
        paddingHorizontal: 40,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    botonTexto: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily:'Italic',     
    },
    fecha:{
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom:10,
    },
})