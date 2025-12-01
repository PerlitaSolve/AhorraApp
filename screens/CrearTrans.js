import { Text, StyleSheet, View, ImageBackground, Pressable, TextInput, Image, TouchableOpacity, Alert, ActivityIndicator, Modal, FlatList, Keyboard, TouchableWithoutFeedback} from 'react-native'
import React, { useState, useEffect } from 'react'
import { Ionicons } from '@expo/vector-icons';
import { crearTransaccion } from '../services/transactionService';
import { initDatabase } from '../services/database';

const CATEGORIAS = ['Alimentacion', 'Educacion', 'Transporte', 'Servicios', 'Salud', 'Otros'];

export default function CrearTrans({ volver, usuarioId, onTransaccionCreada, navigation, route, navegation }) {
  const [monto, setMonto]=useState('');
  const [categoria, setCategoria]=useState('');
  const [descripcion, setDescripcion]=useState('');
  const [tipo, setTipo] = useState('GASTO');
  const [loading, setLoading] = useState(false);
  const [modalCategoriaVisible, setModalCategoriaVisible] = useState(false);

  // Obtener usuarioId y tipo del contexto o parámetros de navegación
  const { useUser } = require('../context/UserContext');
  const { usuario } = useUser();
  const actualUsuarioId = usuarioId || usuario?.id;
  const tipoInicial = route?.params?.tipo || 'GASTO';

  useEffect(() => {
    initDatabase();
    if (tipoInicial) {
      setTipo(tipoInicial);
    }
  }, []);

  const agregarTransaccion = async () => {
    if (!monto || !categoria) {
      Alert.alert('Error', 'El monto y la categoría son obligatorios');
      return;
    }

    if (isNaN(monto) || parseFloat(monto) <= 0) {
      Alert.alert('Error', 'El monto debe ser un número válido mayor a 0');
      return;
    }

    if (!actualUsuarioId) {
      Alert.alert('Error', 'Debes iniciar sesión para crear transacciones');
      return;
    }

    setLoading(true);

    try {
      const resultado = await crearTransaccion(
        actualUsuarioId,
        tipo,
        monto,
        categoria,
        descripcion
      );

      if (resultado.success) {
        // Si hay alerta de presupuesto, mostrarla primero
        if (resultado.alertaPresupuesto) {
          Alert.alert('⚠️ Alerta de Presupuesto', resultado.alertaPresupuesto, [
            { 
              text: 'Entendido', 
              onPress: () => {
                // Limpiar campos
                setMonto('');
                setCategoria('');
                setDescripcion('');
                setTipo('GASTO');
                
                // Notificar que se creó la transacción
                if (onTransaccionCreada) {
                  onTransaccionCreada();
                }
                
                // Volver a la pantalla anterior
                if (navigation?.goBack) {
                  navigation.goBack();
                } else if (volver) {
                  volver();
                }
              }
            }
          ]);
        } else {
          Alert.alert('Éxito', 'Transacción creada correctamente');
          // Limpiar campos
          setMonto('');
          setCategoria('');
          setDescripcion('');
          setTipo('GASTO');
          
          // Notificar que se creó la transacción
          if (onTransaccionCreada) {
            onTransaccionCreada();
          }
          
          // Volver a la pantalla anterior
          if (navigation?.goBack) {
            navigation.goBack();
          } else if (volver) {
            volver();
          }
        }
      } else {
        Alert.alert('Error', resultado.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Ocurrió un error al crear la transacción');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ImageBackground style={styles.background} source={require('../assets/FCrear.png')}>
            <View style={styles.container}>
                <View style={styles.nombrecontainer}>
                    {volver && (
                      <TouchableOpacity onPress={volver} style={styles.backButton}>
                        <Text style={styles.backArrow}>←</Text>
                      </TouchableOpacity>
                    )}
                    <Image source={require('../assets/L-SFon.png')} style={styles.logo}/>
                    <Text style={styles.nombre}>AHORRA + APP</Text>
                    <TouchableOpacity style={styles.menuButton}>
                        <Text style={styles.menuIcon}>☰</Text>
                    </TouchableOpacity>
                </View>
                    <Text style={styles.titulo}>NUEVA TRANSACCIÓN</Text>
                
                <View>
                    <Text style={styles.subtitulos}>  Tipo de Movimiento</Text>

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

                    <Text style={styles.subtitulos}>Cantidad</Text>
                    <TextInput
                        style={styles.input}
                        placeholder='$Monto'
                        value={monto}
                        onChangeText={setMonto}
                        keyboardType='numeric'
                    />
                    <Text style={styles.subtitulos}>Categoria</Text>
                
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
                        placeholder='Escribe aquí'
                        value={descripcion}
                        onChangeText={setDescripcion}
                    />

                    {loading ? (
                        <ActivityIndicator size="large" color="#fff" style={{marginTop: 20}} />
                    ) : (
                        <View>
                        <Pressable 
                        style={styles.boton} 
                        onPress={agregarTransaccion}>
                            <Text style={styles.botonTexto}>Añadir</Text>
                        </Pressable>
                        </View>
                    )}
                </View>

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
        color: '#ffffffff',
    },
    titulo: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 8,
        fontFamily:'Italic',
        color: '#ffffffff',
    },
    botones:{
        flexDirection: 'row',
        borderRadius: 25,
        padding: 10,
        marginTop:20,
        gap: 15,

    },
    nombrecontainer:{
        fontSize: 24,
        fontWeight: 'bold',
        fontFamily:'Italic',
        color: '#ffffffff',
        flexDirection: 'row',
        marginBottom:10,
        marginTop:20,
        padding: 10,
        gap:15,
    },
    logo:{
        width:80, 
        height:80, 
        marginBottom:10,
        flexDirection: 'row',
    },
    subtitulos:{
        color: '#fff',
        fontFamily:'Italic',
    },
    input:{
        width: 280,
        height: 55,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        paddingHorizontal: 10,
        marginVertical:10,
        backgroundColor: '#f1eeeeff',
        alignItems: 'center',
        alignContent: 'center', 
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
    boton:{
        marginTop: 20,
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
    },
    menuIcon: {
        fontSize: 28,
        color: 'white',
        fontWeight: 'bold',
    },
    tipoBtn: {
        flex: 1,
        borderRadius: 10,
        marginHorizontal: 1,
        marginVertical: 5,
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
    backButton: { marginRight: 10 },
    backArrow: { fontSize: 30, color: 'white', fontWeight: 'bold' },
})
