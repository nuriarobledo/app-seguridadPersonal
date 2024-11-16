import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Pressable,
  Text,
  View,
  Alert,
  AppState,
  Animated,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SMS from "expo-sms";
import * as Location from "expo-location";

//data
import {
  ContactoEmergencia,
  getContactoEmergenciaByIdUser,
} from "../../database/database";


export const EmergencyButton = () => {
  const [emergenciaPresionada, setEmergenciaPresionada] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [timerActive, setTimerActive] = useState(false);
  const [listado, setListadoContactoEmergencia] = useState<ContactoEmergencia[]>([]); 
  const [idUsuario, setIdUsuario] = useState<number | null>(null);
  
  // "pulsacion""
  const pulseAnim = useState(new Animated.Value(1))[0];

  // Función para obtener contactos de emergencia
  const obtenerContactosEmergencia = async () => {
    try {
      const id = await AsyncStorage.getItem("userId");
      if (id !== null) {
        setIdUsuario(Number(id));
        const listado = await getContactoEmergenciaByIdUser(Number(id));
        console.log("Listado de contacto de emergencia obtenidos:", listado);
        if (listado && listado.length > 0) {
          setListadoContactoEmergencia(listado);
        } else {
          console.warn("No existen contactos de emergencia para este usuario");
        }
      } else {
        console.warn("No se encontró ningún ID de Firebase en AsyncStorage");
      }
    } catch (error) {
      console.error("Error al cargar los contactos de emergencia:", error);
    }
  };

  // Función para manejar el temporizador
  const manejarTemporizador = () => {
    let timer: NodeJS.Timeout | undefined;
    if (timerActive && countdown > 0) {
      timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
    } else if (countdown === 0) {
      handleEmergencyAction();
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  };

  // Función para manejar el estado de la app
  const manejarEstadoApp = () => {
    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );
    return () => {
      subscription.remove();
    };
  };

  useEffect(() => {
    obtenerContactosEmergencia();
    manejarEstadoApp();
    manejarTemporizador();

    if (emergenciaPresionada) {
      // animacion de latido
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }

    return () => {
      if (timerActive) clearTimeout(Number(timerActive));
    };
  }, [timerActive, countdown, emergenciaPresionada]);

  const handleAppStateChange = (nextAppState: string) => {
    if (nextAppState === "inactive" || nextAppState === "background") {
      resetButton();
    }
  };

  const handleEmergencyAction = async () => {
    const isAvailable = await SMS.isAvailableAsync();
    const contactoPredeterminado = listado.find(
      (contacto) => contacto.esPredeterminado
    );

    if (!contactoPredeterminado) {
      Alert.alert("¡Advertencia!", "No tienes contactos de emergencia!");
      resetButton(); 
      return; 
  }
    console.log("celular", contactoPredeterminado?.celular);

    if (isAvailable) {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permiso de ubicación denegado");
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      const locationUrl = `https://www.google.com/maps?q=${location.coords.latitude},${location.coords.longitude}`;

      const { result } = await SMS.sendSMSAsync(
        [contactoPredeterminado.celular],
        `¡Emergencia! Necesito ayuda. Por favor, comunícate conmigo lo antes posible. Mi ubicación actual es: ${locationUrl}`
      );
      if (result === "sent" || result === "cancelled") {
        setTimeout(() => {
          resetButton();
        }, 500);
      }
    } else {
      Alert.alert(
        "Alerta de Emergencia",
        isAvailable
          ? "No se pudo enviar la alerta. Por favor, intenta nuevamente."
          : "SMS no disponible en este dispositivo.",
        [{ text: "OK", onPress: resetButton }],
        { cancelable: false }
      );
    }
  };

  const handlePress = () => {
    setEmergenciaPresionada(true);
    setTimerActive(true);
    setCountdown(3);
  };

  const handleCancel = () => {
    setTimerActive(false);
    setEmergenciaPresionada(false);
    setCountdown(3);
    console.log("Emergencia cancelada");
  };

  const resetButton = () => {
    setEmergenciaPresionada(false);
    setCountdown(3);
    setTimerActive(false);
  };

  return (
    <View style={styles.container}>
      {!emergenciaPresionada ? (
        <Pressable style={styles.emergencyButton} onPress={handlePress}>
          <Text style={styles.buttonText}>Emergencia</Text>
        </Pressable>
      ) : (
        <Animated.View style={[styles.emergencyButton, { transform: [{ scale: pulseAnim }] }]}>
          <Text style={styles.countdownText}>{countdown}</Text>
          <Pressable style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </Pressable>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 150,
  },
  emergencyButton: {
    backgroundColor: "red",
    width: 150,
    height: 150,
    borderRadius: 75,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  countdownText: {
    fontSize: 28,
    color: "white",
   },
   cancelButton: {
     backgroundColor: "red",
     padding: 10,
     borderRadius: 10,
   },
   cancelButtonText: {
     color: "white",
     fontSize: 18,
   },
});
