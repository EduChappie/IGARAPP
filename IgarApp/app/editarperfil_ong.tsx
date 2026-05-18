// app/editarperfil_ong.tsx
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { G, Path, Rect } from "react-native-svg";
import {
  userService,
  showSuccessAlert,
  showErrorAlert,
} from "@/src/services/firebase/firestoreService";
import { useAuth } from "@/src/contexts/AuthContext";
import { uploadImagem } from "@/src/services/cloudnaryService";

export default function EditarPerfilOngScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const [razaoSocial, setRazaoSocial] = useState(user?.razaoSocial ?? "");
  const [descricaoOng, setDescricaoOng] = useState(user?.bio ?? "");
  const [endereco, setEndereco] = useState(
    user?.endereco
      ? `${user.endereco.rua} - ${user.endereco.numero}, ${user.endereco.cidade}, ${user.endereco.estado}`
      : "",
  );
  const [instagram, setInstagram] = useState(user?.insta ?? "");
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState("");

  // URIs locais para preview
  const [fotoLogoUri, setFotoLogoUri] = useState<string | null>(null);
  const [fotoCapaUri, setFotoCapaUri] = useState<string | null>(null);
  const [uploadandoLogo, setUploadandoLogo] = useState(false);
  const [uploadandoCapa, setUploadandoCapa] = useState(false);

  // ── Selecionar logo ──────────────────────────────────────────────────────
  const selecionarLogo = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permissão negada", "Precisamos acessar sua galeria.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setFotoLogoUri(result.assets[0].uri);
    }
  };

  // ── Selecionar capa ──────────────────────────────────────────────────────
  const selecionarCapa = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permissão negada", "Precisamos acessar sua galeria.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setFotoCapaUri(result.assets[0].uri);
    }
  };

  // ── Salvar ───────────────────────────────────────────────────────────────
  async function saveEdit() {
    if (!user?.uid) {
      showErrorAlert("Usuário não identificado. Faça login novamente.");
      return;
    }

    try {
      setLoading(true);

      let logoUrl: string | undefined;
      let capaUrl: string | undefined;

      if (fotoLogoUri) {
        setUploadandoLogo(true);
        const res = await uploadImagem(fotoLogoUri, "perfil");
        logoUrl = res.secure_url;
        setUploadandoLogo(false);
      }

      if (fotoCapaUri) {
        setUploadandoCapa(true);
        const res = await uploadImagem(fotoCapaUri, "perfil");
        capaUrl = res.secure_url;
        setUploadandoCapa(false);
      }

      await userService.salvarPerfil(user.uid, {
        razaoSocial: razaoSocial.trim(),
        bio: descricaoOng.trim(),
        insta: instagram.trim(),
        ...(logoUrl && { fotoPerfil: logoUrl }),
        ...(capaUrl && { fotoCapa: capaUrl }),
      });

      showSuccessAlert("Perfil atualizado com sucesso!");
      router.back();
    } catch (error) {
      console.error(error);
      showErrorAlert("Não foi possível salvar as alterações. Tente novamente.");
    } finally {
      setLoading(false);
      setUploadandoLogo(false);
      setUploadandoCapa(false);
    }
  }

  return (
    <LinearGradient
      colors={["#044A60", "#012A36", "#012A36"]}
      locations={[0, 0.3, 1]}
      style={styles.container}
    >
      <View style={styles.header}>
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
        <Text style={styles.headerTitle}>Editar Perfil (ONG)</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* BOTÕES DE IMAGEM */}
        <View style={styles.imageButtonsContainer}>
          {/* CAPA */}
          <TouchableOpacity
            style={styles.imageButton}
            onPress={selecionarCapa}
            activeOpacity={0.8}
          >
            {fotoCapaUri ? (
              <Image
                source={{ uri: fotoCapaUri }}
                style={StyleSheet.absoluteFillObject}
                borderRadius={16}
              />
            ) : null}
            {uploadandoCapa ? (
              <ActivityIndicator color="#A6FF00" />
            ) : (
              <>
                <Ionicons
                  name="image-outline"
                  size={20}
                  color="#A6FF00"
                  style={{ marginBottom: 8 }}
                />
                <Text style={styles.imageButtonText}>
                  {fotoCapaUri ? "Capa selecionada ✓" : "Alterar Capa"}
                </Text>
              </>
            )}
          </TouchableOpacity>

          {/* LOGO */}
          <TouchableOpacity
            style={styles.imageButton}
            onPress={selecionarLogo}
            activeOpacity={0.8}
          >
            {fotoLogoUri ? (
              <Image
                source={{ uri: fotoLogoUri }}
                style={StyleSheet.absoluteFillObject}
                borderRadius={16}
              />
            ) : null}
            {uploadandoLogo ? (
              <ActivityIndicator color="#A6FF00" />
            ) : (
              <>
                <Ionicons
                  name="camera-outline"
                  size={20}
                  color="#A6FF00"
                  style={{ marginBottom: 8 }}
                />
                <Text style={styles.imageButtonText}>
                  {fotoLogoUri ? "Logo selecionado ✓" : "Alterar Logo"}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* FORMULÁRIO */}
        <View style={styles.formContainer}>
          <Text style={styles.label}>Razão Social</Text>
          <TextInput
            placeholder="Nome da organização"
            placeholderTextColor="rgba(255,255,255,0.35)"
            value={razaoSocial}
            onChangeText={setRazaoSocial}
            style={[
              styles.inputField,
              focused === "razaoSocial" && styles.inputFieldFocused,
            ]}
            onFocus={() => setFocused("razaoSocial")}
            onBlur={() => setFocused("")}
          />

          <Text style={styles.label}>Endereço Completo</Text>
          <View
            style={[
              styles.inputWrapper,
              focused === "endereco" && styles.inputFieldFocused,
            ]}
          >
            <Ionicons
              name="location-outline"
              size={20}
              color="rgba(255,255,255,0.5)"
              style={{ marginRight: 8 }}
            />
            <TextInput
              placeholder="Rua, Número, Bairro, Cidade - UF"
              placeholderTextColor="rgba(255,255,255,0.35)"
              value={endereco}
              onChangeText={setEndereco}
              style={styles.inputInside}
              onFocus={() => setFocused("endereco")}
              onBlur={() => setFocused("")}
            />
          </View>

          <Text style={styles.label}>Descrição da ONG</Text>
          <TextInput
            placeholder="Missão e visão..."
            placeholderTextColor="rgba(255,255,255,0.35)"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            value={descricaoOng}
            onChangeText={setDescricaoOng}
            style={[
              styles.textArea,
              focused === "descricaoOng" && styles.inputFieldFocused,
            ]}
            onFocus={() => setFocused("descricaoOng")}
            onBlur={() => setFocused("")}
          />

          <Text style={styles.label}>Link do Instagram</Text>
          <View
            style={[
              styles.inputWrapper,
              focused === "insta" && styles.inputFieldFocused,
            ]}
          >
            <Ionicons
              name="link-outline"
              size={20}
              color="rgba(255,255,255,0.5)"
              style={{ marginRight: 8 }}
            />
            <TextInput
              placeholder="https://instagram.com/sua_ong"
              placeholderTextColor="rgba(255,255,255,0.35)"
              autoCapitalize="none"
              keyboardType="url"
              value={instagram}
              onChangeText={setInstagram}
              style={styles.inputInside}
              onFocus={() => setFocused("insta")}
              onBlur={() => setFocused("")}
            />
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.saveButton, loading && { opacity: 0.7 }]}
          onPress={saveEdit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#000" />
          ) : (
            <>
              <Text style={styles.saveButtonText}>Salvar alterações</Text>
              <Ionicons name="checkmark" size={20} color="#000" />
            </>
          )}
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
  },
  headerTitle: { color: "#FFF", fontSize: 18, fontWeight: "bold" },
  scrollContent: { paddingHorizontal: 24, paddingTop: 30, paddingBottom: 100 },
  imageButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 40,
  },
  imageButton: {
    flex: 0.48,
    height: 100,
    backgroundColor: "rgba(255,255,255,0.03)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  imageButtonText: { color: "rgba(255,255,255,0.7)", fontSize: 12 },
  formContainer: { flex: 1 },
  label: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 12,
    marginBottom: 8,
    marginLeft: 4,
  },
  inputField: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 50,
    color: "#FFF",
    marginBottom: 20,
  },
  inputFieldFocused: { borderColor: "#A6FF00" },
  textArea: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingTop: 16,
    height: 100,
    color: "#FFF",
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 50,
    marginBottom: 20,
  },
  inputInside: { flex: 1, color: "#FFF", height: "100%" },
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: "#012A36",
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.05)",
  },
  saveButton: {
    flexDirection: "row",
    backgroundColor: "#A6FF00",
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  saveButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 8,
  },
  topGlassButton: {
    width: 44,
    height: 44,
    borderRadius: 15,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
});
