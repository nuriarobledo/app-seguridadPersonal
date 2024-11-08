import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Pressable,
  Text,
  View,
  Alert,
  AppState,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

//expo para msj
import * as SMS from "expo-sms";

//data
import {
  ContactoEmergencia,
  getContactoEmergenciaByIdUser,
} from "../../database/database";

export const EmergencyButton = () => {
  const [emergenciaPresionada, setEmergenciaPresionada] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [timerActive, setTimerActive] = useState(false);
  const [listado, setListadoContactoEmergencia] = useState<
    ContactoEmergencia[]
  >([]); // almacena los contactos
  const [idUsuario, setIdUsuario] = useState<number | null>(null);

  // Función para obtener contactos de emergencia
  const obtenerContactosEmergencia = async () => {
    try {
      const id = await AsyncStorage.getItem("userId");
      if (id !== null) {
        setIdUsuario(Number(id));
        // Usa el firebaseId para obtener los hábitos
        const listado = await getContactoEmergenciaByIdUser(Number(id));
        console.log("Listado de contacto de emergencia obtenidos:", listado);
        if (listado && listado.length > 0) {
          setListadoContactoEmergencia(listado); // Establece los hábitos
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
    obtenerContactosEmergencia(); // Obtener contactos al montar el componente
    manejarEstadoApp(); // Manejar estado de la app

    return manejarTemporizador(); // Manejar temporizador
  }, [timerActive, countdown]);

  const handleAppStateChange = (nextAppState: string) => {
    if (nextAppState === "inactive" || nextAppState === "background") {
      resetButton(); // Resetea el botón si la app pierde foco
    }
  };

  const handleEmergencyAction = async () => {
    const isAvailable = await SMS.isAvailableAsync();
    // Busca el contacto predeterminado
    const contactoPredeterminado = listado.find(
      (contacto) => contacto.esPredeterminado
    );
    console.log("celular", contactoPredeterminado?.celular);
    if (isAvailable && contactoPredeterminado) {
      const { result } = await SMS.sendSMSAsync(
        [contactoPredeterminado.celular],
        "¡Emergencia! Necesito ayuda. Por favor, comunícate conmigo lo antes posible."
      );
      if (result === "sent" || result === "cancelled") {
        setTimeout(() => {
          resetButton(); // Resetear estado después de un breve delay
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
    setCountdown(3); // Reinicia el contador
  };

  const handleCancel = () => {
    setTimerActive(false);
    setEmergenciaPresionada(false);
    setCountdown(3); // Reinicia el contador
    console.log("Emergencia cancelada");
  };
  const resetButton = () => {
    setEmergenciaPresionada(false);
    setCountdown(3); // Reinicia el contador
    setTimerActive(false);
  };

  return (
    <View style={styles.container}>
      {!emergenciaPresionada ? (
        <Pressable style={styles.emergencyButton} onPress={handlePress}>
          <Text style={styles.buttonText}>Emergencia</Text>
        </Pressable>
      ) : (
        <View style={styles.countdownContainer}>
          <Text style={styles.countdownText}>
            Enviando alerta a{" "}
            {listado.find((contacto) => contacto.esPredeterminado)?.nombre} en{" "}
            {countdown}...
          </Text>

          <Pressable style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </Pressable>
        </View>
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
  countdownContainer: {
    alignItems: "center",
    paddingVertical: 20,
    width: "60%",
  },
  countdownText: {
    fontSize: 28,
    color: "white",
    marginBottom: 20,
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
