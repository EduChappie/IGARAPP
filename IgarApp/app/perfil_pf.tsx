import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import {
  Image,
  ImageBackground,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Circle, G, Path, Rect } from "react-native-svg";

export default function PerfilScreen() {
  const router = useRouter();

  // Mock de dados para o carrossel de ações
  const acoesParticipadas = [
    {
      id: "1",
      titulo: "Igarapé do Mindú",
      local: "Manaus, Amazonas",
      nota: "5.0",
      imagem: require("../src/assets/Igarape.png"),
    },
    {
      id: "2",
      titulo: "Praia da Ponta Negra",
      local: "Manaus, Amazonas",
      nota: "4.8",
      imagem: require("../src/assets/Igarape.png"),
    },
  ];

  return (
    <LinearGradient
      colors={["#044A60", "#012A36", "#012A36"]}
      locations={[0, 0.3, 1]}
      style={styles.container}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* HEADER DE AÇÕES (Voltar e Compartilhar - AGORA PADRONIZADOS) */}
        <View style={styles.headerTop}>
          <TopGlassButton
            onPress={() => router.back()}
            icon={
              <Path
                d="M25 15 L 18 22 L 25 29"
                stroke="#001A23"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            }
          />
          <TopGlassButton
            onPress={() => console.log("Compartilhar clicado!")}
            icon={
              <G>
                {/* Linhas de conexão do ícone compartilhar */}
                <Path
                  d="M16 22L28 15M16 22L28 29"
                  stroke="#001A23"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                {/* Círculos vazados */}
                <Circle
                  cx="15"
                  cy="22"
                  r="3.5"
                  fill="#EEE82C"
                  stroke="#001A23"
                  strokeWidth="2.5"
                />
                <Circle
                  cx="29"
                  cy="15"
                  r="3.5"
                  fill="#EEE82C"
                  stroke="#001A23"
                  strokeWidth="2.5"
                />
                <Circle
                  cx="29"
                  cy="29"
                  r="3.5"
                  fill="#EEE82C"
                  stroke="#001A23"
                  strokeWidth="2.5"
                />
              </G>
            }
          />
        </View>

        {/* ÁREA DA CAPA E FOTO DE PERFIL */}
        <View style={styles.coverContainer}>
          <ImageBackground
            source={require("../src/assets/Igarape.png")}
            style={styles.coverImage}
            imageStyle={{ borderRadius: 20 }}
          >
            {/* Botão de Editar Perfil sobre a capa */}
            <TouchableOpacity
              style={styles.editButtonOverlay}
              onPress={() => router.push("/editperfil_pf")}
            >
              <Ionicons
                name="pencil"
                size={14}
                color="#FFF"
                style={{ marginRight: 6 }}
              />
              <Text style={styles.editButtonText}>Editar perfil</Text>
            </TouchableOpacity>
          </ImageBackground>

          {/* Foto de perfil sobrepondo a capa */}
          <View style={styles.profileImageWrapper}>
            <Image
              source={require("../src/components/icons/Logos tela inicial.svg")}
              style={styles.profileImage}
            />
          </View>
        </View>

        {/* INFORMAÇÕES DO PERFIL */}
        <View style={styles.infoContainer}>
          {/* Tag de Especialista */}
          <View style={styles.tagContainer}>
            <Ionicons name="ribbon" size={14} color="#012A36" />
            <Text style={styles.tagText}>IgarApp Expert</Text>
          </View>

          <Text style={styles.accountType}>Conta ONG</Text>
          <Text style={styles.profileName}>Nome do Usuário</Text>

          <Text style={styles.bioText}>
            Apaixonado pela preservação da Amazônia. Trabalhando todos os dias
            para garantir que nossos igarapés voltem a ser fontes de vida e
            orgulho para Manaus.
          </Text>

          {/* Link do Instagram */}
          <TouchableOpacity style={styles.instagramLink}>
            <Ionicons
              name="logo-instagram"
              size={18}
              color="#A6FF00"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.instagramText}>@usuario_igarapp</Text>
          </TouchableOpacity>
        </View>

        {/* CARROSSEL DE AÇÕES */}
        <View style={styles.actionsContainer}>
          <Text style={styles.sectionTitle}>Ações que participou</Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingLeft: 24, paddingRight: 8 }}
          >
            {acoesParticipadas.map((acao) => (
              <TouchableOpacity key={acao.id} style={styles.actionCard}>
                <ImageBackground
                  source={acao.imagem}
                  style={styles.actionImage}
                  imageStyle={{ borderRadius: 16 }}
                >
                  <LinearGradient
                    colors={["transparent", "rgba(1, 42, 54, 0.9)"]}
                    locations={[0.4, 1]}
                    style={styles.actionGradient}
                  >
                    <Text style={styles.actionTitle}>{acao.titulo}</Text>
                    <View style={styles.actionLocationRow}>
                      <Text style={styles.actionLocation}>{acao.local}</Text>
                      <View style={styles.ratingContainer}>
                        <Ionicons name="star" size={12} color="#A6FF00" />
                        <Text style={styles.ratingText}>{acao.nota}</Text>
                      </View>
                    </View>
                  </LinearGradient>
                </ImageBackground>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

// ==========================================
// COMPONENTE DO BOTÃO PADRÃO (VIDRO + AMARELO)
// ==========================================
const TopGlassButton = ({
  icon,
  onPress,
}: {
  icon: any;
  onPress: () => void;
}) => (
  <TouchableOpacity
    style={styles.topGlassButton}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View
      style={{
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0, 44, 59, 0.4)",
      }}
    />
    <Svg width="44" height="44" viewBox="0 0 44 44" fill="none">
      <Rect
        x="0.35"
        y="0.35"
        width="43.3"
        height="43.3"
        rx="14.65"
        stroke="white"
        strokeOpacity="0.15"
        strokeWidth="0.7"
      />
      <G>
        <Rect x="2.5" y="2.5" width="39" height="39" rx="15" fill="#EEE82C" />
        <Rect
          x="3"
          y="3"
          width="38"
          height="38"
          rx="14.5"
          stroke="#001A23"
          strokeOpacity="0.4"
        />
        {icon}
      </G>
    </Svg>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: Platform.OS === "ios" ? 50 : 60,
    paddingBottom: 20,
  },
  topGlassButton: {
    width: 44,
    height: 44,
    borderRadius: 15,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  coverContainer: {
    paddingHorizontal: 24,
    marginBottom: 40,
    width: "100%",
    alignItems: "center",
  },
  coverImage: {
    width: 350,
    height: 180,
    justifyContent: "flex-end",
    alignItems: "flex-end",
    padding: 12,
  },
  editButtonOverlay: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(1, 42, 54, 0.6)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  editButtonText: { color: "#FFF", fontSize: 12, fontWeight: "500" },
  profileImageWrapper: {
    position: "absolute",
    bottom: -30,
    left: 44,
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: "#012A36",
    backgroundColor: "#012A36",
  },
  profileImage: { width: "100%", height: "100%", borderRadius: 40 },
  infoContainer: { paddingHorizontal: 24, marginBottom: 30 },
  tagContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#A6FF00",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 12,
  },
  tagText: {
    color: "#012A36",
    fontSize: 12,
    fontWeight: "bold",
    marginLeft: 4,
  },
  accountType: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 12,
    marginBottom: 4,
  },
  profileName: {
    color: "#FFF",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  bioText: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  instagramLink: { flexDirection: "row", alignItems: "center" },
  instagramText: { color: "#A6FF00", fontSize: 14, fontWeight: "500" },
  actionsContainer: { marginTop: 0 },
  sectionTitle: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  actionCard: { width: 260, height: 160, marginRight: 16, borderRadius: 16 },
  actionImage: { width: "100%", height: "100%" },
  actionGradient: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 16,
    borderRadius: 16,
  },
  actionTitle: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  actionLocationRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  actionLocation: { color: "rgba(255,255,255,0.7)", fontSize: 12 },
  ratingContainer: { flexDirection: "row", alignItems: "center" },
  ratingText: {
    color: "#FFF",
    fontSize: 12,
    marginLeft: 4,
    fontWeight: "bold",
  },
});
