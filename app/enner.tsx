import { useRouter } from "expo-router";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function EnnerGodScreen() {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.replace("/home")}>
        <Text style={styles.backButtonText}>⬅ Volver</Text>
      </TouchableOpacity>

      <View style={styles.headerContainer}>
        <Text style={styles.godTitle}>España la Mejor</Text>
        <Text style={styles.godSubtitle}>El histórico Campeon👑</Text>
      </View>

      <View style={styles.memeCard}>
        <Image
          source={require("../assets/images/españa.png")}
          style={styles.memeImage}
        />
        <View style={styles.memeTextContainer}>
          <Text style={styles.memeQuote}>"Respeto a la campeona del mundo"</Text>
        </View>
      </View>

      <View style={styles.tributeCard}>
        <Text style={styles.cardTitle}>Simplemente el mejor campeon del Mundo</Text>
        <Text style={styles.tributeText}>
          España es la mejor selección del mundo. Su historia en el fútbol es una serie de logros increíbles.
        </Text>
        <Text style={styles.tributeText}>

        </Text>
      </View>

      <View style={styles.tributeCard}>
        <Text style={styles.cardTitle}>España demostrando ser el mejor</Text>
        <Text style={styles.tributeText}>
          España es la mejor selección del mundo. Su historia en el fútbol es una serie de logros increíbles.
        </Text>
        <Text style={styles.tributeText}>
        España es la campeona del mundo: historial de los Mundiales con campeones, subcampeones, terceros y cuartos
        </Text>
      </View>

        <View style={styles.tributeCard}>
        <Text style={styles.cardTitle}>Respeto al campeon</Text>
        <Text style={styles.tributeText}>
        Europa, con su decimotercer título
        </Text>
      </View>
      

      <Text style={styles.tributeFooter}>¡Gracias por tanto, España! 💙❤️</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#F4F6F9",
  },
  backButton: {
    marginTop: 40,
    marginBottom: 20,
    alignSelf: "flex-start",
  },
  backButtonText: {
    color: "#0033A0",
    fontSize: 16,
    fontWeight: "bold",
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  godTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#0033A0",
    textAlign: "center",
  },
  godSubtitle: {
    fontSize: 18,
    color: "#D52B1E",
    fontWeight: "600",
    marginTop: 5,
    textAlign: "center",
  },
  memeCard: {
    width: "100%",
    backgroundColor: "black",
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 25,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  memeImage: {
    width: "100%",
    height: 350,
    resizeMode: "cover",
  },
  memeTextContainer: {
    padding: 15,
    backgroundColor: "rgba(0,0,0,0.7)",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  memeQuote: {
    color: "white",
    fontSize: 14,
    fontStyle: "italic",
    textAlign: "center",
    fontWeight: "500",
  },
  tributeCard: {
    width: "100%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 15,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: "#FFD100",
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
    textAlign: "center",
  },
  tributeText: {
    fontSize: 16,
    color: "#444",
    marginBottom: 15,
    lineHeight: 24,
    textAlign: "justify",
  },
  tributeFooter: {
    marginTop: 20,
    marginBottom: 40,
    fontSize: 18,
    fontWeight: "bold",
    color: "#0033A0",
    textAlign: "center",
  },
});