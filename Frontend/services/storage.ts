import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

// Helper di supporto universale per test web e mobile
export async function saveStorageItem(key: string, value: string) {
    if (Platform.OS === 'web') {
        localStorage.setItem(key, value)
    } else {
        await SecureStore.setItemAsync(key, value)
    }
}

export async function getStorageItem(key: string) {
    if (Platform.OS === 'web') {
        return localStorage.getItem(key)
    }
    return await SecureStore.getItemAsync(key)
}

export async function deleteStorageItem(key: string) {
    if (Platform.OS === 'web') {
        localStorage.removeItem(key)
    } else {
        await SecureStore.deleteItemAsync(key)
    }
}