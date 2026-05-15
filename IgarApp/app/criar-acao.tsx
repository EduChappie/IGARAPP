import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import * as ImagePicker from "expo-document-picker";

import {
  ActivityIndicator,
  Dimensions,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { G, Path, Rect } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";
import { acaoService, showSuccessAlert, showErrorAlert } from "@/src/services/firebase/firestoreService";
import { useAuth } from "@/src/contexts/AuthContext";

const { width } = Dimensions.get("window");

const NOME_MESES = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

// TODO: substitua pelo ID real do organizador logado (ex: vindo do contexto de auth)

export default function CriarAcaoScreen() {
  const router = useRouter();
  const { user } = useAuth();

  // Estados dos inputs
  const [titulo, setTitulo] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [horaInicio, setHoraInicio] = useState("");
  const [horaFim, setHoraFim] = useState("");
  const [voluntarios, setVoluntarios] = useState("");
  const [descricao, setDescricao] = useState("");
  const [loading, setLoading] = useState(false);

  // --- LÓGICA DAS METAS E ORIENTAÇÕES ---
  const [metas, setMetas] = useState<string[]>([]);
  const [metaInput, setMetaInput] = useState("");

  const adicionarMeta = () => {
    if (metaInput.trim() !== "") {
      setMetas([...metas, metaInput.trim()]);
      setMetaInput("");
    }
  };

  const removerMeta = (index: number) => {
    const novasMetas = [...metas];
    novasMetas.splice(index, 1);
    setMetas(novasMetas);
  };

  // --- LÓGICA DINÂMICA DO CALENDÁRIO ---
  const dataDeHoje = new Date();
  const [currentDate, setCurrentDate] = useState(new Date());
  const anoVisualizado = currentDate.getFullYear();
  const mesVisualizado = currentDate.getMonth();

  const [selectedDay, setSelectedDay] = useState(dataDeHoje.getDate());

  const diasNoMes = new Date(anoVisualizado, mesVisualizado + 1, 0).getDate();
  const arrayDias = Array.from({ length: diasNoMes }, (_, i) => i + 1);
  const primeiroDiaDoMes = new Date(anoVisualizado, mesVisualizado, 1).getDay();
  const offset = primeiroDiaDoMes === 0 ? 6 : primeiroDiaDoMes - 1;
  const espacosVazios = Array.from({ length: offset }, (_, i) => i);

  // --- FUNÇÃO DE SALVAR ---
  const handleCriarAcao = async () => {
    if (!titulo.trim() || !cidade.trim() || !estado.trim() || !horaInicio.trim() || !horaFim.trim()) {
      showErrorAlert("Preencha todos os campos obrigatórios: título, cidade, estado e horário.");
      return;
    }

    try {
      setLoading(true);

      const data = new Date(anoVisualizado, mesVisualizado, selectedDay);

      await acaoService.criarAcao({
        titulo: titulo.trim(),
        descricao: descricao.trim(),
        cidade: cidade.trim(),
        estado: estado.trim(),
        data,
        horaInicio: horaInicio.trim(),
        horaFim: horaFim.trim(),
        voluntariosNecessarios: parseInt(voluntarios) || 0,
        voluntariosInscritos: 0,
        ongId: user?.uid || "ID_ORGANIZADOR",
        imagens: [],
        metas,
        orientacoes: "",
      });

      showSuccessAlert("Ação criada com sucesso!");
      router.back();
    } catch (error) {
      showErrorAlert("Não foi possível criar a ação. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.mainContainer}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      {/* FUNDO COM GRADIENTE LINEAR */}
      <LinearGradient
        colors={["#044A60", "#012A36", "#012A36"]}
        locations={[0, 0.4, 1]}
        style={StyleSheet.absoluteFillObject}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <SafeAreaView>
          {/* HEADER */}
          <View style={styles.header}>
            <TopGlassButton onPress={() => router.back()} />
            <Text style={styles.headerTitle}>Criar Ação</Text>
          </View>

          <Text style={styles.descriptionHeader}>
            Preencha os dados abaixo para criar uma nova ação voluntária e
            engajar a comunidade.
          </Text>

          {/* INFORMAÇÕES BÁSICAS */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Título da ação</Text>
            <View style={styles.inputContainer}>
              <TextInput
                value={titulo}
                onChangeText={setTitulo}
                placeholder="Ex: Limpeza do Igarapé"
                placeholderTextColor="#FFFFFFB2"
                style={styles.textInput}
              />
            </View>
          </View>

          <View style={styles.rowInputs}>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>Cidade</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  value={cidade}
                  onChangeText={setCidade}
                  placeholder="Selecionar Cidade"
                  placeholderTextColor="#FFFFFFB2"
                  style={styles.textInput}
                />
              </View>
            </View>
            <View style={[styles.inputGroup, { flex: 1, marginLeft: 15 }]}>
              <Text style={styles.label}>Estado</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  value={estado}
                  onChangeText={setEstado}
                  placeholder="Selecionar Estado"
                  placeholderTextColor="#FFFFFFB2"
                  style={styles.textInput}
                />
              </View>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Horário do evento</Text>
            <View style={styles.timeRow}>
              <View style={[styles.inputContainer, { flex: 1 }]}>
                <TextInput
                  value={horaInicio}
                  onChangeText={setHoraInicio}
                  placeholder="XX:XX"
                  placeholderTextColor="#FFFFFFB2"
                  style={styles.textInput}
                />
              </View>
              <View style={styles.timeDash} />
              <View style={[styles.inputContainer, { flex: 1 }]}>
                <TextInput
                  value={horaFim}
                  onChangeText={setHoraFim}
                  placeholder="XX:XX"
                  placeholderTextColor="#FFFFFFB2"
                  style={styles.textInput}
                />
              </View>
            </View>
          </View>

          {/* CARD DE DATA */}
          <View style={styles.dateDisplayCard}>
            <LinearGradient
              colors={["#0083B1", "#05506B"]}
              style={styles.dateDisplayGradient}
            >
              <View style={styles.dateDisplayContent}>
                <View style={styles.dateIconTextRow}>
                  <CalendarIconWhite />
                  <Text style={styles.dateDisplayText}>
                    Escolha a data do evento
                  </Text>
                </View>
                <Text style={styles.dateBigNumber}>
                  {selectedDay < 10 ? `0${selectedDay}` : selectedDay}
                  <Text style={{ color: "#EEE82C" }}>
                    /
                    {mesVisualizado + 1 < 10
                      ? `0${mesVisualizado + 1}`
                      : mesVisualizado + 1}
                  </Text>
                </Text>
              </View>
            </LinearGradient>
          </View>

          {/* CALENDÁRIO DINÂMICO CONSERTADO */}
          <View style={styles.calendarContainer}>
            <View style={styles.calendarHeader}>
              <TouchableOpacity
                onPress={() =>
                  setCurrentDate(
                    new Date(anoVisualizado, mesVisualizado - 1, 1),
                  )
                }
                style={{ padding: 10 }}
              >
                <SetaBack />
              </TouchableOpacity>
              <Text style={styles.calendarMonthYear}>
                {NOME_MESES[mesVisualizado]} {anoVisualizado}
              </Text>
              <TouchableOpacity
                onPress={() =>
                  setCurrentDate(
                    new Date(anoVisualizado, mesVisualizado + 1, 1),
                  )
                }
                style={{ padding: 10 }}
              >
                <SetaFront />
              </TouchableOpacity>
            </View>
            <View style={styles.weekDaysRow}>
              {["Seg", "Ter", "Qua", "Qui", "Sex", "Sab", "Dom"].map((d) => (
                <Text key={d} style={styles.weekDayText}>
                  {d}
                </Text>
              ))}
            </View>
            <View style={styles.daysGrid}>
              {espacosVazios.map((_, i) => (
                <View key={`empty-${i}`} style={styles.dayCellContainer} />
              ))}
              {arrayDias.map((dia) => {
                const isSelected = selectedDay === dia;
                return (
                  <View key={dia} style={styles.dayCellContainer}>
                    <TouchableOpacity
                      onPress={() => setSelectedDay(dia)}
                      style={[
                        styles.dayCircle,
                        isSelected && styles.daySelected,
                      ]}
                    >
                      <Text
                        style={[
                          styles.dayText,
                          isSelected && { color: "#001A23", fontWeight: "600" },
                        ]}
                      >
                        {dia}
                      </Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          </View>

          {/* DESCRIÇÃO DO EVENTO */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Descrição do evento</Text>
            <View
              style={[
                styles.inputContainer,
                { height: 90, alignItems: "flex-start", paddingTop: 12 },
              ]}
            >
              <TextInput
                value={descricao}
                onChangeText={setDescricao}
                style={[styles.textInput, { textAlignVertical: "top" }]}
                multiline
                placeholder="Detalhes completos sobre a ação..."
                placeholderTextColor="#FFFFFFB2"
              />
            </View>
          </View>

          {/* ESTIMATIVA DE VOLUNTÁRIOS */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Estimativa de voluntários</Text>
            <View style={styles.inputContainer}>
              <TextInput
                value={voluntarios}
                onChangeText={setVoluntarios}
                placeholder="Qtd. de voluntários"
                placeholderTextColor="#FFFFFFB2"
                style={styles.textInput}
                keyboardType="numeric"
              />
            </View>
          </View>

          {/* METAS E ORIENTAÇÕES */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Metas e Orientações</Text>

            <View style={styles.metaInputRow}>
              <View style={[styles.inputContainer, { flex: 1 }]}>
                <TextInput
                  placeholder="Ex: Levar saco de lixo grande..."
                  placeholderTextColor="#FFFFFFB2"
                  value={metaInput}
                  onChangeText={setMetaInput}
                  style={styles.textInput}
                  onSubmitEditing={adicionarMeta}
                />
              </View>
              <TouchableOpacity
                onPress={adicionarMeta}
                style={styles.addMetaBtn}
              >
                <PlusIcon />
              </TouchableOpacity>
            </View>

            {metas.length > 0 && (
              <View style={styles.metasList}>
                {metas.map((meta, index) => (
                  <View key={index} style={styles.metaPill}>
                    <Text style={styles.metaPillText}>{meta}</Text>
                    <TouchableOpacity
                      onPress={() => removerMeta(index)}
                      style={styles.metaRemoveBtn}
                    >
                      <Ionicons
                        name="close-circle"
                        size={16}
                        color="rgba(255,255,255,0.5)"
                      />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* GALERIA DE UPLOAD */}
          <Text style={styles.label}>Galeria de imagens do evento</Text>
          <TouchableOpacity
            style={styles.uploadMainContainer}
            activeOpacity={0.8}
          >
            <View style={styles.uploadDashedArea}>
              <LinearGradient
                colors={["#004E69", "#003446"]}
                style={StyleSheet.absoluteFillObject}
              />
              <View style={styles.uploadContent}>
                <Text style={styles.uploadTitle}>
                  Faça o upload das imagens
                </Text>
                <View style={styles.uploadIconCircle}>
                  <UploadIconSVG />
                </View>
                <Text style={styles.uploadSub}>
                  Para melhores resultados, as dimensões devem ser 1080 x 1920
                  pixels no formato .PNG
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* BOTÃO CRIAR AÇÃO */}
          <TouchableOpacity
            style={[styles.saveButton, loading && { opacity: 0.7 }]}
            onPress={handleCriarAcao}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#001A23" />
            ) : (
              <Text style={styles.saveButtonText}>Criar Ação</Text>
            )}
          </TouchableOpacity>
        </SafeAreaView>
      </ScrollView>
    </View>
  );
}

// ==========================================
// COMPONENTES AUXILIARES E ÍCONES SVG
// ==========================================

const TopGlassButton = ({ onPress }: { onPress: () => void }) => (
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
        <Path
          d="M25 15 L 18 22 L 25 29"
          stroke="#001A23"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </G>
    </Svg>
  </TouchableOpacity>
);

const CalendarIconWhite = () => (
  <Svg width="14" height="14" viewBox="0 0 12 12" fill="none">
    <Path
      d="M3.375 1.5V2.625M8.625 1.5V2.625M1.5 9.375V3.75C1.5 3.12868 2.00368 2.625 2.625 2.625H9.375C9.99632 2.625 10.5 3.12868 10.5 3.75V9.375M1.5 9.375C1.5 9.99632 2.00368 10.5 2.625 10.5H9.375C9.99632 10.5 10.5 9.99632 10.5 9.375M1.5 9.375V5.625C1.5 5.00368 2.00368 4.5 2.625 4.5H9.375C9.99632 4.5 10.5 5.00368 10.5 5.625V9.375"
      stroke="white"
      strokeWidth="1"
      strokeLinecap="round"
    />
  </Svg>
);

const SetaBack = () => (
  <Svg width="10" height="18" viewBox="0 0 10 18" fill="none">
    <Path
      d="M9 1 L 1 9 L 9 17"
      stroke="#E8F1F2"
      strokeOpacity="0.8"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const SetaFront = () => (
  <Svg width="10" height="18" viewBox="0 0 10 18" fill="none">
    <Path
      d="M1 1 L 9 9 L 1 17"
      stroke="#E8F1F2"
      strokeOpacity="0.8"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const PlusIcon = () => (
  <Svg width="11" height="11" viewBox="0 0 11 11" fill="none">
    <Path
      d="M10.54 5.04H5.95V0.45C5.95 0.33 5.91 0.22 5.82 0.13C5.73 0.04 5.62 0 5.5 0C5.37 0 5.26 0.04 5.17 0.13C5.08 0.22 5.04 0.33 5.04 0.45V5.04H0.45C0.33 5.04 0.22 5.08 0.13 5.17C0.04 5.26 0 5.37 0 5.5C0 5.62 0.04 5.73 0.13 5.82C0.22 5.91 0.33 5.95 0.45 5.95H5.04V10.54C5.04 10.66 5.08 10.77 5.17 10.86C5.26 10.95 5.37 11 5.5 11C5.62 11 5.73 10.95 5.82 10.86C5.91 10.77 5.95 10.66 5.95 10.54V5.95H10.54C10.66 5.95 10.77 5.91 10.86 5.82C10.95 5.73 11 5.62 11 5.5C11 5.37 10.95 5.26 10.86 5.17C10.77 5.08 10.66 5.04 10.54 5.04Z"
      fill="#E8F1F2"
    />
  </Svg>
);

const UploadIconSVG = () => (
  <Svg width="23" height="23" viewBox="0 0 23 23" fill="none">
    <Path
      d="M12.98 0.81C12.73 0.55 12.42 0.34 12.09 0.21C11.75 0.07 11.39 0 11.03 0C10.66 0 10.3 0.07 9.97 0.21C9.63 0.34 9.33 0.55 9.07 0.81L6.11 3.77C5.95 3.94 5.87 4.17 5.87 4.41C5.88 4.64 5.97 4.87 6.14 5.04C6.31 5.2 6.54 5.3 6.77 5.31C7.01 5.31 7.24 5.23 7.41 5.07L10.11 2.37L10.1 16.59C10.1 16.84 10.2 17.07 10.37 17.24C10.55 17.42 10.78 17.51 11.03 17.51C11.27 17.51 11.51 17.42 11.68 17.24C11.85 17.07 11.95 16.84 11.95 16.59L11.96 2.39L14.64 5.07C14.81 5.24 15.05 5.34 15.29 5.34C15.54 5.34 15.77 5.24 15.94 5.07C16.12 4.89 16.21 4.66 16.21 4.41C16.21 4.17 16.12 3.94 15.94 3.76L12.98 0.81Z"
      fill="#E8F1F2"
    />
    <Path
      d="M21.2 14.75C20.96 14.75 20.72 14.84 20.55 15.02C20.38 15.19 20.28 15.42 20.28 15.67V19.36C20.28 19.6 20.18 19.84 20.01 20.01C19.84 20.18 19.6 20.28 19.36 20.28H2.76C2.52 20.28 2.28 20.18 2.11 20.01C1.94 19.84 1.84 19.6 1.84 19.36V15.67C1.84 15.42 1.74 15.19 1.57 15.02C1.4 14.84 1.16 14.75 0.92 14.75C0.67 14.75 0.44 14.84 0.27 15.02C0.09 15.19 0 15.42 0 15.67V19.36C0 20.09 0.29 20.79 0.81 21.31C1.32 21.83 2.03 22.12 2.76 22.12H19.36C20.09 22.12 20.79 21.83 21.31 21.31C21.83 20.79 22.12 20.09 22.12 19.36V15.67C22.12 15.42 22.03 15.19 21.85 15.02C21.68 14.84 21.45 14.75 21.2 14.75Z"
      fill="#E8F1F2"
    />
  </Svg>
);

// ==========================================
// ESTILOS
// ==========================================

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: "#001A23" },
  scrollContent: { paddingHorizontal: 24, paddingTop: 60, paddingBottom: 60 },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
    gap: 15,
  },
  topGlassButton: {
    width: 44,
    height: 44,
    borderRadius: 15,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: { color: "#E8F1F2", fontSize: 22, fontWeight: "300" },
  descriptionHeader: {
    color: "#E8F1F2B2",
    fontSize: 16,
    fontWeight: "300",
    lineHeight: 20,
    marginBottom: 35,
  },

  inputGroup: { marginBottom: 15 },
  label: {
    color: "#FFFFFFB2",
    fontSize: 12,
    fontWeight: "300",
    marginBottom: 5,
    marginLeft: 10,
  },
  inputContainer: {
    height: 47,
    backgroundColor: "#002C3B",
    borderRadius: 15,
    borderWidth: 0.7,
    borderColor: "rgba(255, 255, 255, 0.15)",
    paddingHorizontal: 15,
    justifyContent: "center",
  },
  textInput: { color: "#FFFFFF", fontSize: 12, fontWeight: "300", flex: 1 },
  rowInputs: { flexDirection: "row", justifyContent: "space-between" },
  timeRow: { flexDirection: "row", alignItems: "center" },
  timeDash: {
    width: 7,
    height: 2,
    backgroundColor: "#D9D9D966",
    marginHorizontal: 10,
  },

  dateDisplayCard: {
    height: 80,
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#FFFFFF33",
  },
  dateDisplayGradient: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  dateDisplayContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dateIconTextRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  dateDisplayText: { color: "#E8F1F2", fontSize: 14, fontWeight: "300" },
  dateBigNumber: { color: "#E8F1F2", fontSize: 25, fontWeight: "400" },

  calendarContainer: { marginBottom: 30 },
  calendarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  calendarMonthYear: { color: "#E8F1F2", fontSize: 18, fontWeight: "300" },
  weekDaysRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 15,
  },
  weekDayText: {
    color: "#E8F1F2B2",
    fontSize: 13,
    fontWeight: "300",
    width: 44,
    textAlign: "center",
  },
  daysGrid: { flexDirection: "row", flexWrap: "wrap" },
  dayCellContainer: {
    width: (width - 48) / 7,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  dayCircle: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: "center",
    alignItems: "center",
  },
  dayText: { color: "#E8F1F2", fontSize: 16, fontWeight: "300" },
  daySelected: { backgroundColor: "#EEE82C" },

  // ESTILOS DAS METAS E ORIENTAÇÕES
  metaInputRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  addMetaBtn: {
    width: 47,
    height: 47,
    backgroundColor: "#0083B1",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  metasList: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 12 },
  metaPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(145, 203, 62, 0.15)",
    borderWidth: 1,
    borderColor: "#91CB3E",
    paddingLeft: 14,
    paddingRight: 8,
    paddingVertical: 8,
    borderRadius: 20,
  },
  metaPillText: {
    color: "#E8F1F2",
    fontSize: 12,
    fontWeight: "300",
    marginRight: 8,
  },
  metaRemoveBtn: { padding: 2 },

  uploadMainContainer: {
    height: 186,
    borderRadius: 15,
    backgroundColor: "#002C3B",
    padding: 5,
    marginTop: 5,
  },
  uploadDashedArea: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#FFFFFF33",
    borderStyle: "dashed",
    overflow: "hidden",
  },
  uploadContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  uploadTitle: {
    color: "#E8F1F2",
    fontSize: 12,
    fontWeight: "300",
    marginBottom: 15,
  },
  uploadIconCircle: {
    width: 65,
    height: 65,
    borderRadius: 35,
    backgroundColor: "#05506B",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#FFFFFF33",
  },
  uploadSub: {
    color: "#E8F1F280",
    fontSize: 10,
    fontWeight: "300",
    textAlign: "center",
  },

  // BOTÃO SALVAR / CRIAR AÇÃO
  saveButton: {
    backgroundColor: "#EEE82C",
    height: 55,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  saveButtonText: { color: "#001A23", fontSize: 16, fontWeight: "bold" },
});