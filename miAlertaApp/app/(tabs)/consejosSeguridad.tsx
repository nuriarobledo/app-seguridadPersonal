import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity  } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

const consejos = [
  "Busca un lugar seguro.",
  "Llama a la policía.",
  "Mantén la calma y respira profundamente.",
  "Ten a mano tus contactos de emergencia.",
  "Informa a alguien de tu situación."
];

const InformacionSeguridad: React.FC = () => {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.header}>
          <ThemedText type="title">Consejos de Seguridad</ThemedText>
        </View>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {consejos.map((consejo, index) => (
            <TouchableOpacity key={index} style={styles.card}>
              <ThemedText style={styles.consejo}>{consejo}</ThemedText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </ThemedView>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    icon: {
      marginRight: 8,
      fontSize: 24,
      color: '#000',
    },
    scrollContainer: {
      paddingBottom: 16,
    },
    card: {
      backgroundColor: '#fff', 
      borderRadius: 8,
      padding: 16,
      marginVertical: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2, 
    },
    consejo: {
      fontSize: 16,
      color: '#333',
    },
  });
  
  export default InformacionSeguridad;