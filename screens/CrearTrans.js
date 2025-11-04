import { Text, StyleSheet, View, ImageBackground, Button, TextInput, Image} from 'react-native'
import React, { useState } from 'react'

export default function CrearTrans() {
  const [monto, setMonto]=useState('');
  const [categoria, setCategoria]=useState('');
  const [descripcion, setDescripcion]=useState('');

    return (
        <ImageBackground style={styles.background} source={require('../assets/FCrear.png')}>
            <View style={styles.container}>
                <Image source={require('../assets/L-SFon.png')} style={{width:80, height:80, marginBottom:10}}/>
                <Text style={styles.nombre}>AHORRA + APP</Text>
                <Text style={styles.titulo}>NUEVA TRANSACCIÓN</Text>
                <View>
                    <Text style={styles.subtitulos}>  Tipo de Movimiento</Text>
                    <View style={styles.botones}>
                    <Button style={[styles.luz, {color: esEncendido ? color:'white'}]} title={'INGRESO'}/>
                    <Button style={[styles.luz, {color: esEncendido ? color:'white'}]}  title={'GASTO'}/>
                    </View>
                    <Text style={styles.subtitulos}>Cantidad</Text>
                    <TextInput
                        style={styles.input}
                        placeholder='$Monto'
                        value={monto}
                        onChangeText={setMonto}
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
                    <Button 
                    style={styles.boton} 
                    color={'#4c79e3ce'}
                    title={'Añadir'}/>
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
    },
    boton:{
        marginTop: 10,
        borderRadius: 25,
        overflow: 'hidden',
        gap: 10,
        flexDirection: 'row-reverse',
    },
})
