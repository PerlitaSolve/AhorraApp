import React from 'react';
import { View, Text, StyleShee, SafetyAreaViewBase, ScrollView, TouchableOpacity } from 'react-native';

export default function Ingresos(){
const Ingresos = () => {
    const ingresos = [
        {nombre: 'Trabajo', monto: '$7.200', color: '#66CDAA' },
        {nombre: 'Renta', monto: '$1.200', color: '#ADD8E6' },
    ];

    return (
        <SafetyAreaViewBase style={styles.container}>
            <View style={styles.header}>
                <View style={styles.Container}>
                    <TouchableOpacity style={styles.tab}>
                        <Text style={styles.tabTextInactive}>EGRESOS</Text>
                    </TouchableOpacity>
                   <TouchableOpacity style={[styles.tab, stayles.activeTab]}>
                        <Text style={styles.tabText}>INGRESOS</Text>
                   </TouchableOpacity>
                </View>
            </View>

           <ScrollView style={styles.content}>
            <View style={styles.timeFilter}>
                <Text style={styles.filterText}>Semana</Text>
                <Text style={styles.filterText}>Mes</Text>
                <Text style={styles.filterText}>Año</Text>
            </View>

            <Text style ={styles.mounthTitle}>ANUAL</Text>

           <View style={[styles.chartPlaceholder, styles.annualChart]}>
            <Text style={styles.chartText}>Gráfico Anual de Ingresos </Text>
           </View>

           <TouchableOpacity style={styles.addButton}>
            <Text style={styles.addButtonText}>Añadir +</Text>
           </TouchableOpacity>
           </ScrollView>
        </SafetyAreaViewBase>
    )
}
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    header: {
        backgroundColor: '#004A77',
        padding: 20,
        paddingBottom: 50,
    },
    headerText: {
        color: '#FFF',
        fontSize: 18,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    balanceText: {
        color: '#B0E0E6',
        fontSize: 14,
        textAlign: 'center',
        marginTop: 10,
    },
    balanceAmount: {
        color: '#FFF',
        fontSize: 32,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    tabsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
    tab: {
        paddingVertical: 8,
        paddingHorizontal: 15,
        marginHorizontal: 5,
        borderRadius: 20,
    },
    activeTab: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    tabText: {
        color: '#FFF',
        fontWeight: 'bold',
    },
    tabTextActive: {
        color: '#B0E0E6',
    },
    content: {
        flex: 1,
        padding: 20,
    },
    timeFilter: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
        paddingBottom: 10,
    },
    timeFilterText: {
        color: '#888',
        fontSize: 16,
    },
    filterTextActive: {
        color: '#004A77',
        fontWeight: 'bold',
        borderBottomWidth: 2,
        borderBottomColor: '#004A77',
    },
    mounhTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    chartPlaceholder: {
        height: 180,
        borderRadius: 90,
        backgroundColor: '#ADD8E6',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    chartText: {
        color: '#555',
        fontSize: 16,
    },
    listItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    colorDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: 10,
    },
    listItemText: {
        flex: 1,
        fontSize: 16,
        color: '#333',
    },
    listItemAmount: {
        fontSize: 16,
        color: '#333',
        fontWeight: 'bold',
    },
    addButton: {
        backgroundColor: '#004A77',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    addButtonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

