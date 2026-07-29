import { useRouter } from "expo-router";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={require("../assets/images/españa.png")}
        style={styles.logo}
      />

      <Text style={styles.title}>ESPAÑA CAMPEON DEL MUNDO</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Subcampeon</Text>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>SUBCAMPEON DEL MUNDO: </Text>
          <Text style={styles.infoValue}>La Albiceleste </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>⚽ Argentina subcampeón del Mundial
Argentina terminó el Mundial 2026 como subcampeón, perdiendo 1-0 ante España en la final. El partido se definió en el segundo tiempo suplementario, y el único gol fue anotado por Ferran Torres. La Selección Argentina, bajo la dirección de Lionel Scaloni, logró superar a Inglaterra en semifinales, pero no pudo defender el título obtenido en el Mundial anterior. La derrota fue dolorosa, pero también marcó un nuevo capítulo en la historia del fútbol argentino, ya que aseguró la clasificación del país para el Mundial 2030</Text>
          <Text style={styles.infoValue}>SUBCAMPEON</Text>
        </View>

        <TouchableOpacity 
          style={styles.ennerButton} 
          onPress={() => router.replace("/enner")}
        >
          <Text style={styles.ennerButtonText}>🔍 El Debate: España es el mejor Equipo?</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.acercaButton} 
          onPress={() => router.replace("/acerca")}
        >
          <Text style={styles.ennerButtonText}>🔍 Acerca del estudiante</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.footer}>¡Orgullo Español! 💙❤️</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    padding: 24,
    backgroundColor: "#F4F6F9",
  },
  logo: {
    width: 140,
    height: 140,
    resizeMode: "contain",
    marginTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#0033A0",
    marginVertical: 20,
  },
  card: {
    width: "100%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
    paddingBottom: 5,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between", 
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
    flex: 1,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111",
    flex: 1,
    textAlign: "right",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0033A0",
    marginTop: 15,
    marginBottom: 5,
  },
  mundialesText: {
    fontSize: 16,
    color: "#444",
    fontWeight: "500",
    letterSpacing: 1,
  },
  ennerButton: {
    backgroundColor: "#174c85",
    padding: 12,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
  },
  acercaButton: {
    backgroundColor: "#f1f3f5",
    padding: 12,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
  },
  ennerButtonText: {
    color: "#8c9dc2",
    fontWeight: "bold",
    fontSize: 14,
  },
  footer: {
    marginTop: 40,
    fontSize: 16,
    fontWeight: "bold",
    color: "#18288c",
  },
});