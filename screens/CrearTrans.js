import { Text, StyleSheet, View, ImageBackground, Pressable, TextInput, Image, TouchableOpacity, Alert, ActivityIndicator} from 'react-native'
import React, { useState, useEffect } from 'react'
import { crearTransaccion } from '../services/transactionService';
import { initDatabase } from '../services/database';

export default function CrearTrans({ volver, usuarioId, onTransaccionCreada, navigation, route }) {
  const [monto, setMonto]=useState('');
  const [categoria, setCategoria]=useState('');
  const [descripcion, setDescripcion]=useState('');
  const [tipo, setTipo] = useState('GASTO');
  const [loading, setLoading] = useState(false);

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
                
                    <TextInput
                        style={styles.input}
                        placeholder='Escribe la categoria aqui'
                        value={categoria}
                        onChangeText={setCategoria}
                    />
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

            </View>
        </ImageBackground>
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
        width: '50%',
        borderWidth:2,
        borderColor:'#d0d0d0ff',
        borderRadius:8,
        padding:10,
        marginBottom:10,
        backgroundColor: '#f1eeeeff',
        width: '100%',
        alignItems: 'center',
        alignContent: 'center', 
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
    backButton: { marginRight: 10 },
    backArrow: { fontSize: 30, color: 'white', fontWeight: 'bold' },
})
