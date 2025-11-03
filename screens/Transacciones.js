import { StyleSheet, Text, View, FlatList, Button, ImageBackground, Image } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'

export default function Transacciones() {
    const mov=[
        {id:'1', fecha: '27 de Septiembre', descripción: 'Pago de Transporte', monto: -50, categoria:'Transporte'},
        {id:'2', fecha: '23 de Septiembre', descripción: 'Consulta Médica', monto: -150, categoria:'Salud'},
        {id:'3', fecha: '15 de Septiembre', descripción: 'Renta del Cuarto', monto: +1200, categoria:'Renta'},
        {id:'4', fecha: '15 de Septiembre', descripción: 'Colegio', monto: -5000, categoria:'Educación'},
        {id:'5', fecha: '01 de Septiembre', descripción: 'Pago de Netflix', monto: -220, categoria:'Servicios'},
        {id:'6', fecha: '26 de Agosto', descripción: 'Salario', monto: +7200, categoria:'Salario'},
    ]   
    const ent=({item})=>(
        <View style={styles.overlay}>
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
                <Image source={require('../assets/L-SFon.png')} style={{width:80, height:80, marginBottom:10}}/>
                <Text style={styles.nombre}>AHORRA + APP</Text>
                <Text style={styles.titulo}>"TRANSACCIONES"</Text>
                <Button style={styles.boton} title="Añadir +" onPress={() => {}} />
            </View>
            <View style={styles.listContainer}>
                <View style={styles.overlay2}>
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
        alignContent:'center',
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
    boton: {
        backgroundColor: '#539ceaff',
        borderRadius: 25,
        padding: 10,
        alignItems: 'center',

    },
    listContainer: {
        flex: 1,
        width: '50%',
    },
    subtitulo: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#4aa1d2ff',
        textAlign: 'center',
        fontFamily:'Italic',
    },
    botonContainer: {
        marginTop: 10,
        borderRadius: 25,
        overflow: 'hidden',
        gap: 10,
        flexDirection: 'row-reverse',
    },
});