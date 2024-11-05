import React, { useState, useEffect, useRef } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { View, StyleSheet } from 'react-native';
import axios from 'axios';

// Definimos el tipo para un lugar
type Lugar = {
  lat: string;
  lon: string;
  display_name: string;
};

// Región inicial tipada correctamente
const INITIAL_REGION = {
  latitude: -34.90486,
  longitude: -57.92606,
  latitudeDelta: 0.1,
  longitudeDelta: 0.1,
};

export default function Mapa() {
  const [lugares, setLugares] = useState<Lugar[]>([]);  // Tipamos lugares como un array de objetos de tipo 'Lugar'
  const mapRef = useRef<MapView | null>(null);

  useEffect(() => {
    const obtenerLugares = async () => {
      const categorias = ['hospital', 'policia', 'bomberos']; // Añade más categorías según sea necesario
      const lugaresEncontrados = await Promise.all(
        categorias.map(categoria => buscarLugaresCercanos(INITIAL_REGION.latitude, INITIAL_REGION.longitude, categoria))
      );
      const lugaresUnidos = lugaresEncontrados.flat(); // Combina los resultados en un solo array
      setLugares(lugaresUnidos);
    };

    obtenerLugares();
  }, []);

  // Función tipada con los parámetros correctos
  const buscarLugaresCercanos = async (lat: number, lon: number, categoria: string): Promise<Lugar[]> => {
    try {
      const response = await axios.get('https://nominatim.openstreetmap.org/search', {
        params: {
          q: categoria,
          format: 'json',
          limit: 10,
          lat: lat,
          lon: lon,
        },
      });
      return response.data;
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  return (
    <View style={StyleSheet.absoluteFillObject}>
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFillObject}
        initialRegion={INITIAL_REGION}
      >
        {lugares.map((lugar, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: parseFloat(lugar.lat),  // Convertimos a número
              longitude: parseFloat(lugar.lon),  // Convertimos a número
            }}
            title={lugar.display_name}
          />
        ))}
      </MapView>
    </View>
  );
}
