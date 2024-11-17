import React, { useState, useEffect } from "react";
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
import * as Animatable from "react-native-animatable";
import AsyncStorage from "@react-native-async-storage/async-storage";

//database
import {
  getContactoEmergenciaByIdUser,
  ContactoEmergencia,
} from "../database/database";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from '../assets/types';

type ScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "funciones"
>;
// Obtener las dimensiones de la pantalla
const { width, height } = Dimensions.get("window");

export default function LlamadaFalsaScreen() {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,  // Oculta la barra de navegación en esta pantalla
    });
  }, [navigation]);

  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isCalling, setIsCalling] = useState(false); // Para controlar si la llamada está sonando
  const [listado, setListadoContactoEmergencia] = useState<
    ContactoEmergencia[]
  >([]);
  const [idUsuario, setIdUsuario] = useState<number | null>(null);

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

  useEffect(() => {
    obtenerContactosEmergencia();
    playFakeCall(); // Inicia la llamada automáticamente
    return () => {
      endCall(); // Limpia recursos al desmontar el componente
    };
  }, []); // Dependencia vacía para que se ejecute solo una vez

  const contactoPredeterminado = listado.find(
    (contacto) => contacto.esPredeterminado
  );

  const playFakeCall = async () => {
    if (isCalling) {
      // Si ya está sonando la llamada, no hacer nada
      console.log("Ya está sonando la llamada");
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
    }, 5000); // Detener después de 5 segundos
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
        <Animatable.View
          animation="pulse"
          easing="ease-out"
          iterationCount="infinite"
        >
          <TouchableOpacity
            onPress={() => {
              console.log("Botón presionado");
              playFakeCall();
            }}
            style={styles.roundButton}
          >
            <Ionicons name="call-outline" size={40} color="white" />
          </TouchableOpacity>
        </Animatable.View>
      )}
      {/* Mostrar "Llamada Entrante" si está sonando */}
      {isCalling && (
        <ThemedView style={styles.callingContainer}>
          <ThemedText style={styles.callingText}>
            {contactoPredeterminado ? (
              <>
                <Text style={styles.textTitle}>Llamada Entrante</Text>
                {"\n"}
                <Text style={styles.textName}>
                  {contactoPredeterminado.nombre}
                </Text>
                {"\n"}
                <Text style={styles.textNumber}>
                  {contactoPredeterminado.celular}
                </Text>
              </>
            ) : (
              "Llamada Entrante..."
            )}
          </ThemedText>

          {/* Botón redondo para cortar la llamada */}
          <Animatable.View
            animation="bounce"
            easing="ease-in-out"
            iterationCount="infinite"
          >
            <TouchableOpacity
              onPress={endCall}
              style={styles.roundEndCallButton}
            >
              <Ionicons
                name="call-outline"
                size={40}
                color="white"
                style={{ transform: [{ rotate: "135deg" }] }}
              />
            </TouchableOpacity>
          </Animatable.View>
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
    alignItems: "center",
    width: width,
    height: height,
    padding: 20,
  },
  callingText: {
    position: "absolute",
    top: height * 0.2, // Espaciado dinámico desde la parte superior
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    flexWrap: "wrap",
    maxWidth: width * 0.8, // Evitar que el texto exceda el ancho de la pantalla
    lineHeight: 40, // Mejorar la separación entre líneas
  },
  textTitle: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
  },
  textName: {
    fontSize: 28,
    fontWeight: "600",
    marginTop: 10,
  },
  textNumber: {
    fontSize: 24,
    fontWeight: "400",
    marginTop: 5,
  },
  roundEndCallButton: {
    backgroundColor: "red",
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    marginTop: 600,
    alignSelf: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
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
  roundButton: {
    backgroundColor: "green",
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
