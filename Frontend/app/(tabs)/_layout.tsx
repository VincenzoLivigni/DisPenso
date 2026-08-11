// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import Header from '../../components/Header';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        // Questa riga imposta il tuo Header personalizzato per tutti i tab
        header: (props) => <Header />, 
        tabBarActiveTintColor: '#007AFF',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'DisPenso Dashboard',
        }}
      />
      {/* Eventuali altri tab */}
      <Tabs.Screen name="prodotto/[id]" options={{ title: 'Dettaglio Prodotto' }} />
    </Tabs>
  );
}