import React, { useState, useEffect } from 'react';
import MapView, { PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { StyleSheet, View, ActivityIndicator, Text } from 'react-native';
import * as Location from 'expo-location';  // Importa expo-location

// Define el tipo para la región
interface IRegion {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

export default function TabFourScreens() {
  const [region, setRegion] = useState<IRegion | null>(null);  // Estado con tipo para la región
  const [loading, setLoading] = useState(true);  // Estado para manejar la carga
  const [errorMsg, setErrorMsg] = useState<string | null>(null);  // Estado para mensajes de error

  // Función para obtener la ubicación
  const fetchLocation = async () => {
    try {
      // Pedir permisos de ubicación
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg("Permiso de ubicación denegado.");
        setLoading(false);
        return;
      }

      // Obtener la ubicación actual
      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      // Establecer la región con la ubicación actual
      setRegion({
        latitude,
        longitude,
        latitudeDelta: 0.01,  // Zoom del mapa
        longitudeDelta: 0.01, // Zoom del mapa
      });
    } catch (error) {
      setErrorMsg("Error obteniendo la ubicación.");
    } finally {
      setLoading(false);
    }
  };

  // useEffect para obtener la ubicación al montar el componente
  useEffect(() => {
    fetchLocation();
  }, []);

  if (loading) {
    // Mostrar spinner mientras se carga la ubicación
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Cargando ubicación...</Text>
      </View>
    );
  }

  if (errorMsg) {
    // Mostrar el mensaje de error si ocurre algún problema
    return (
      <View style={styles.errorContainer}>
        <Text>{errorMsg}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {region ? (
        <MapView
          style={StyleSheet.absoluteFill}
          provider={PROVIDER_GOOGLE}
          region={region}
          showsUserLocation={true}
        />
      ) : null}  {/* Muestra el mapa solo cuando la región esté definida */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
