import React, { useState, useEffect, useRef } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { View, StyleSheet, Alert, Text } from 'react-native';
import axios from 'axios';
import * as Location from 'expo-location';

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
  const [lugares, setLugares] = useState<Lugar[]>([]);
  const [region, setRegion] = useState<Region | null>(null);
  const [ubicacionActual, setUbicacionActual] = useState<{ latitude: number; longitude: number } | null>(null);

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
    const categorias = ['hospital', 'policia'];
    try {
      const lugaresEncontrados = await Promise.all(
        categorias.map(categoria => buscarLugaresCercanos(lat, lon, categoria))
      );
      const lugaresUnidos = lugaresEncontrados.flat();

      //filtra lugares cercanos
      const lugaresFiltrados = lugaresUnidos.filter(lugar => lugar.lat && lugar.lon && estaCerca(lat, lon, parseFloat(lugar.lat), parseFloat(lugar.lon)));
      setLugares(lugaresFiltrados);
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

  return (
    <View style={StyleSheet.absoluteFillObject}>
      {region ? ( // muestra el mapa si la region esta definida
        <MapView
          style={StyleSheet.absoluteFillObject}
          region={region}
        >
          {/* Marcador para la ubicación actual */}
          {ubicacionActual && (
            <Marker
              coordinate={ubicacionActual}
              title="Tu Ubicación"
              pinColor="blue" 
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
            />
          ))}
        </MapView>
      ) : (
        <View style={styles.loadingContainer}>
          <Text>Cargando mapa...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});