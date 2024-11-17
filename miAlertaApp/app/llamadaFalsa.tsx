import React, { useState } from "react";
import {
  Button,
  Platform,
  View,
  Text,
  Vibration,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Audio } from "expo-av";
import { Ionicons } from "@expo/vector-icons";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";

// Obtener las dimensiones de la pantalla
const { width, height } = Dimensions.get("window");

export default function LlamadaFalsaScreen() {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isCalling, setIsCalling] = useState(false); // Para controlar si la llamada está sonando

  const playFakeCall = async () => {
    if (isCalling) {
      // Si ya está sonando la llamada, no hacer nada
      return;
    }

    setIsCalling(true);

    // Definir el archivo de sonido según la plataforma
    const soundFile =
      Platform.OS === "ios"
        ? require("../assets/sounds/ringtone-IOS.mp3") // Sonido para iOS
        : require("../assets/sounds/ringtone-Android-moto.mp3"); // Sonido para Android

    // Cargar y reproducir el sonido
    const { sound } = await Audio.Sound.createAsync(soundFile);
    setSound(sound);

    // Reproducir el sonido y simular la vibración
    await sound.playAsync();
    Vibration.vibrate([0, 500, 1000]); // Vibrar (0ms de pausa, 500ms de vibración, 1000ms de pausa)

    // Detener el sonido después de un tiempo (Ej. 20 segundos)
    setTimeout(async () => {
      await sound.stopAsync();
      setIsCalling(false);
    }, 20000); // Detener después de 20 segundos
  };

  const endCall = async () => {
    // Terminar la llamada (detener el sonido y la vibración)
    if (sound) {
      await sound.stopAsync();
    }
    Vibration.cancel(); // Detener vibración
    setIsCalling(false);
  };

  return (
    <ThemedView style={styles.container}>
      {/* Mostrar el botón de llamada solo si no está sonando la llamada */}
      {!isCalling && (
        <TouchableOpacity
          onPress={() => {
            console.log("Botón presionado");
            playFakeCall();
          }}
        >
          <ThemedView style={{ padding: 10, backgroundColor: "blue" }}>
            <ThemedText>Hacer Llamada Falsa</ThemedText>
          </ThemedView>
        </TouchableOpacity>
      )}

      {/* Mostrar "Llamada Entrante" si está sonando */}
      {isCalling && (
        <ThemedView style={styles.callingContainer}>
          <ThemedText style={styles.callingText}>Llamada Entrante...</ThemedText>

          {/* Botón para cortar la llamada */}
          <TouchableOpacity onPress={endCall} style={styles.endCallButton}>
            <ThemedText style={styles.endCallButtonText}>Cortar Llamada</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  callingContainer: {
    flex: 1, 
    backgroundColor: "rgba(0, 0, 0, 0.7)", 
    flexDirection: "column",
    justifyContent: "space-between", 
    padding: 20, 
    width: width, 
    height: height, 
  },
  callingText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20, 
  },
  endCallButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 20,
  },
  endCallButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginVertical: 10,
  },
  buttonText: {
    fontSize: 16,
  },
});
