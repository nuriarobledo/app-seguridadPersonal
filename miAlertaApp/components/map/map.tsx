import React, { useState, useEffect } from 'react';
import MapView, { PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { StyleSheet, View } from 'react-native';
import * as Location from 'expo-location';  // Importa expo-location

// Define el tipo para la región
interface IRegion {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

export default function Lugares_Seguros() {
  const [region, setRegion] = useState<IRegion | null>(null);  // Estado con tipo para la región

  useEffect(() => {
    (async () => {
      // Pedir permisos de ubicación al iniciar
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log("Permiso de ubicación denegado.");
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
    })();
  }, []);

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
});
