import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { AntDesign } from '@expo/vector-icons';

interface ContactoItemProps {
  nombre: string;
  telefono: string;
  onEliminar: () => void;
}

const ContactoItem: React.FC<ContactoItemProps> = ({ nombre, telefono, onEliminar }) => {
    // Función para realizar la llamada
    const llamarContacto = () => {
      Linking.openURL(`tel:${telefono}`);
    };
 
 
  return (
    <View style={styles.contactoContainer}>
      <View>
        <Text style={styles.contactoNombre}>{nombre}</Text>
        <Text style={styles.contactoTelefono}>{telefono}</Text>
      </View>
      <TouchableOpacity onPress={llamarContacto} style={styles.botonLlamar}>
        <Ionicons name="call-outline" size={24} color="white" />
      </TouchableOpacity>
      <TouchableOpacity onPress={onEliminar} style={styles.botonEliminar}>
        <AntDesign name="delete" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  contactoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 5,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  contactoNombre: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  contactoTelefono: {
    fontSize: 16,
    color: '#888',
  },
  botonEliminar: {
    backgroundColor: '#ff6961',
    padding: 10,
    borderRadius: 5,
  },
  botonLlamar: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: 'green',
    marginLeft: 130,
  },
});

export default ContactoItem;
