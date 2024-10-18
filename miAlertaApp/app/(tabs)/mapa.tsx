import React, { useState, useEffect } from 'react';
import MapView, { PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { StyleSheet, View } from 'react-native';
import * as Location from 'expo-location';  // Importa expo-location
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import Ionicons from '@expo/vector-icons/Ionicons';

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
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={<Ionicons size={310} name="code-slash" style={styles.headerImage} />}>
      <ThemedView style={styles.container}>
        {region ? (
          <MapView
            style={StyleSheet.absoluteFill}
            provider={PROVIDER_GOOGLE}
            region={region}
            showsUserLocation={true}
        />
      ) : null}  {/* Muestra el mapa solo cuando la región esté definida */}
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  container: {
    flex: 1,
  },
})
