import { Tabs } from "expo-router";
import { View, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import Header from "../../components/Header";

import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Entypo from "@expo/vector-icons/Entypo";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        header: () => <Header />,
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#3BAFCB",
        tabBarInactiveTintColor: "#8E8E93",
        tabBarStyle: styles.tabBarStyle
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "home-sharp" : "home-outline"} color={color} size={24} />
          )
        }}
      />

      <Tabs.Screen name="Dispense"
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="shelves" size={24} color={color} />
          )
        }} />

      <Tabs.Screen name="Barcode"
        options={{
          tabBarIcon: () => (
            <View>
              <LinearGradient
                colors={["rgba(59, 175, 203, 1)", "rgba(71, 179, 161, 1)", "rgba(99, 190, 63, 1)"]}
                locations={[0, 0.5, 1]}
                start={{ x: 0.2, y: 1 }}
                end={{ x: 0.8, y: 0 }}
                style={styles.barcode}
              >
                <MaterialCommunityIcons name="barcode-scan" size={38} color="white" />
              </LinearGradient>
            </View>

          )
        }} />

      <Tabs.Screen name="Ricette"
        options={{
          tabBarIcon: ({ color }) => (
            <Entypo name="book" size={24} color={color} />
          )
        }} />

      <Tabs.Screen name="Impostazioni"
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="settings-sharp" size={24} color={color} />
          )
        }} />
    </Tabs >
  );
}


const styles = StyleSheet.create({
  tabBarStyle: {
    height: 70,
    backgroundColor: "white",
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "black",
    shadowOpacity: 0.075,
    shadowRadius: 4,
    shadowOffset: {
      width: 0,
      height: -2
    }
  },
  barcode: {
    width: 70,
    height: 70,
    borderRadius: 40,
    marginBottom: 65,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#3baecb",
    shadowOpacity: 0.4,
    shadowRadius: 4,
    shadowOffset: {
      width: 0,
      height: 4
    }
  }
})