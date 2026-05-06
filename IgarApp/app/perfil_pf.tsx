import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
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

  // --- NAVEGAÇÃO DE ABAS (NavBar) - Desliza sem pesar a memória ---
  const handleTabNav = (rota: string) => {
    setTimeout(() => {
      router.replace(rota as any);
    }, 50);
  };

  // --- NAVEGAÇÃO DE TELAS (Push) ---
  const handleNav = (rota: string) => {
    setTimeout(() => {
      router.push(rota as any);
    }, 50);
  };

  const acoesParticipadas = [
    {
      id: "1",
      titulo: "Igarapé do Mindú",
      local: "Manaus, Amazonas",
      nota: "5.0",
      imagem: require("../src/assets/image_card_1.png"),
    },
    {
      id: "2",
      titulo: "Praia da Ponta Negra",
      local: "Manaus, Amazonas",
      nota: "4.8",
      imagem: require("../src/assets/image_card_1.png"),
    },
  ];

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={["#044A60", "#012A36", "#012A36"]}
        locations={[0, 0.3, 1]}
        style={styles.container}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 150 }}
        >
          {/* HEADER DE AÇÕES (Sem botão de voltar) */}
          <View style={styles.headerTop}>
            <View style={{ width: 44 }} />
            <TopGlassButton
              onPress={() => console.log("Compartilhar clicado!")}
              icon={
                <G>
                  <Path
                    d="M16 22L28 15M16 22L28 29"
                    stroke="#001A23"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
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
              source={require("../src/assets/image_card_1.png")}
              style={styles.coverImage}
              imageStyle={{ borderRadius: 20 }}
            >
              {/* Botão de Editar Perfil */}
              <TouchableOpacity
                style={styles.editButtonOverlay}
                activeOpacity={0.7}
                onPress={() => handleNav("../editperfil_pf")}
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
            <TouchableOpacity style={styles.instagramLink} activeOpacity={0.7}>
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
                <TouchableOpacity
                  key={acao.id}
                  style={styles.actionCard}
                  activeOpacity={0.8}
                >
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

        {/* BOTTOM TAB BAR ADICIONADA AO PERFIL */}
        <View style={styles.tabBarWrapper}>
          <LinearGradient
            colors={["rgba(0, 26, 35, 0)", "#012A36"]}
            style={StyleSheet.absoluteFillObject}
          />
          <BlurView intensity={20} tint="dark" style={styles.tabBarContainer}>
            <TouchableOpacity
              style={styles.tabIcon}
              activeOpacity={0.6}
              onPress={() => handleTabNav("/home_user")}
            >
              <HomeIconInactive />
            </TouchableOpacity>

            <TouchableOpacity style={styles.tabIconActive} activeOpacity={1}>
              <UserIconActive />
            </TouchableOpacity>

            <TouchableOpacity style={styles.tabIcon} activeOpacity={0.6}>
              <FishNavIcon />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.tabIcon}
              activeOpacity={0.6}
              onPress={() => handleTabNav("/historico")}
            >
              <RefreshIcon />
            </TouchableOpacity>
          </BlurView>
        </View>
      </LinearGradient>
    </View>
  );
}

// ==========================================
// COMPONENTES AUXILIARES E ÍCONES SVG
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

const HomeIconInactive = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 10L12 3L21 10V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V10Z"
      fill="#E8F1F2"
      fillOpacity="0.7"
    />
  </Svg>
);

const UserIconActive = () => (
  <Svg width="15" height="20" viewBox="0 0 15 20" fill="none">
    <Path
      d="M7.5 10C10.2614 10 12.5 7.76142 12.5 5C12.5 2.23858 10.2614 0 7.5 0C4.73858 0 2.5 2.23858 2.5 5C2.5 7.76142 4.73858 10 7.5 10Z"
      fill="#EEE82C"
    />
    <Path
      d="M7.5 11.6659C3.35977 11.6705 0.00460937 15.0257 0 19.1659C0 19.6261 0.373086 19.9992 0.83332 19.9992H14.1666C14.6269 19.9992 15 19.6261 15 19.1659C14.9954 15.0257 11.6402 11.6705 7.5 11.6659Z"
      fill="#EEE82C"
    />
  </Svg>
);

const FishNavIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <Path
      d="M13.0121 0.047019C14.6454 -0.156607 16.7134 0.324674 18.1888 1.03657C18.875 1.34862 19.1452 2.29373 19.3883 2.98817C20.3374 5.69948 20.1715 8.5195 18.9637 11.1296C17.8607 13.4992 15.9077 15.3153 13.5311 16.1813C11.0277 17.1156 8.26993 16.9484 5.88605 15.7179C5.88163 15.8367 5.86442 15.9614 5.84833 16.0793C5.70853 17.1049 5.65187 18.1405 5.52906 19.1677C5.51506 19.2847 5.47217 19.4741 5.42081 19.5742C5.32184 19.7638 5.15424 19.9036 4.95577 19.9623C4.70396 20.0384 4.56267 19.9951 4.3488 19.8698C4.13128 19.6953 3.87336 19.4109 3.67497 19.2031L2.61816 18.0963L0.979161 16.3822C0.737662 16.1262 0.354518 15.7815 0.163908 15.4973C-0.248379 14.8825 0.171496 14.2912 0.819234 14.2345C2.00826 14.1305 3.16814 13.9828 4.34022 13.8192C4.21351 12.9204 4.0483 11.9451 3.99123 11.0369C3.88684 9.37522 4.16009 7.59675 4.80079 6.07254C4.91835 5.79286 5.1634 5.41589 5.31043 5.10522C4.8095 5.0027 4.32675 4.85234 3.81307 4.80199C2.94613 4.71698 2.33141 5.04398 2.01598 3.94206C2.06577 3.70971 2.1411 3.57646 2.29146 3.40095C3.49363 1.99761 5.65222 1.06062 7.46122 1.12921C7.76089 1.15329 8.2252 1.14344 8.50343 1.21355C9.01062 1.34139 8.84561 1.38659 9.30153 1.10346C9.62636 0.901734 10.0603 0.726712 10.425 0.595244C11.2619 0.299038 12.1311 0.114856 13.0121 0.047019Z"
      fill="#E8F1F2"
    />
  </Svg>
);

const RefreshIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <Path
      d="M19.1567 9.16667C18.9357 9.16667 18.7237 9.25447 18.5674 9.41074C18.4111 9.56703 18.3233 9.77899 18.3233 10C18.3301 11.9377 17.6637 13.8177 16.4379 15.3185C15.2122 16.8193 13.5033 17.8478 11.6032 18.2282C9.70321 18.6086 7.73004 18.3173 6.02099 17.4041C4.31194 16.4908 2.97312 15.0124 2.23336 13.2214C1.49361 11.4304 1.39884 9.43811 1.96527 7.58501C2.53169 5.7319 3.72414 4.13305 5.33879 3.06173C6.95345 1.9904 8.89006 1.51313 10.8176 1.71148C12.7452 1.90982 14.544 2.77148 15.9067 4.14917C15.8793 4.15664 15.8514 4.16249 15.8233 4.16667H13.3233C13.1023 4.16667 12.8904 4.25446 12.7341 4.41074C12.5778 4.56703 12.49 4.77899 12.49 5C12.49 5.22101 12.5778 5.43298 12.7341 5.58926C12.8904 5.74554 13.1023 5.83333 13.3233 5.83333H15.8233C16.4864 5.83333 17.1223 5.56994 17.5911 5.1011C18.0599 4.63226 18.3233 3.99637 18.3233 3.33333V0.833333C18.3233 0.61232 18.2355 0.400358 18.0793 0.244078C17.923 0.0877974 17.711 0 17.49 0C17.269 0 17.057 0.0877974 16.9007 0.244078C16.7445 0.400358 16.6567 0.61232 16.6567 0.833333V2.55417C14.9505 1.02878 12.7724 0.135139 10.4865 0.0225855C8.20065 -0.0899677 5.94538 0.585381 4.09757 1.93578C2.24976 3.28618 0.921366 5.22982 0.334358 7.44192C-0.25265 9.65402 -0.0627097 12.0006 0.87244 14.0895C1.80759 16.1784 3.4313 17.883 5.47224 18.9187C7.51318 19.9543 9.84772 20.2581 12.0857 19.7794C14.3238 19.3006 16.3297 18.0683 17.7684 16.2884C19.207 14.5084 19.9913 12.2887 19.99 10C19.99 9.77899 19.9022 9.56703 19.7459 9.41074C19.5896 9.25447 19.3777 9.16667 19.1567 9.16667Z"
      fill="#E8F1F2"
    />
    <Path
      d="M8.7377 6C8.54205 6 8.35442 6.07772 8.21607 6.21607C8.07772 6.35442 8 6.54205 8 6.73771V10.4262C8.00004 10.6219 8.07779 10.8095 8.21615 10.9478L10.4293 13.1609C10.5684 13.2953 10.7547 13.3696 10.9482 13.368C11.1416 13.3663 11.3266 13.2887 11.4634 13.1519C11.6002 13.0151 11.6778 12.8301 11.6794 12.6367C11.6811 12.4433 11.6068 12.2569 11.4724 12.1178L9.47541 10.1208V6.73771C9.47541 6.54205 9.39769 6.35442 9.25934 6.21607C9.12099 6.07772 8.93336 6 8.7377 6Z"
      fill="#E8F1F2"
    />
  </Svg>
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
  tabBarWrapper: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 120,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: Platform.OS === "ios" ? 30 : 20,
  },
  tabBarContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(0, 44, 59, 0.4)",
    borderRadius: 999,
    height: 63,
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 6,
    paddingVertical: 4,
    width: 258,
    borderWidth: 0.7,
    borderColor: "rgba(255, 255, 255, 0.15)",
    overflow: "hidden",
  },
  tabIcon: {
    width: 54,
    height: 55,
    justifyContent: "center",
    alignItems: "center",
  },
  tabIconActive: {
    width: 54,
    height: 55,
    justifyContent: "center",
    alignItems: "center",
    borderTopWidth: 2,
    borderTopColor: "rgba(0, 0, 0, 0.25)",
  },
});
