import React, { useEffect, useState } from "react";
import {
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import Icon from "react-native-vector-icons/Ionicons";

import AntDesign from '@expo/vector-icons/AntDesign';
import AsyncStorage from "@react-native-async-storage/async-storage";

//componentes
import { EmergencyButton } from '@/components/home/EmergencyButton';
import { RootStackParamList } from "@/components/navigation/RootNavigator.types";

type ScreenNavigationProp = StackNavigationProp<RootStackParamList>;

export default function HomeScreen() {
  const navigation = useNavigation<ScreenNavigationProp>();
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

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("userId");
      await AsyncStorage.removeItem("userName");
      navigation.navigate("index");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={<AntDesign name="home" size={24} color="black" />}

    >
      <ScrollView style={styles.scrollView}
      >
        <ThemedView style={styles.titleContainer}>
          <View style={styles.greetingContainer}>
            {/* Saludo */}
            <ThemedText type="title" style={styles.title}>Hola, {userName}!</ThemedText>
            {/* Icono de Logout */}
            <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
              <Icon name="log-out-outline" size={30} color={"white"} />
            </TouchableOpacity>
            
          </View>
        </ThemedView>

        {/* Botón de Emergencia */}
        <EmergencyButton />
      </ScrollView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  titleContainer: {
    padding: 5,
    marginBottom: 70,
  },
  greetingContainer: {
    flexDirection: 'row',
    alignItems: 'center', 
    justifyContent: 'space-between',
    width: '100%',
  },
  title: {
    fontSize: 24,
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
  logoutButton: {
    marginLeft: 30,
  },

});
