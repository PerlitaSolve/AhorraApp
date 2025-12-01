import { Text, StyleSheet, View, StatusBar, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { obtenerResumenPresupuestos } from '../services/budgetService';
import { Ionicons } from '@expo/vector-icons';

export default function Notificaciones({ navigation, volver }) {
    const { usuario } = useUser();
    const [notificaciones, setNotificaciones] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (usuario?.id) {
            cargarNotificaciones();
        }
    }, [usuario?.id]);

    const cargarNotificaciones = async () => {
        setLoading(true);
        try {
            const fechaActual = new Date();
            const mes = fechaActual.getMonth() + 1;
            const anio = fechaActual.getFullYear();

            const resultado = await obtenerResumenPresupuestos(usuario.id, mes, anio);
            
            if (resultado.success) {
                const notifs = [];
                
                resultado.resumen.forEach((presupuesto) => {
                    // Notificación si se excede el 100%
                    if (presupuesto.excedido) {
                        notifs.push({
                            id: `excedido-${presupuesto.id}`,
                            tipo: 'error',
                            categoria: presupuesto.categoria,
                            mensaje: `Se excedió el presupuesto de "${presupuesto.categoria}". Has gastado $${presupuesto.gastado.toFixed(2)} de $${presupuesto.presupuesto.toFixed(2)}`,
                            porcentaje: presupuesto.porcentajeUsado,
                            fecha: new Date()
                        });
                    }
                    // Notificación si se alcanza el 80%
                    else if (presupuesto.porcentajeUsado >= 80) {
                        notifs.push({
                            id: `advertencia-${presupuesto.id}`,
                            tipo: 'warning',
                            categoria: presupuesto.categoria,
                            mensaje: `Falta poco para llegar al límite del presupuesto de "${presupuesto.categoria}". Has usado el ${presupuesto.porcentajeUsado.toFixed(0)}%`,
                            porcentaje: presupuesto.porcentajeUsado,
                            fecha: new Date()
                        });
                    }
                });

                setNotificaciones(notifs);
            }
        } catch (error) {
            console.error('Error al cargar notificaciones:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#1D617A" />
            
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation?.navigate('Home')} style={styles.logoButton}>
                    <Image 
                        source={require('../assets/L-SFon.png')} 
                        style={styles.logo}
                        resizeMode="contain"
                    />
                </TouchableOpacity>
                <Text style={styles.titulo}>NOTIFICACIONES</Text>
                <TouchableOpacity style={styles.menuButton} onPress={() => navigation?.navigate('MenuLateral')}>
                    <Ionicons name="menu" size={28} color="white" />
                </TouchableOpacity>
            </View>

            {/* Lista de notificaciones */}
            <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#fff" />
                        <Text style={styles.loadingText}>Cargando notificaciones...</Text>
                    </View>
                ) : (
                    <View style={styles.notificacionesContainer}>
                        {notificaciones.length === 0 ? (
                            <View style={styles.emptyContainer}>
                                <Ionicons name="notifications-off-outline" size={60} color="#1D617A" />
                                <Text style={styles.emptyText}>No tienes notificaciones</Text>
                                <Text style={styles.emptySubtext}>Las alertas de presupuestos aparecerán aquí</Text>
                            </View>
                        ) : (
                            <>
                                {notificaciones.map((notif) => (
                                    <View 
                                        key={notif.id} 
                                        style={[
                                            styles.notificacionItem,
                                            notif.tipo === 'error' && styles.notificacionError,
                                            notif.tipo === 'warning' && styles.notificacionWarning
                                        ]}
                                    >
                                        <View style={styles.iconoContainer}>
                                            <Ionicons 
                                                name={notif.tipo === 'error' ? 'alert-circle' : 'warning'} 
                                                size={32} 
                                                color={notif.tipo === 'error' ? '#d32f2f' : '#f57c00'} 
                                            />
                                        </View>
                                        <View style={styles.notificacionContent}>
                                            <Text style={styles.notificacionCategoria}>{notif.categoria}</Text>
                                            <Text style={styles.notificacionTexto}>{notif.mensaje}</Text>
                                            <Text style={styles.notificacionFecha}>
                                                {new Date(notif.fecha).toLocaleDateString('es-MX', { 
                                                    day: 'numeric', 
                                                    month: 'long', 
                                                    hour: '2-digit', 
                                                    minute: '2-digit' 
                                                })}
                                            </Text>
                                        </View>
                                    </View>
                                ))}
                                
                                <TouchableOpacity 
                                    style={styles.verTodoButton}
                                    onPress={() => navigation?.navigate('Home', { screen: 'Presupuestos' })}
                                >
                                    <Text style={styles.verTodoTexto}>Ver todos los presupuestos</Text>
                                    <Ionicons name="arrow-forward" size={20} color="#1D617A" />
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1D617A',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 50,
        paddingHorizontal: 20,
        paddingBottom: 20,
        backgroundColor: '#1D617A',
    },
    logoButton: {
        padding: 5,
    },
    logo: {
        width: 35,
        height: 35,
    },
    titulo: {
        fontSize: 20,
        color: 'white',
        fontWeight: 'bold',
        flex: 1,
        textAlign: 'center',
    },
    menuButton: {
        padding: 5,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 50,
    },
    loadingText: {
        color: 'white',
        marginTop: 10,
        fontSize: 16,
    },
    scrollContainer: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 30,
    },
    notificacionesContainer: {
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 15,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    emptyContainer: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 15,
    },
    emptySubtext: {
        fontSize: 14,
        color: '#666',
        marginTop: 5,
    },
    notificacionItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        backgroundColor: '#f8f9fa',
    },
    notificacionError: {
        backgroundColor: '#ffebee',
        borderLeftWidth: 4,
        borderLeftColor: '#d32f2f',
    },
    notificacionWarning: {
        backgroundColor: '#fff3e0',
        borderLeftWidth: 4,
        borderLeftColor: '#f57c00',
    },
    iconoContainer: {
        marginRight: 12,
        paddingTop: 2,
    },
    notificacionContent: {
        flex: 1,
    },
    notificacionCategoria: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    notificacionTexto: {
        fontSize: 14,
        color: '#4A5568',
        lineHeight: 20,
        marginBottom: 5,
    },
    notificacionFecha: {
        fontSize: 12,
        color: '#999',
        fontStyle: 'italic',
    },
    verTodoButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 15,
        paddingVertical: 12,
        paddingHorizontal: 20,
        backgroundColor: '#E8F4F8',
        borderRadius: 8,
        gap: 8,
    },
    verTodoTexto: {
        fontSize: 16,
        color: '#1D617A',
        fontWeight: '600',
    },
});
