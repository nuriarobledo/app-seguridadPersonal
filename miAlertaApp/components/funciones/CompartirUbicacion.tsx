import React from 'react';
import { Alert, Linking } from 'react-native';
import * as Location from 'expo-location';

export const CompartirUbicacion = async (): Promise<void> => {
  try {
    // PERMISOS
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permisos denegados',
        'Se requieren permisos de ubicación para compartir tu ubicación.'
      );
      return;
    }

    // ubicacion actual
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });

    const { latitude, longitude } = location.coords;
    const mapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;

    Alert.alert(
      'Ubicación actual',
      'Compartir tu ubicación actual por...',
      [
        {
            text: 'Cancelar',
            style: 'cancel',
          },
        {
          text: 'WhatsApp',
          onPress: async () => {
            const message = `Hola! Salí de mi casa, te comparto mi ubicación actual :) : ${mapsLink}`;
            const whatsappUrl = `whatsapp://send?text=${encodeURIComponent(message)}`;
            const canOpen = await Linking.canOpenURL(whatsappUrl);
            if (canOpen) {
              Linking.openURL(whatsappUrl);
            } else {
              Alert.alert('Error', 'No se pudo abrir WhatsApp.');
            }
          },
        },
        {
          text: 'SMS',
          onPress: async () => {
            const message = `Hola! Salí de mi casa, te comparto mi ubicación actual :) : ${mapsLink}`;
            const smsUrl = `sms:?body=${encodeURIComponent(message)}`;
            const canOpen = await Linking.canOpenURL(smsUrl);
            if (canOpen) {
              Linking.openURL(smsUrl);
            } else {
              Alert.alert('Error', 'No se pudo abrir la aplicación de mensajes.');
            }
          },
        },

      ]
    );
    
  } catch (error) {
    console.error(error);
    Alert.alert('Error', 'Ocurrió un problema al obtener tu ubicación.');
  }
};
