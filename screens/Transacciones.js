import { StyleSheet, Text, View, FlatList, Button, ImageBackground } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'

export default function Transacciones() {
    const mov=[
        {id:'1', fecha: '27 de Septiembre', descripción: 'Pago de Transporte', monto: -50, categoria:'Transporte'},
        {id:'2', fecha: '29 de Septiembre', descripción: 'Consulta Médica', monto: -150, categoria:'Salud'},
    ]   
    const ent=({item})=>(
        <View style={StyleSheet.item}>
            <View style={{flex:1}}>
                <Text style={styles.fecha}>{item.fecha}</Text>
                <Text style={styles.descripción}>{item.descripción}</Text>
            </View>
            <View style={styles.montoContainer}>
                <Text style={[styles.monto, { color: item.monto >= 0 ? '#007f5f' : '#d62828' }]}>
                {item.monto >= 0 ? '+' : '-'}${Math.abs(item.monto).toFixed(2)}
                </Text>
                <Text style={styles.categoria}>{item.categoria}</Text>
            </View>
            <View style={styles.iconos}>
                <Ionicons name="create-outline" size={18} color="#007aff" style={{ marginRight: 8 }} />
                <Ionicons name="trash-outline" size={18} color="#007aff" />
            </View>
        </View>
    )
  return (
    <ImageBackground style={styles.background} source={require('../assets/FTrans.png')}>
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.nombre}>AHORRA + APP</Text>
                <Text style={styles.titulo}>"TRANSACCIONES"</Text>
                <Button style={styles.boton} title="Añadir +" onPress={() => {}} />
            </View>
            <View style={styles.listContainer}>
                <Text style={styles.subtitulo}>ULTIMOS MOVIMIENTOS</Text>
                <FlatList
                    data={mov}
                    renderItem={ent}
                    keyExtractor={item => item.id}
                />
                </View>
                <View style={styles.botonContainer}>
                    <Button title="Ver todo" onPress={() => {}} />
                </View>
            </View>
    </ImageBackground>
    );
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
    fecha: {
        fontSize: 14,
        color: '#000000ff',
        fontFamily:'Italic',
    },
    descripción: {  
        fontSize: 14,
        color: '#000000ff',
        fontFamily:'Italic',
    },
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    header: {
        marginBottom: 16,
        alignItems: 'center',alignContent:'center',
    },
    nombre: {
        fontSize: 24,
        fontWeight: 'bold',
        fontFamily:'Italic',
    },
    titulo: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 8,
        fontFamily:'Italic',
    },
    boton: {
        backgroundColor: '#007aff',
        borderRadius: 25,
        padding: 10,
        alignItems: 'center',

    },
    listContainer: {
        flex: 1,
    },
    subtitulo: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    botonContainer: {
        marginTop: 16,
        borderRadius: 25,
        overflow: 'hidden',
        gap: 10,
    },
});