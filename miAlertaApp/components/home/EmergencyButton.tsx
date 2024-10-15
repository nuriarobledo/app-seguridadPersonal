import React, { useState, useEffect } from 'react';
import { StyleSheet, Pressable, Text, View, Alert } from 'react-native';

export const EmergencyButton = () => {
  const [emergenciaPresionada, setEmergenciaPresionada] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [timerActive, setTimerActive] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;  // Especificar el tipo de 'timer'
    
    if (timerActive && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0) {
        console.log(("llego a cero"))
      handleEmergencyAction();
    }

    // Limpiar el temporizador cuando el componente se desmonte
    return () => clearTimeout(timer);
  }, [countdown, timerActive]);

  const handleEmergencyAction = () => {
    Alert.alert(
      'Alerta de Emergencia',
      '¡Se ha enviado la alerta!',
      [
        {
          text: 'OK', 
          onPress: resetButton 
        }
      ],
      { cancelable: false }
    );
    console.log('¡Emergencia activada! Se envía la alerta.');
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
          <Text style={styles.countdownText}>Emergencia en {countdown}...</Text>
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
    fontSize: 18,
    fontWeight: 'bold',
  },
  countdownContainer: {
    alignItems: 'center',
  },
  countdownText: {
    fontSize: 24,
    color: 'red',
    marginBottom: 20,
  },
  cancelButton: {
    backgroundColor: 'gray',
    padding: 10,
    borderRadius: 10,
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 18,
  }
});
