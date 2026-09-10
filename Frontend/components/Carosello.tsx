import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { expirationBadge } from "../services/utils";
import { usePantry } from "../contexts/pantryContext";

const placeholder = require("../assets/placeholder.png");

export default function Carosello() {
  const router = useRouter();

  const { expiringProducts } = usePantry();

  return (
    <View style={styles.carosello}>
      <FlatList
        horizontal
        data={expiringProducts}
        keyExtractor={(item) => item.id.toString()}
        showsHorizontalScrollIndicator={true}
        renderItem={({ item }) => {
          const badge = expirationBadge(item.expiration_date);

          return (
            <View style={styles.card}>
              <Pressable
                style={styles.cardContent}
                onPress={() => router.push("/Dispense")}
              >
                <Image
                  source={
                    item.image_url ? { uri: item.image_url } : placeholder
                  }
                  style={styles.image}
                  resizeMode="cover"
                />

                <View style={styles.cardRight}>
                  <Text numberOfLines={1} style={styles.title}>
                    {item.name}
                  </Text>

                  <Text style={styles.info}>{item.quantity} pz</Text>

                  <View
                    style={[
                      styles.badge,
                      {
                        backgroundColor: badge.bg,
                        borderLeftColor: badge.border,
                        borderRightColor: badge.border,
                      },
                    ]}
                  >
                    <Text style={[styles.badgeText, { color: badge.color }]}>
                      {badge.text}
                    </Text>
                  </View>
                </View>
              </Pressable>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  carosello: {
    margin: 14,
  },
  card: {
    width: 150,
    backgroundColor: "white",
    marginRight: 10,
    padding: 8,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    width: 61,
    height: 61,
    backgroundColor: "#f3f3f3",
    borderRadius: 8,
  },
  cardRight: {
    marginLeft: 8,
    gap: 2,
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 12,
    fontWeight: 600,
    color: "#3baecb",
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  info: {
    fontSize: 11,
    color: "#6e6e6e",
    marginBottom: 4,
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: "flex-start",
    borderLeftWidth: 2,
    borderRightWidth: 2,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "700",
  },
});
