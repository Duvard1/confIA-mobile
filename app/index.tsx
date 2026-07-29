import { useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, Image, StyleSheet, Text, View } from "react-native";

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/home");
    }, 3000);

    return () => clearTimeout(timer);
  }, []);s

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/españa.png")}
        style={styles.logo}
      />

      <Text style={styles.title}>Selección Española</Text>
      <Text style={styles.subtitle}>¡La España de mi corazón! 🇪🇸</Text>
      
      <ActivityIndicator size="large" color="#cfd1d6" style={{ marginTop: 30 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#18288c",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: "contain",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#cfd1d6", 
    marginTop: 25,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#cbcfdc",
    marginTop: 10,
  },
});