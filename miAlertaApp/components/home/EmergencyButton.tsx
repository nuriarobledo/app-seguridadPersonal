import React, { useState, useEffect } from 'react';
import { StyleSheet, Pressable, Text, View, Alert, AppState } from 'react-native';

//expo para msj
import * as SMS from 'expo-sms';

export const EmergencyButton = () => {
  const [emergenciaPresionada, setEmergenciaPresionada] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [timerActive, setTimerActive] = useState(false);
  const [contactoEmergencia, setContactoEmergencia] = useState<{ id: string; nombre: string; telefono: string }[]>([
    { id: '1', nombre: 'Juan', telefono: '123456478' },
  ]);

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;

    if (timerActive && countdown > 0) {
      timer = setTimeout(() => setCountdown(prev => prev - 1), 1000);
    } else if (countdown === 0) {
      handleEmergencyAction();
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [countdown, timerActive]);

  // Manejar el estado de la app
  useEffect(() => {
    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, []);

  const handleAppStateChange = (nextAppState: string) => {
    if (nextAppState === 'inactive' || nextAppState === 'background') {
      resetButton(); // Resetea el botón si la app pierde foco
    }
  };

  const handleEmergencyAction = async () => {
    const isAvailable = await SMS.isAvailableAsync();
    console.log("telefono", contactoEmergencia[0].telefono);
    if (isAvailable) {
      const { result } = await SMS.sendSMSAsync(
        [contactoEmergencia[0].telefono], // Número de teléfono hardcodeado
        '¡Emergencia! Necesito ayuda. Por favor, comunícate conmigo lo antes posible.'
      );
      if (result === 'sent' || result === 'cancelled'){
        setTimeout(() => {
          resetButton(); // Resetear estado después de un breve delay
        }, 500);
      }
    } else {
      Alert.alert(
        'Alerta de Emergencia',
        'No se pudo enviar la alerta. Por favor, intenta nuevamente.',
        [
          {
            text: 'OK', 
            onPress: resetButton, // Restablecer el botón si no está disponible el SMS
          },
        ],
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
    console.log('Emergencia cancelada');
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
          <Text style={styles.countdownText}>Enviando alerta a {contactoEmergencia[0].nombre} en {countdown}...</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 150,
  },
  emergencyButton: {
    backgroundColor: 'red',
    width: 150,
    height: 150,
    borderRadius: 75,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  countdownContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    width: '60%',
  },
  countdownText: {
    fontSize: 28,
    color: 'white',
    marginBottom: 20,
  },
  cancelButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 10,
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 18,
  }
});
