import React, { useState } from "react";
import { 
    Image, 
    TextInput, 
    TouchableOpacity, 
    View, 
    Text, 
    StyleSheet // <-- Adicionado para o botão
} from "react-native";
import { styles, extra } from "@/styles/_style";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { cadastroExtra } from "@/styles/cadastro_extra_styles";
import { cadastroTwoExtra } from "@/styles/cadastro_two_extra_styles";
import { cadastroSuccessExtra } from "@/styles/cadastro_sucess_extra_styles";
import { router } from "expo-router";
import Svg, { Rect, G, Path } from "react-native-svg"; // <-- Importado para desenhar o botão quadrado

export default function cadastro_pj() {
    // Estado principal que controla em qual etapa o usuário está
    const [step, setStep] = useState(1);
    
    // Estado único para controlar o foco dos inputs
    const [focused, setFocused] = useState('');

    // --- ESTADOS DA ETAPA 1 ---
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [razaoSocial, setRazaoSocial] = useState('');
    const [cnpj, setCnpj] = useState('');
    const [isPasswordHidden, setIsPasswordHidden] = useState(true);

    // --- ESTADOS DA ETAPA 2 ---
    const [dataFundacao, setDataFundacao] = useState('');
    const [telefone, setTelefone] = useState('');
    const [sobre, setSobre] = useState('');

    // --- ESTADOS DA ETAPA 3 ---
    const [cep, setCep] = useState('');
    const [rua, setRua] = useState('');
    const [numero, setNumero] = useState('');
    const [semNumero, setSemNumero] = useState(false);
    const [bairro, setBairro] = useState('');
    const [cidade, setCidade] = useState('');
    const [estado, setEstado] = useState('');

    // --- FUNÇÕES DE FORMATAÇÃO ---
    function formatCnpj(value: string) {
        const digits = value.replace(/\D/g, '').slice(0, 14);
        return digits.replace(/^(\d{2})(\d)/, '$1.$2').replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3').replace(/\.(\d{3})(\d)/, '.$1/$2').replace(/(\d{4})(\d)/, '$1-$2');
    }
    function formatData(value: string) {
        const digits = value.replace(/\D/g, '').slice(0, 8);
        return digits.replace(/^(\d{2})(\d)/, '$1/$2').replace(/^(\d{2})\/(\d{2})(\d)/, '$1/$2/$3');
    }
    function formatTelefone(value: string) {
        const digits = value.replace(/\D/g, '').slice(0, 11);
        return digits.replace(/^(\d{2})(\d)/, '($1) $2').replace(/\) (\d{5})(\d)/, ') $1-$2');
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#012A36' }}>
            
            {/* BOTÃO QUADRADO DE VOLTAR (Flutuando no topo, visível apenas nas etapas de formulário) */}
            {step < 4 && (
                <View style={{ position: 'absolute', top: 60, left: 24, zIndex: 10 }}>
                    <TopGlassButton onPress={() => {
                        if (step > 1) {
                            setStep(step - 1); // Volta uma etapa no form
                        } else {
                            router.back(); // Fecha a tela se estiver na etapa 1
                        }
                    }} />
                </View>
            )}

            <View style={styles.mainContainer}>
                
                {/* IMAGEM FIXA NO FUNDO */}
                <Image
                    source={require('@/assets/images/floresta.png')}
                    style={[styles.backgroundImageStyle, { position: 'absolute', width: '100%', height: '60%', resizeMode: 'cover' }]}
                />

                {/* OVERLAY DE DEGRADÊ */}
                <LinearGradient
                    colors={['transparent', 'rgba(1, 42, 54, 0.95)', '#012A36']}
                    locations={step === 4 ? [0, 0.65, 0.85] : [0, 0.40, 0.65]}
                    style={styles.backgroundGradientOverlay}
                />

                {/* --- CONTEÚDO SUPERIOR --- */}
                {step < 4 && (
                    // Alterado de paddingTop: 170 para 200 (empurrando mais para baixo)
                    <View style={[extra.topContentContainer, { paddingTop: 145 }]}>
                        <Image source={require('@/assets/images/logo.png')} style={[styles.applicationLogoImage, { marginBottom: step === 3 ? 16 : 4 }]} />
                        <Text style={[extra.mainTitleText, { marginBottom: step === 3 ? 4 : 2 }]}>Vamos começar agora!</Text>
                        <Text style={[extra.subtitleDescriptionText, { marginBottom: step === 3 ? 10 : 8 }]}>
                            Um app para aqueles que querem ajudar a amazônia{'\n'}a se tornar um lugar mais limpo e digno
                        </Text>
                    </View>
                )}

                {/* --- CONTEÚDO INFERIOR --- */}
                {step === 4 ? (
                    /* TELA DE SUCESSO (ETAPA 4) */
                    <View style={{ flex: 1, justifyContent: 'flex-end', paddingHorizontal: 24, paddingBottom: 80 }}>
                        <View style={{ alignItems: 'center' }}>
                            <Image source={require('@/assets/images/logo.png')} style={styles.applicationLogoImage} />
                            <Text style={cadastroSuccessExtra.successTitle}>
                                Parabéns! Sua conta foi{'\n'}criada com sucesso
                            </Text>
                            <Text style={extra.subtitleDescriptionText}>
                                Um app para aqueles que querem ajudar a amazônia{'\n'}a se tornar um lugar mais limpo e digno
                            </Text>

                            <View style={[cadastroExtra.stepContainer, cadastroSuccessExtra.stepSpacing, { marginBottom: 20 }]}>
                                <View style={cadastroExtra.stepDot} />
                                <View style={cadastroExtra.stepLineActive} />
                                <View style={cadastroExtra.stepDot} />
                                <View style={cadastroExtra.stepLineActive} />
                                <View style={cadastroExtra.stepDot} />
                                <View style={cadastroExtra.stepLineActive} />
                                <View style={cadastroExtra.stepDot} />
                            </View>

                            <TouchableOpacity onPress={() => router.push('/')} style={cadastroExtra.buttonProximaEtapa}>
                                <Text style={cadastroExtra.buttonProximaEtapaText}>Próxima etapa</Text>
                                <Ionicons name={'arrow-forward'} style={{ transform: [{ rotate: '-45deg' }] }} size={18} color={'black'} />
                            </TouchableOpacity>
                        </View>
                        <View style={{ marginTop: 30 }}>
                            <Text style={extra.termsAndPrivacyText}>
                                Ao criar sua conta no <Text style={styles.destaque}>IgarApp</Text>, você estará concordando{'\n'}
                                com os <Text style={styles.destaque}><Text style={styles.underline}>Termos de Uso</Text></Text> e <Text style={styles.destaque}><Text style={styles.underline}>Política de Privacidade</Text></Text>
                            </Text>
                        </View>
                    </View>

                ) : (
                    /* FORMULÁRIOS (ETAPAS 1, 2 e 3) */
                    <View style={extra.bottomActionContainer}>
                        {/* Adicionado paddingTop para separar o formulário do título */}
                        <View style={{ paddingTop: 20 }}>
                            
                            <View style={[cadastroExtra.stepContainer, { marginBottom: 15 }]}>
                                <View style={cadastroExtra.stepDot} />
                                <View style={step >= 2 ? cadastroExtra.stepLineActive : cadastroExtra.stepLine} />
                                <View style={step >= 2 ? cadastroExtra.stepDot : cadastroExtra.stepDotInactive} />
                                <View style={step >= 3 ? cadastroExtra.stepLineActive : cadastroExtra.stepLine} />
                                <View style={step >= 3 ? cadastroExtra.stepDot : cadastroExtra.stepDotInactive} />
                                <View style={step >= 4 ? cadastroExtra.stepLineActive : cadastroExtra.stepLine} />
                                <View style={step >= 4 ? cadastroExtra.stepDot : cadastroExtra.stepDotInactive} />
                            </View>

                            {step === 1 && (
                                <View>
                                    <View style={cadastroExtra.rowInputContainer}>
                                        <View style={cadastroExtra.halfInputWrapper}>
                                            <Text style={cadastroExtra.labelSmall}>Seu melhor e-mail</Text>
                                            <TextInput
                                                placeholder="Digite o seu e-mail"
                                                placeholderTextColor="rgba(255,255,255,0.35)"
                                                keyboardType="email-address"
                                                autoCapitalize="none"
                                                value={email}
                                                onChangeText={setEmail}
                                                style={[cadastroExtra.inputField, focused === 'email' && cadastroExtra.inputFieldFocused]}
                                                onFocus={() => setFocused('email')} onBlur={() => setFocused('')}
                                            />
                                        </View>
                                        <View style={cadastroExtra.halfInputWrapper}>
                                            <Text style={cadastroExtra.labelSmall}>Sua senha</Text>
                                            <View style={[cadastroExtra.passwordWrapper, focused === 'senha' && cadastroExtra.passwordWrapperFocused]}>
                                                <TextInput
                                                    placeholder="Crie uma senha forte"
                                                    placeholderTextColor="rgba(255,255,255,0.35)"
                                                    autoCapitalize="none"
                                                    secureTextEntry={isPasswordHidden}
                                                    value={senha}
                                                    onChangeText={setSenha}
                                                    style={cadastroExtra.passwordInput}
                                                    onFocus={() => setFocused('senha')} onBlur={() => setFocused('')}
                                                />
                                                <TouchableOpacity style={cadastroExtra.eyeIcon} onPress={() => setIsPasswordHidden(!isPasswordHidden)}>
                                                    <Ionicons name={isPasswordHidden ? 'eye-off-outline' : 'eye-outline'} size={20} color="#A6FF00" />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>

                                    <Text style={cadastroExtra.labelSmall}>Razão Social/Nome Fantasia</Text>
                                    <TextInput
                                        placeholder="Digite o nome da sua empresa como consta no documento"
                                        placeholderTextColor="rgba(255,255,255,0.35)"
                                        value={razaoSocial}
                                        onChangeText={setRazaoSocial}
                                        style={[cadastroExtra.inputFieldFullWidth, focused === 'razao' && cadastroExtra.inputFieldFullWidthFocused]}
                                        onFocus={() => setFocused('razao')} onBlur={() => setFocused('')}
                                    />

                                    <Text style={cadastroExtra.labelSmall}>CNPJ</Text>
                                    <TextInput
                                        placeholder="XX.XXX.XXX/XXXX-XX"
                                        placeholderTextColor="rgba(255,255,255,0.35)"
                                        keyboardType="numeric"
                                        value={cnpj}
                                        onChangeText={(t) => setCnpj(formatCnpj(t))}
                                        style={[cadastroExtra.inputFieldFullWidth, focused === 'cnpj' && cadastroExtra.inputFieldFullWidthFocused]}
                                        onFocus={() => setFocused('cnpj')} onBlur={() => setFocused('')}
                                    />
                                </View>
                            )}

                            {step === 2 && (
                                <View>
                                    <View style={cadastroExtra.rowInputContainer}>
                                        <View style={cadastroExtra.halfInputWrapper}>
                                            <Text style={cadastroExtra.labelSmall}>Data de Fundação</Text>
                                            <TextInput
                                                placeholder="DD/MM/AAAA"
                                                placeholderTextColor="rgba(255,255,255,0.35)"
                                                keyboardType="numeric"
                                                value={dataFundacao}
                                                onChangeText={(t) => setDataFundacao(formatData(t))}
                                                style={[cadastroExtra.inputField, focused === 'data' && cadastroExtra.inputFieldFocused]}
                                                onFocus={() => setFocused('data')} onBlur={() => setFocused('')}
                                            />
                                        </View>
                                        <View style={cadastroExtra.halfInputWrapper}>
                                            <Text style={cadastroExtra.labelSmall}>Número de telefone</Text>
                                            <TextInput
                                                placeholder="(XX) 9XXXX-XXXX"
                                                placeholderTextColor="rgba(255,255,255,0.35)"
                                                keyboardType="phone-pad"
                                                value={telefone}
                                                onChangeText={(t) => setTelefone(formatTelefone(t))}
                                                style={[cadastroExtra.inputField, focused === 'telefone' && cadastroExtra.inputFieldFocused]}
                                                onFocus={() => setFocused('telefone')} onBlur={() => setFocused('')}
                                            />
                                        </View>
                                    </View>

                                    <Text style={cadastroExtra.labelSmall}>Sobre a Empresa</Text>
                                    <TextInput
                                        placeholder="Conte-nos um pouco mais sobre a empresa..."
                                        placeholderTextColor="rgba(255,255,255,0.35)"
                                        multiline numberOfLines={5} textAlignVertical="top"
                                        value={sobre}
                                        onChangeText={setSobre}
                                        style={[cadastroTwoExtra.textArea, focused === 'sobre' && cadastroTwoExtra.textAreaFocused]}
                                        onFocus={() => setFocused('sobre')} onBlur={() => setFocused('')}
                                    />
                                </View>
                            )}

                            {step === 3 && (
                                <View>
                                    <Text style={[cadastroExtra.labelSmall, { marginTop: 4 }]}>CEP</Text>
                                    <TextInput
                                        placeholder="XXXXX-XXX"
                                        placeholderTextColor="rgba(255,255,255,0.35)"
                                        value={cep}
                                        onChangeText={setCep}
                                        style={[cadastroExtra.inputFieldFullWidth, focused === 'cep' && cadastroExtra.inputFieldFullWidthFocused]}
                                        onFocus={() => setFocused('cep')} onBlur={() => setFocused('')}
                                    />

                                    <Text style={cadastroExtra.labelSmall}>Rua*</Text>
                                    <TextInput
                                        placeholder="Coloque o nome da sua rua"
                                        placeholderTextColor="rgba(255,255,255,0.35)"
                                        value={rua}
                                        onChangeText={setRua}
                                        style={[cadastroExtra.inputFieldFullWidth, focused === 'rua' && cadastroExtra.inputFieldFullWidthFocused]}
                                        onFocus={() => setFocused('rua')} onBlur={() => setFocused('')}
                                    />

                                    <View style={cadastroExtra.rowInputContainer}>
                                        <View style={cadastroExtra.halfInputWrapper}>
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                                <Text style={cadastroExtra.labelSmall}>Número da rua*</Text>
                                                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }} onPress={() => setSemNumero(!semNumero)}>
                                                    <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 10, marginRight: 4 }}>Sem número</Text>
                                                    <View style={{ width: 12, height: 12, borderWidth: 1, borderColor: semNumero ? '#A6FF00' : 'rgba(255,255,255,0.5)', borderRadius: 2, backgroundColor: semNumero ? '#A6FF00' : 'transparent' }} />
                                                </TouchableOpacity>
                                            </View>
                                            <TextInput
                                                placeholder="Número rua"
                                                placeholderTextColor="rgba(255,255,255,0.35)"
                                                editable={!semNumero}
                                                value={semNumero ? '' : numero}
                                                onChangeText={setNumero}
                                                style={[cadastroExtra.inputField, focused === 'numero' && cadastroExtra.inputFieldFocused, semNumero && {opacity: 0.5}]}
                                                onFocus={() => setFocused('numero')} onBlur={() => setFocused('')}
                                            />
                                        </View>
                                        <View style={cadastroExtra.halfInputWrapper}>
                                            <Text style={cadastroExtra.labelSmall}>Bairro*</Text>
                                            <TextInput
                                                placeholder="Nome do seu bairro"
                                                placeholderTextColor="rgba(255,255,255,0.35)"
                                                value={bairro}
                                                onChangeText={setBairro}
                                                style={[cadastroExtra.inputField, focused === 'bairro' && cadastroExtra.inputFieldFocused]}
                                                onFocus={() => setFocused('bairro')} onBlur={() => setFocused('')}
                                            />
                                        </View>
                                    </View>

                                    <View style={cadastroExtra.rowInputContainer}>
                                        <View style={cadastroExtra.halfInputWrapper}>
                                            <Text style={cadastroExtra.labelSmall}>Cidade</Text>
                                            <TextInput
                                                placeholder="Selecionar Cidade"
                                                placeholderTextColor="rgba(255,255,255,0.35)"
                                                value={cidade}
                                                onChangeText={setCidade}
                                                style={[cadastroExtra.inputField, focused === 'cidade' && cadastroExtra.inputFieldFocused]}
                                                onFocus={() => setFocused('cidade')} onBlur={() => setFocused('')}
                                            />
                                        </View>
                                        <View style={cadastroExtra.halfInputWrapper}>
                                            <Text style={cadastroExtra.labelSmall}>Estado</Text>
                                            <TextInput
                                                placeholder="Selecionar Estado"
                                                placeholderTextColor="rgba(255,255,255,0.35)"
                                                value={estado}
                                                onChangeText={setEstado}
                                                style={[cadastroExtra.inputField, focused === 'estado' && cadastroExtra.inputFieldFocused]}
                                                onFocus={() => setFocused('estado')} onBlur={() => setFocused('')}
                                            />
                                        </View>
                                    </View>
                                </View>
                            )}

                            <TouchableOpacity 
                                onPress={() => {
                                    if (step < 3) setStep(step + 1);
                                    else if (step === 3) setStep(4);
                                }} 
                                style={[cadastroExtra.buttonProximaEtapa, { marginTop: 25, marginBottom: 15 }]}
                            >
                                <Text style={cadastroExtra.buttonProximaEtapaText}>
                                    {step === 3 ? 'Enviar respostas' : 'Próxima etapa'}
                                </Text>
                                <Ionicons name={'arrow-forward'} style={{ transform: [{ rotate: '-45deg' }] }} size={18} color={'black'} />
                            </TouchableOpacity>
                        </View>
                        
                        <Text style={[extra.termsAndPrivacyText, { marginTop: 10 }]}>
                            Ao criar sua conta no <Text style={styles.destaque}>IgarApp</Text>, você estará concordando{'\n'}
                            com os <Text style={styles.destaque}><Text style={styles.underline}>Termos de Uso</Text></Text> e <Text style={styles.destaque}><Text style={styles.underline}>Política de Privacidade</Text></Text>
                        </Text>
                    </View>
                )}
            </View>
        </View>
    );
}

// ==========================================
// COMPONENTE DO BOTÃO DE VOLTAR
// ==========================================
const TopGlassButton = ({ onPress }: { onPress: () => void }) => (
    <TouchableOpacity
      style={{
        width: 44,
        height: 44,
        borderRadius: 15,
        overflow: "hidden",
        justifyContent: "center",
        alignItems: "center"
      }}
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