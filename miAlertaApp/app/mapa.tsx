import React, { useState, useEffect, useRef } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { View, StyleSheet, Alert, Text, TouchableOpacity, ScrollView } from 'react-native';
import axios from 'axios';
import * as Location from 'expo-location';
import { useNavigation } from "@react-navigation/native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import ThemedIcon from "@/components/ThemedIcon";

import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

type Lugar = {
  lat: string;
  lon: string;
  display_name: string;
};

type Region = {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
};


export default function Mapa() {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,  // Asegura que la barra de navegación esté visible
      headerTitle: '',    // Oculta el título
    });
  }, [navigation]);

  const [lugares, setLugares] = useState<Lugar[]>([]);
  const [region, setRegion] = useState<Region | null>(null);
  const [ubicacionActual, setUbicacionActual] = useState<{ latitude: number; longitude: number } | null>(null);
  const [lugarSeleccionado, setLugarSeleccionado] = useState<Lugar | null>(null);

  useEffect(() => {
    const obtenerUbicacion = async () => {
      // pedir permiso
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert("Permiso denegado", "No se pudo obtener la ubicación.");
        return;
      }

      // ubicacion actual
      let ubicacion = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = ubicacion.coords;

      setRegion({
        latitude,
        longitude,
        latitudeDelta: 0.015, // zoom
        longitudeDelta: 0.015,
      });

      setUbicacionActual({ latitude, longitude });

      obtenerLugaresCercanos(latitude, longitude);
    };

    obtenerUbicacion();
  }, []);

  const obtenerLugaresCercanos = async (lat: number, lon: number) => {
    const categorias = ['hospital', 'policia', 'bomberos', 'clinica', 'salud', 'urgencia', 'comisaria', 'sanatorio'];
    try {
      const lugaresEncontrados = await Promise.all(
        categorias.map(categoria => buscarLugaresCercanos(lat, lon, categoria))
      );
      const lugaresUnidos = lugaresEncontrados.flat();

      //filtra lugares cercanos
      const lugaresFiltrados = lugaresUnidos.filter(lugar => lugar.lat && lugar.lon && estaCerca(lat, lon, parseFloat(lugar.lat), parseFloat(lugar.lon)));
      setLugares(lugaresFiltrados);

      console.log('Lugares filtrados:', lugaresFiltrados);
    } catch (error) {
      console.error("Error al obtener lugares cercanos:", error);
    }
  };

  const buscarLugaresCercanos = async (lat: number, lon: number, categoria: string): Promise<Lugar[]> => {
    try {
      const delta = 0.05; // rango de busqueda 5km
      const response = await axios.get('https://nominatim.openstreetmap.org/search', {
        params: {
          q: categoria,
          format: 'json',
          limit: 10,
          lat: lat,
          lon: lon,
          addressdetails: 1,
          viewbox: `${lon - delta},${lat + delta},${lon + delta},${lat - delta}`,
          bounded: 1 // limita los resultados a la viewbox
        },
        headers: {
          'User-Agent': 'miAlertaApp/1.0 (https://github.com/nuriarobledo/app-seguridadPersonal/tree/main)'
        }
      });

      return response.data.map((item: any) => ({
        lat: item.lat,
        lon: item.lon,
        display_name: item.display_name,
      }));
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  //  verifica si el lugar esta cerca
  const estaCerca = (lat1: number, lon1: number, lat2: number, lon2: number): boolean => {
    const distanciaMaxima = 5000; // distancia máxima en metros (5 km)
    const radianesPorGrado = Math.PI / 180;

    const dLat = (lat2 - lat1) * radianesPorGrado;
    const dLon = (lon2 - lon1) * radianesPorGrado;

    lat1 *= radianesPorGrado;
    lat2 *= radianesPorGrado;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1) * Math.cos(lat2) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distancia = 6371000 * c;

    return distancia <= distanciaMaxima; // true si esta dentro del rango
  };

  //funcion para obtener el color del pin segun el lugar
  const obtenerColorPin = (displayName: string) => {
    if (
      displayName.toLowerCase().includes("policía") ||
      displayName.toLowerCase().includes("comisaría")) {
      return "blue";
    } else if (
      displayName.toLowerCase().includes("hospital") ||
      displayName.toLowerCase().includes("sanatorio") ||
      displayName.toLowerCase().includes("clinica") ||
      displayName.toLowerCase().includes("salud") ||
      displayName.toLowerCase().includes("urgencia")
    ) {
      return "green";
    }
    return "yellow";
  };

  const manejarSeleccionMarcador = (lugar: Lugar) => {
    setLugarSeleccionado(lugar);
  };

  const handleInfo = () => {
    Alert.alert(
      "Información",
      "Presione un 'Pin' para obtener más información sobre el lugar.",
      [{ text: "OK" }]
    );
  };

  return (
    <ThemedView style={{ flex: 1 }}>
      <TouchableOpacity onPress={handleInfo} style={styles.infoButton}>
        <ThemedIcon name="information-circle-outline" size={36} />
      </TouchableOpacity>

      {region ? (
        <ThemedView style={styles.mapContainer}>
          <MapView
            style={styles.map}
            region={region}
          >
            {/* Marcador para la ubicación actual */}
            {ubicacionActual && (
              <Marker
                coordinate={ubicacionActual}
                title="Tu Ubicación"
                pinColor="red"
              />
            )}
            {/* Marcadores para los lugares cercanos */}
            {lugares.map((lugar, index) => (
              <Marker
                key={index}
                coordinate={{
                  latitude: parseFloat(lugar.lat),
                  longitude: parseFloat(lugar.lon),
                }}
                title={lugar.display_name}
                pinColor={obtenerColorPin(lugar.display_name)}
                onPress={() => manejarSeleccionMarcador(lugar)}
              />
            ))}
          </MapView>

          {/* Mostrar información del lugar seleccionado */}
          {lugarSeleccionado && (
            <ThemedView style={styles.infoContainer}>
              <Text style={styles.infoTitle}>{lugarSeleccionado.display_name}</Text>
              <Text>Latitud: {lugarSeleccionado.lat}</Text>
              <Text>Longitud: {lugarSeleccionado.lon}</Text>
            </ThemedView>
          )}
        </ThemedView>
      ) : (
        <ThemedView style={styles.loadingContainer}>
          <Text>Cargando mapa...</Text>
        </ThemedView>
      )}

    </ThemedView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapContainer: {
    flex: 1,
    marginTop: 20,
    borderColor: 'red',
    borderWidth: 2,
    borderRadius: 10,
  },
  map: {
    flex: 1,
    borderRadius: 10,
  },
  infoButton: {
    marginLeft: 370
  },
  infoContainer: {
    position: 'absolute',
    bottom: '10%',
    left: '5%',
    right: '5%',
    backgroundColor: 'rgba(255,255,255,0.8)',
    paddingVertical: '5%',
    paddingHorizontal: '5%',
    borderRadius: 10,
    elevation: 5,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  }
});