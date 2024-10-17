import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface ContactoItemProps {
  nombre: string;
  telefono: string;
  onEliminar: () => void;
}

const ContactoItem: React.FC<ContactoItemProps> = ({ nombre, telefono, onEliminar }) => {
  return (
    <View style={styles.contactoContainer}>
      <View>
        <Text style={styles.contactoNombre}>{nombre}</Text>
        <Text style={styles.contactoTelefono}>{telefono}</Text>
      </View>
      <TouchableOpacity onPress={onEliminar} style={styles.botonEliminar}>
        <Text style={styles.botonEliminarTexto}>Eliminar</Text>
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
  botonEliminarTexto: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ContactoItem;
