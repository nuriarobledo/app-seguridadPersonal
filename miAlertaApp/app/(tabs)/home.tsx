import React, { useEffect, useState } from "react";
import {
  Image,
  StyleSheet,
} from "react-native";

import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { EmergencyButton } from '@/components/home/EmergencyButton';
import AntDesign from '@expo/vector-icons/AntDesign';
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HomeScreen() {
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUserName() {
      try {
        const nombre = await AsyncStorage.getItem("userName");
        setUserName(nombre || "Usuario"); // Establece un nombre predeterminado si no se encuentra
      } catch (error) {
        console.error("Error al obtener el nombre del usuario desde AsyncStorage:", error);
      }
    }

    fetchUserName();
  }, []);

  return (
    <ParallaxScrollView
    headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
    headerImage={<AntDesign name="home" size={24} color="black" />}
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Bienvenido {userName}!</ThemedText>
        <HelloWave />
      </ThemedView>

       {/* Botón de Emergencia */}
       <EmergencyButton />

    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 50,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 80,
    width: 180,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
