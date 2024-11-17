import React, { useEffect, useState } from "react";
import {
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  View,
  Alert
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import Icon from "react-native-vector-icons/Ionicons";

//iconos
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import AntDesign from '@expo/vector-icons/AntDesign';
import AsyncStorage from "@react-native-async-storage/async-storage";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

//componentes
import { EmergencyButton } from '@/components/home/EmergencyButton';
import { RootStackParamList } from "@/components/navigation/RootNavigator.types";
import { PoliciaCall, BomberosCall, AmbulanciaCall } from "@/components/home/EmergencyCallButton";
import ThemedIcon from "@/components/ThemedIcon";



type ScreenNavigationProp = StackNavigationProp<RootStackParamList>;

export default function HomeScreen() {
  const navigation = useNavigation<ScreenNavigationProp>();
  const [userName, setUserName] = useState<string | null>(null);

  //llamadas
  const { handlePoliceCall } = PoliciaCall();
  const { handleBomberosCall } = BomberosCall();
  const { handleAmbulanciaCall } = AmbulanciaCall();

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

  const handleInfo = () => {
    Alert.alert(
      "Información",
      "Para activar el botón de 'Emergencia' debe presionar el botón o sacudir dos veces el celular.",
      [{ text: "OK" }] 
    );
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={<AntDesign name="home" size={24} color="black" />}

    >
      <ScrollView style={styles.scrollView}
      >
        <ThemedView style={styles.titleContainer}>
          <ThemedView style={styles.greetingContainer}>
            <ThemedText type="title" style={styles.title}>Hola, {userName}!</ThemedText>
            <TouchableOpacity onPress={handleInfo} style={styles.infoButton}>
            <ThemedIcon name="information-circle-outline" size={30}  />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
              <ThemedIcon name="log-out-outline" size={30} />
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>

        {/* Botón de Emergencia */}
        <EmergencyButton />

        {/* Línea separadora */}
        <ThemedView style={styles.separator} />

        {/* Sección de Acciones Rápidas */}
        <ThemedView style={styles.quickActionsContainer}>
          <ThemedText style={styles.sectionTitle}>Marcado Rápido</ThemedText>
          <ThemedView style={styles.actionsRow}>
            <ThemedView style={styles.actionItem}>
              <TouchableOpacity onPress={handlePoliceCall} style={styles.botonLLamar}>
                <MaterialIcons name="local-police" size={30} color="white" />
              </TouchableOpacity>
              <ThemedText>Policía</ThemedText>
            </ThemedView>

            <ThemedView style={styles.actionItem}>
              <TouchableOpacity onPress={handleBomberosCall} style={styles.botonLLamar}>
                <FontAwesome6 name="house-fire" size={28} color="white" />
              </TouchableOpacity>
              <ThemedText>Bomberos</ThemedText>
            </ThemedView>

            <ThemedView style={styles.actionItem}>
              <TouchableOpacity onPress={handleAmbulanciaCall} style={styles.botonLLamar}>
                <FontAwesome5 name="ambulance" size={26} color="white" />
              </TouchableOpacity>
              <ThemedText>Ambulancia</ThemedText>
            </ThemedView>

          </ThemedView>
        </ThemedView>
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
    marginBottom: 30,
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
    marginLeft: 10,
  },
  infoButton: {
    marginLeft: 105
  },
  separator: {
    height: 1,
    backgroundColor: '#a7a7a7',
    marginVertical: 10,

  },
  quickActionsContainer: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 25,
    textAlign: 'center',
  },
  actionButton: {
    flexGrow: 1,
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 8, 
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around', 
  },
  actionItem: {
    alignItems: 'center',
  },
  botonLLamar: {
    backgroundColor: "#1d44e3",
    padding: 0,
    borderRadius: 35,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },

});
