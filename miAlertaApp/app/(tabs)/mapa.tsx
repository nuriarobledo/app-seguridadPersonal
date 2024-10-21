import React, { useState, useEffect, useRef } from 'react';
import MapView, { PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { StyleSheet, View, ActivityIndicator, Text, TouchableOpacityBase, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';  // Importa expo-location
import { useNavigation } from 'expo-router';

const INITIAL_REGION={
  latitude: -34.90486,
  longitude: -57.92606,
  latitudeDelta: 2,
  longitudeDelta: 2,
};

export default function mapa(){
  const mapRef = useRef<MapView | null>(null);
  const navigation =  useNavigation();

  useEffect(() =>{
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={focusMap}>
          <View style={{ padding: 10}}>
            <Text> Focus </Text>
          </View>
        </TouchableOpacity>
      ),
    });
  }, []);

  const focusMap =() => {
    const UTN = {
      latitude: -34.90486,
      longitude: -58.3816,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    };

    mapRef.current?.animateCamera({ center: UTN, zoom:100}, {duration: 3000});
  };

  return(
    <View style={{flex: 1}}>
      <MapView
        style={StyleSheet.absoluteFill}
        provider={PROVIDER_GOOGLE}
        initialRegion={INITIAL_REGION}
        showsUserLocation
        showsMyLocationButton
        ref={mapRef}
      />
    </View>
    );

}