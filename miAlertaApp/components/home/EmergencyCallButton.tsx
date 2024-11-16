import { Linking } from 'react-native';
import { GestureResponderEvent } from 'react-native';


export const PoliciaCall = () => {

    const handlePoliceCall = async (_: GestureResponderEvent) => {
        const phoneNumber = '911';
        try {
            const url = `tel:${phoneNumber}`;
            await Linking.openURL(url);
        } catch (error) {
            console.error("Error al intentar realizar la llamada", error);
        }
    };

    return {
        handlePoliceCall
    };
};


export const BomberosCall = () => {

    const handleBomberosCall = async (_: GestureResponderEvent) => {
        const phoneNumber = '100';
        try {
            const url = `tel:${phoneNumber}`;
            await Linking.openURL(url);
        } catch (error) {
            console.error("Error al intentar realizar la llamada", error);
        }
    };

    return {
        handleBomberosCall
    };
};


export const AmbulanciaCall = () => {

    const handleAmbulanciaCall = async (_: GestureResponderEvent) => {
        const phoneNumber = '107';
        try {
            const url = `tel:${phoneNumber}`;
            await Linking.openURL(url);
        } catch (error) {
            console.error("Error al intentar realizar la llamada", error);
        }
    };

    return {
        handleAmbulanciaCall
    };
};