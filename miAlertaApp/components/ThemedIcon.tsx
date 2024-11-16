import React from 'react';
import { useColorScheme } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

interface ThemedIconProps {
    name: React.ComponentProps<typeof Ionicons>['name'];
    size: number; // Define el tipo como number
  }
  
  const ThemedIcon: React.FC<ThemedIconProps> = ({ name, size }) => {
  const colorScheme = useColorScheme();
  const iconColor = colorScheme === 'dark' ? '#FFFFFF' : '#000000'; // Blanco en modo oscuro, negro en modo claro

  return <Ionicons name={name} size={size} color={iconColor} />;
};

export default ThemedIcon;