import { StatusBar } from 'expo-status-bar';
import "./global.css";
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <>
    <View style = {styles.container}>
    <Text className='font-bold color-green-800 text-2xl'> budino cioccolato </Text>
    </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
