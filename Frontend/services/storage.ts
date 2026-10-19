import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Helper di supporto universale
export async function saveStorageItem(key: string, value: string) {
    if (Platform.OS === 'web') {
        localStorage.setItem(key, value);
    } else {
        // Usiamo AsyncStorage per evitare i limiti di dimensione di SecureStore
        await AsyncStorage.setItem(key, value);
    }
}

export async function getStorageItem(key: string) {
    if (Platform.OS === 'web') {
        return localStorage.getItem(key);
    }
    return await AsyncStorage.getItem(key);
}

export async function deleteStorageItem(key: string) {
    if (Platform.OS === 'web') {
        localStorage.removeItem(key);
    } else {
        await AsyncStorage.removeItem(key);
    }
}