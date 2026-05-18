// app/perfil_ong.tsx
// Exibe fotoPerfil e fotoCapa vindas do Firestore (salvas pelo editarperfil_ong.tsx)

import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  Image,
  ImageBackground,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Circle, G, Path, Rect } from "react-native-svg";
import { useAuth } from "@/src/contexts/AuthContext";
import { acaoService } from "@/src/services/firebase/firestoreService";

// Imagens padrão usadas quando a ONG não tem foto cadastrada
const FOTO_CAPA_PADRAO = require("../src/assets/image_card_1.png");
const FOTO_PERFIL_PADRAO = require("../src/assets/image_card_1.png");

export default function PerfilOngScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();

  const [isLogoutModalVisible, setLogoutModalVisible] = useState(false);

  const handleNav = (rota: string) => {
    setTimeout(() => {
      router.push(rota as any);
    }, 50);
  };

  const carregarAcoesRecentes = async () => {
    if (!user?.uid) return; // 👈 evita chamar com uid nulo

    try {
      const acoes = await acaoService.getAcoesPorOng(user.uid);

      const dadosFormatados = acoes.map(acao => ({
        id: acao.id || '',
        titulo: acao.titulo,
        local: `${acao.cidade}, ${acao.estado}`,
        nota: '5.0',
        imagem: acao.imagens?.[0] || FOTO_PERFIL_PADRAO,
      }));
      
      setAcoesRecentes(dadosFormatados);
    } catch (error) {
      console.log('Erro ao carregar ações:', error);
    }
  };

  // ── Resolve fonte da foto de capa ────────────────────────────────────────────
  // user?.fotoCapa vem do Firestore após o editarperfil_ong salvar a URL do Cloudinary.
  // Se existir, usa { uri: "https://res.cloudinary.com/..." }
  // Se não, usa a imagem local padrão.
  const fotoCapa = (user as any)?.fotoCapa
    ? { uri: (user as any).fotoCapa }
    : FOTO_CAPA_PADRAO;

  // ── Resolve fonte da foto de perfil (logo) ───────────────────────────────────
  const fotoPerfil = (user as any)?.fotoPerfil
    ? { uri: (user as any).fotoPerfil }
    : FOTO_PERFIL_PADRAO;

  interface AcaoRecente {
    id: string;
    titulo: string;
    local: string;
    nota: string;
    imagem: any;
  }
  
  const [acoesIncentivadas, setAcoesRecentes] = useState<AcaoRecente[]>([]);

  useEffect(() => {
      if (user?.uid) {
        carregarAcoesRecentes();
      }
    }, [user]);

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
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Perfil da ONG</Text>
          </View>

          {/* ÁREA DA CAPA E LOGO */}
          <View style={styles.coverContainer}>
            {/*
              fotoCapa já é { uri: "..." } ou require(...).
              ImageBackground aceita os dois formatos sem mudança.
            */}
            <ImageBackground
              source={fotoCapa}
              style={styles.coverImage}
              imageStyle={{ borderRadius: 20 }}
            >
              {/* Botão Compartilhar */}
              <View style={{ position: "absolute", top: 12, right: 12 }}>
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

              {/* Botão Editar Perfil */}
              <TouchableOpacity
                style={styles.editButtonOverlay}
                activeOpacity={0.7}
                onPress={() => handleNav("/editarperfil_ong")}
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

            {/* Logo da ONG sobrepondo a capa */}
            <View style={styles.profileImageWrapper}>
              <Image source={fotoPerfil} style={styles.profileImage} />
            </View>
          </View>

          {/* INFORMAÇÕES DO PERFIL */}
          <View style={styles.infoContainer}>
            <Text style={styles.accountType}>Conta ONG</Text>
            <Text style={styles.profileName}>{user?.razaoSocial}</Text>

            {user?.endereco && (
              <View style={styles.locationRow}>
                <Ionicons
                  name="location-outline"
                  size={16}
                  color="#A6FF00"
                  style={{ marginRight: 6 }}
                />
                <Text style={styles.locationText}>
                  {user.endereco.bairro}, {user.endereco.rua},{" "}
                  {user.endereco.numero} - {user.endereco.cidade},{" "}
                  {user.endereco.estado}
                </Text>
              </View>
            )}

            <Text style={styles.bioText}>
              {user?.bio || "Sem descrição ainda."}
            </Text>

            {user?.insta ? (
              <TouchableOpacity style={styles.instagramLink} activeOpacity={0.7}>
                <Ionicons
                  name="logo-instagram"
                  size={18}
                  color="#A6FF00"
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.instagramText}>{user.insta}</Text>
              </TouchableOpacity>
            ) : null}
          </View>

          {/* CARROSSEL DE AÇÕES */}
          <View style={styles.actionsContainer}>
            <Text style={styles.sectionTitle}>Ações incentivadas</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingLeft: 24, paddingRight: 8 }}
            >
              {acoesIncentivadas.map((acao) => (
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

          {/* BOTÃO LOGOUT */}
          <TouchableOpacity
            style={styles.logoutButton}
            activeOpacity={0.7}
            onPress={() => setLogoutModalVisible(true)}
          >
            <Ionicons
              name="log-out-outline"
              size={20}
              color="#FF3B30"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.logoutButtonText}>Sair da conta</Text>
          </TouchableOpacity>
        </ScrollView>
      </LinearGradient>

      {/* MODAL DE LOGOUT */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isLogoutModalVisible}
        onRequestClose={() => setLogoutModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalIconContainer}>
              <Ionicons name="log-out-outline" size={32} color="#FF3B30" />
            </View>
            <Text style={styles.modalTitle}>Sair da conta</Text>
            <Text style={styles.modalText}>
              Tem certeza que deseja sair do IgarApp?
            </Text>
            <View style={styles.modalButtonsRow}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                activeOpacity={0.7}
                onPress={() => setLogoutModalVisible(false)}
              >
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalConfirmButton}
                activeOpacity={0.7}
                // Depois — aguarda o signOut completar antes de navegar
                onPress={async () => {
                  try {
                    setLogoutModalVisible(false);
                    await signOut();
                    router.replace("/login_pl");
                  } catch (error) {
                    console.error("Falha ao deslogar:", error);
                  }
                }}
              >
                <Text style={styles.modalConfirmText}>Sair</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// ── Componente auxiliar ────────────────────────────────────────────────────────

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
  header: {
    paddingHorizontal: 24,
    marginTop: 65,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "#E8F1F2",
  },
  coverContainer: {
    paddingHorizontal: 24,
    marginTop: Platform.OS === "ios" ? 20 : 10,
    marginBottom: 50,
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
  topGlassButton: {
    width: 44,
    height: 44,
    borderRadius: 15,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
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
    overflow: "hidden",
  },
  profileImage: { width: "100%", height: "100%", borderRadius: 40 },
  infoContainer: { paddingHorizontal: 24, marginBottom: 30 },
  accountType: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 12,
    marginBottom: 4,
  },
  profileName: {
    color: "#FFF",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  locationText: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 14,
    flex: 1,
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
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 24,
    marginTop: 35,
    height: 55,
    borderRadius: 16,
    backgroundColor: "rgba(255, 59, 48, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(255, 59, 48, 0.3)",
  },
  logoutButtonText: {
    color: "#FF3B30",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 26, 35, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  modalContent: {
    backgroundColor: "#002C3B",
    width: "100%",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  modalIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(255, 59, 48, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#E8F1F2",
    marginBottom: 8,
  },
  modalText: {
    fontSize: 14,
    color: "rgba(232, 241, 242, 0.7)",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 20,
  },
  modalButtonsRow: { flexDirection: "row", width: "100%", gap: 12 },
  modalCancelButton: {
    flex: 1,
    height: 50,
    borderRadius: 14,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCancelText: { color: "#E8F1F2", fontSize: 16, fontWeight: "600" },
  modalConfirmButton: {
    flex: 1,
    height: 50,
    borderRadius: 14,
    backgroundColor: "rgba(255, 59, 48, 0.2)",
    borderWidth: 1,
    borderColor: "rgba(255, 59, 48, 0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalConfirmText: { color: "#FF3B30", fontSize: 16, fontWeight: "600" },
});