import { StyleSheet, Text, View, FlatList, Pressable, ImageBackground, Image, Alert, TouchableOpacity, ActivityIndicator, TextInput, Modal } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { obtenerTransacciones, eliminarTransaccion, obtenerTransaccionesFiltradas, obtenerCategorias } from '../services/transactionService'
import { initDatabase } from '../services/database'
import CrearTrans from './CrearTrans'
import EditarTrans from './EditarTrans'



export default function Transacciones({ volver, usuarioId, onEditarTransaccion, navigation }) {
    const [transacciones, setTransacciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [mostrarCrear, setMostrarCrear] = useState(false);
    const [mostrarEditar, setMostrarEditar] = useState(false);
    const [transaccionEditando, setTransaccionEditando] = useState(null);
    const [mostrarFiltros, setMostrarFiltros] = useState(false);
    const [categorias, setCategorias] = useState([]);
    const [filtros, setFiltros] = useState({
        categoria: '',
        fechaInicio: '',
        fechaFin: '',
        tipo: ''
    });

    useEffect(() => {
        initDatabase();
        cargarTransacciones();
        cargarCategorias();
    }, []);

    const cargarTransacciones = async () => {
        if (!usuarioId) {
            Alert.alert('Error', 'Debes iniciar sesión');
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const resultado = await obtenerTransacciones(usuarioId);
            if (resultado.success) {
                setTransacciones(resultado.transacciones);
            } else {
                Alert.alert('Error', resultado.message);
            }
        } catch (error) {
            Alert.alert('Error', 'No se pudieron cargar las transacciones');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const cargarCategorias = async () => {
        if (!usuarioId) return;
        
        try {
            const resultado = await obtenerCategorias(usuarioId);
            if (resultado.success) {
                setCategorias(resultado.categorias);
            }
        } catch (error) {
            console.error('Error al cargar categorías:', error);
        }
    };

    const aplicarFiltros = async () => {
        if (!usuarioId) return;

        setLoading(true);
        try {
            const filtrosLimpios = {};
            if (filtros.categoria) filtrosLimpios.categoria = filtros.categoria;
            if (filtros.tipo) filtrosLimpios.tipo = filtros.tipo;
            if (filtros.fechaInicio) filtrosLimpios.fechaInicio = filtros.fechaInicio;
            if (filtros.fechaFin) filtrosLimpios.fechaFin = filtros.fechaFin;

            const resultado = await obtenerTransaccionesFiltradas(usuarioId, filtrosLimpios);
            if (resultado.success) {
                setTransacciones(resultado.transacciones);
                setMostrarFiltros(false);
            } else {
                Alert.alert('Error', resultado.message);
            }
        } catch (error) {
            Alert.alert('Error', 'No se pudieron aplicar los filtros');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const limpiarFiltros = () => {
        setFiltros({
            categoria: '',
            fechaInicio: '',
            fechaFin: '',
            tipo: ''
        });
        cargarTransacciones();
    };

    const alertaEliminar = (transaccionId) => {
        Alert.alert(
            "Confirmación",
            "¿Estás seguro de que deseas eliminar esta transacción?",
            [
                { text: "Cancelar", style: "cancel" },
                { text: "Eliminar", onPress: () => eliminarTransaccionHandler(transaccionId), style: "destructive" }
            ]
        );
    };

    const eliminarTransaccionHandler = async (transaccionId) => {
        try {
            const resultado = await eliminarTransaccion(transaccionId, usuarioId);
            if (resultado.success) {
                Alert.alert('Éxito', 'Transacción eliminada');
                cargarTransacciones();
            } else {
                Alert.alert('Error', resultado.message);
            }
        } catch (error) {
            Alert.alert('Error', 'No se pudo eliminar la transacción');
            console.error(error);
        }
    };

    const editarTransaccionHandler = (transaccion) => {
        setTransaccionEditando(transaccion);
        setMostrarEditar(true);
    };

    const formatearFecha = (fecha) => {
        const date = new Date(fecha);
        const opciones = { day: 'numeric', month: 'long', year: 'numeric' };
        return date.toLocaleDateString('es-ES', opciones);
    };

    const ent = ({ item }) => {
        const esIngreso = item.tipo === 'INGRESO';
        return (
            <View style={styles.overlay}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.fecha}>{formatearFecha(item.fecha)}</Text>
                    <Text style={styles.descripcion}>{item.descripcion || 'Sin descripción'}</Text>
                </View>

                <View style={styles.montoContainer}>
                    <Text style={[styles.monto, { color: esIngreso ? '#007f5f' : '#d62828' }]}>
                        {esIngreso ? '+' : '-'}${Math.abs(item.monto).toFixed(2)}
                    </Text>
                    <Text style={styles.categoria}>{item.categoria}</Text>
                </View>

                <View style={styles.iconos}>
                    <TouchableOpacity onPress={() => editarTransaccionHandler(item)}>
                        <Ionicons name="create-outline" size={18} color="#007aff" style={{ marginRight: 8 }} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => alertaEliminar(item.id)}>
                        <Ionicons name="trash-outline" size={18} color="#007aff" />
                    </TouchableOpacity>
                </View>
            </View>
        );
    };
    
    if (mostrarCrear) {
        return (
            <CrearTrans 
                volver={() => {
                    setMostrarCrear(false);
                    cargarTransacciones();
                }} 
                usuarioId={usuarioId}
                onTransaccionCreada={cargarTransacciones}
            />
        );
    }

    if (mostrarEditar && transaccionEditando) {
        return (
            <EditarTrans 
                volver={() => {
                    setMostrarEditar(false);
                    setTransaccionEditando(null);
                    cargarTransacciones();
                }} 
                usuarioId={usuarioId}
                transaccion={transaccionEditando}
                onTransaccionEditada={cargarTransacciones}
            />
        );
    }

    return (
        <ImageBackground style={styles.background} source={require('../assets/FTrans.png')}>
            <View style={styles.container}>
                {volver && (
                  <TouchableOpacity onPress={volver} style={styles.backButton}>
                    <Text style={styles.backArrow}>←</Text>
                  </TouchableOpacity>
                )}
                <View style={styles.header}>
                    <Image source={require('../assets/L-SFon.png')} style={styles.logo}/>
                    <Text style={styles.nombre}>AHORRA + APP</Text>
                    
                    <Text style={styles.titulo}>TRANSACCIONES</Text>
                    
                    <View style={{flexDirection: 'row', gap: 10}}>
                        <Pressable style={styles.botonAnadir} onPress={() => setMostrarCrear(true)}>
                            <Text style={styles.botonTexto}>Añadir +</Text>
                        </Pressable>
                        <Pressable style={styles.botonFiltros} onPress={() => setMostrarFiltros(true)}>
                            <Text style={styles.botonTexto}>Filtros</Text>
                        </Pressable>
                    </View>
                </View>

                <View style={styles.listContainer}>
                    <View style={styles.overlay2}>
                        <Text style={styles.subtitulo}>TRANSACCIONES ({transacciones.length})</Text>
                        
                        {loading ? (
                            <ActivityIndicator size="large" color="#4aa1d2ff" style={{marginTop: 20}} />
                        ) : transacciones.length === 0 ? (
                            <Text style={{textAlign: 'center', marginTop: 20, color: '#555'}}>
                                No hay transacciones registradas
                            </Text>
                        ) : (
                            <FlatList
                                data={transacciones}
                                renderItem={ent}
                                keyExtractor={item => item.id.toString()}
                            />
                        )}
                    </View>

                    <View style={styles.botonContainer}>
                        <Pressable style={styles.botonRecargar} onPress={cargarTransacciones}>
                            <Text style={styles.botonTexto}>Recargar</Text>
                        </Pressable>
                    </View>
                </View>
            </View>

            {/* Modal de Filtros */}
            <Modal
                visible={mostrarFiltros}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setMostrarFiltros(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitulo}>Filtros de Transacciones</Text>
                        
                        <Text style={styles.labelFiltro}>Tipo:</Text>
                        <View style={{flexDirection: 'row', gap: 10, marginBottom: 15}}>
                            <TouchableOpacity 
                                style={[styles.filtroBtn, filtros.tipo === 'INGRESO' && styles.filtroBtnActivo]}
                                onPress={() => setFiltros({...filtros, tipo: filtros.tipo === 'INGRESO' ? '' : 'INGRESO'})}
                            >
                                <Text>INGRESO</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={[styles.filtroBtn, filtros.tipo === 'GASTO' && styles.filtroBtnActivo]}
                                onPress={() => setFiltros({...filtros, tipo: filtros.tipo === 'GASTO' ? '' : 'GASTO'})}
                            >
                                <Text>GASTO</Text>
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.labelFiltro}>Categoría:</Text>
                        <TextInput
                            style={styles.inputFiltro}
                            placeholder="Categoría"
                            value={filtros.categoria}
                            onChangeText={(text) => setFiltros({...filtros, categoria: text})}
                        />

                        <Text style={styles.labelFiltro}>Fecha Inicio (YYYY-MM-DD):</Text>
                        <TextInput
                            style={styles.inputFiltro}
                            placeholder="2024-01-01"
                            value={filtros.fechaInicio}
                            onChangeText={(text) => setFiltros({...filtros, fechaInicio: text})}
                        />

                        <Text style={styles.labelFiltro}>Fecha Fin (YYYY-MM-DD):</Text>
                        <TextInput
                            style={styles.inputFiltro}
                            placeholder="2024-12-31"
                            value={filtros.fechaFin}
                            onChangeText={(text) => setFiltros({...filtros, fechaFin: text})}
                        />

                        <View style={{flexDirection: 'row', gap: 10, marginTop: 20}}>
                            <Pressable style={styles.botonModalAplicar} onPress={aplicarFiltros}>
                                <Text style={styles.botonModalTexto}>Aplicar</Text>
                            </Pressable>
                            <Pressable style={styles.botonModalLimpiar} onPress={limpiarFiltros}>
                                <Text style={styles.botonModalTexto}>Limpiar</Text>
                            </Pressable>
                            <Pressable style={styles.botonModalCerrar} onPress={() => setMostrarFiltros(false)}>
                                <Text style={styles.botonModalTexto}>Cerrar</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
        </ImageBackground>
    );
}

export const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    container: {
        flex: 1,
        padding: 16,
        alignContent: 'center',
        alignItems: 'center',
    },
    fecha: {
        fontSize: 14,
        color: '#000',
        fontFamily: 'Italic',
    },
    descripcion: {  
        fontSize: 14,
        color: '#000',
        fontFamily: 'Italic',
    },
    montoContainer: {
        alignItems: 'flex-end',
    },
    monto: {
        fontSize: 16,
        fontWeight: 'bold',     
        fontFamily: 'Italic',
    },
    categoria: {
        fontSize: 12,
        color: '#555',
        fontFamily: 'Italic',
    },
    iconos: {
        flexDirection: 'row',       
    },
    overlay: {
        backgroundColor: 'rgba(204, 203, 203, 0.66)',
        padding: 10,
        gap: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
        borderRadius: 8,
    },
    overlay2: {
        backgroundColor: 'rgba(255, 255, 255, 0.91)',
        padding: 10,
        gap: 5,
        marginBottom: 10,
        borderRadius: 8,
    },
    header: {
        marginBottom: 16,
        alignItems: 'center',
    },
    nombre: {
        fontSize: 24,
        fontWeight: 'bold',
        fontFamily: 'Italic',
        color: '#fff',
    },
    titulo: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 8,
        fontFamily: 'Italic',
        color: '#fff',
    },
    boton: {
        backgroundColor: '#539ceaff',
        borderRadius: 25,
        padding: 10,
        alignItems: 'center',
    },
    listContainer: {
        flex: 1,
        width: '80%',
    },
    subtitulo: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#4aa1d2ff',
        textAlign: 'center',
        fontFamily: 'Italic',
    },
    botonContainer: {
        marginTop: 10,
        borderRadius: 25,
        overflow: 'hidden',
        gap: 10,
        flexDirection: 'row-reverse',
    },
    backButton: { position: 'absolute', top: 50, left: 20, zIndex: 10 },
    backArrow: { fontSize: 30, color: 'white', fontWeight: 'bold' },
    logo: {
        width: 80, 
        height: 80, 
        marginBottom: 10,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'stretch',
    },
    modalTitulo: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#1D617A',
    },
    labelFiltro: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#333',
    },
    inputFiltro: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
        backgroundColor: '#fff',
    },
    filtroBtn: {
        flex: 1,
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ccc',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
    },
    filtroBtnActivo: {
        backgroundColor: '#7bdcb5',
        borderColor: '#7bdcb5',
    },
    botonAnadir: {
        backgroundColor: '#4c79e3ce',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    botonFiltros: {
        backgroundColor: '#7bdcb5',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    botonRecargar: {
        backgroundColor: '#4c79e3ce',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    botonTexto: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    botonModalAplicar: {
        flex: 1,
        backgroundColor: '#4c79e3ce',
        paddingVertical: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    botonModalLimpiar: {
        flex: 1,
        backgroundColor: '#7bdcb5',
        paddingVertical: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    botonModalCerrar: {
        flex: 1,
        backgroundColor: '#999',
        paddingVertical: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    botonModalTexto: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
});
