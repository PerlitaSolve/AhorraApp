import { StyleSheet, Text, View, FlatList, Button, ImageBackground, Image, Alert } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'



export default function Transacciones() {
    const mov = [
        { id: '1', fecha: '27 de Septiembre', descripcion: 'Pago de Transporte', monto: -50, categoria: 'Transporte' },
        { id: '2', fecha: '23 de Septiembre', descripcion: 'Consulta Médica', monto: -150, categoria: 'Salud' },
        { id: '3', fecha: '15 de Septiembre', descripcion: 'Renta del Cuarto', monto: +1200, categoria: 'Renta' },
        { id: '4', fecha: '15 de Septiembre', descripcion: 'Colegio', monto: -5000, categoria: 'Educación' },
        { id: '5', fecha: '01 de Septiembre', descripcion: 'Pago de Netflix', monto: -220, categoria: 'Servicios' },
        { id: '6', fecha: '26 de Agosto', descripcion: 'Salario', monto: +7200, categoria: 'Salario' },
    ];   

    const alertaEliminar = () => {
        Alert.alert(
            "Confirmación",
            "¿Estás seguro de que deseas eliminar este movimiento?\nEsta acción podría ser irreversible.",
            [
                { text: "Cancelar", style: "cancel" },
                { text: "Aceptar", onPress: () => Alert.alert("Movimiento eliminado") }
            ]
        );
    };

    

    const ent = ({ item }) => (
        <View style={styles.overlay}>
            <View style={{ flex: 1 }}>
                <Text style={styles.fecha}>{item.fecha}</Text>
                <Text style={styles.descripcion}>{item.descripcion}</Text>
            </View>

            <View style={styles.montoContainer}>
                <Text style={[styles.monto, { color: item.monto >= 0 ? '#007f5f' : '#d62828' }]}>
                    {item.monto >= 0 ? '+' : '-'}${Math.abs(item.monto).toFixed(2)}
                </Text>
                <Text style={styles.categoria}>{item.categoria}</Text>
            </View>

            <View style={styles.iconos}>
                <Ionicons name="create-outline" size={18} color="#007aff" style={{ marginRight: 8 }} />
                <Ionicons name="trash-outline" size={18} color="#007aff" onPress={alertaEliminar} />
            </View>
        </View>
    );
    

    return (
        <ImageBackground style={styles.background} source={require('../assets/FTrans.png')}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Image source={require('../assets/L-SFon.png')} style={styles.logo}/>
                    <Text style={styles.nombre}>AHORRA + APP</Text>
                    
                    
                    <Text style={styles.titulo}>TRANSACCIONES</Text>
                    <Button style={styles.boton} color='#4c79e3ce' title="Añadir +" onPress={() => {}} />
                </View>

                <View style={styles.listContainer}>
                    <View style={styles.overlay2}>
                        <Text style={styles.subtitulo}>ÚLTIMOS MOVIMIENTOS</Text>
                        <FlatList
                            data={mov}
                            renderItem={ent}
                            keyExtractor={item => item.id}
                        />
                    </View>

                    <View style={styles.botonContainer}>
                        <Button color='#4c79e3ce' title="Ver todo" onPress={() => {}} />
                    </View>
                </View>
            </View>
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
    logo: {
        width: 80, 
        height: 80, 
        marginBottom: 10,
    },
});
