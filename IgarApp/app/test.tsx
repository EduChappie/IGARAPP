import React, { useState } from "react";
import { View, Text, ImageBackground, TouchableOpacity, TextInput, ScrollView, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { styles, extra } from "@/styles/_style";
import { router } from "expo-router";

export default function detalhes_ativa() {
    // Simulando a lista de voluntários do banco de dados
    const [voluntarios, setVoluntarios] = useState([
        { id: '1', nome: 'João da Silva', confirmado: false },
        { id: '2', nome: 'Maria Souza', confirmado: true },
        { id: '3', nome: 'Carlos Andrade', confirmado: false },
    ]);

    // Função para confirmar presença ao clicar no botão
    const confirmarPresenca = (id: string) => {
        setVoluntarios(voluntarios.map(vol => 
            vol.id === id ? { ...vol, confirmado: true } : vol
        ));
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#012A36' }}>
            {/* Imagem do Igarapé no topo */}
            <ImageBackground 
                source={require('@/assets/images/floresta.png')} 
                style={{ width: '100%', height: 250 }} 
                resizeMode="cover"
            >
                <LinearGradient 
                    colors={['transparent', '#012A36']} 
                    locations={[0.5, 1]} 
                    style={StyleSheet.absoluteFillObject} 
                />
                
                {/* Botão Voltar e Editar */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 24, paddingTop: 60 }}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={28} color="#FFFFFF" />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Ionicons name="pencil" size={24} color="#A6FF00" />
                    </TouchableOpacity>
                </View>
            </ImageBackground>

            <View style={{ flex: 1, paddingHorizontal: 24, marginTop: -20 }}>
                {/* Cabeçalho da Ação */}
                <Text style={[extra.mainTitleText, { textAlign: 'left', fontSize: 24, marginBottom: 4 }]}>
                    Igarapé do Mindú
                </Text>
                <Text style={{ color: '#A0B3B8', fontSize: 14, marginBottom: 24 }}>
                    Manaus, Amazonas
                </Text>

                {/* Barra de Pesquisa de Voluntários */}
                <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(1, 42, 54, 0.8)', borderRadius: 12, borderWidth: 1, borderColor: 'rgba(0, 100, 130, 0.6)', paddingHorizontal: 16, marginBottom: 20 }}>
                    <Ionicons name="search" size={20} color="#A0B3B8" />
                    <TextInput 
                        placeholder="Pesquisar voluntário..." 
                        placeholderTextColor="rgba(255,255,255,0.35)" 
                        style={{ flex: 1, color: '#FFFFFF', paddingVertical: 12, marginLeft: 8 }} 
                    />
                </View>

                <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: 'bold', marginBottom: 16 }}>
                    Lista de Voluntários ({voluntarios.length})
                </Text>

                {/* Lista de Confirmação (aqui usamos ScrollView só pra lista não vazar a tela) */}
                <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1, marginBottom: 80 }}>
                    {voluntarios.map((vol) => (
                        <View key={vol.id} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(1, 42, 54, 0.5)', padding: 16, borderRadius: 12, marginBottom: 10, borderWidth: 1, borderColor: vol.confirmado ? '#A6FF00' : 'rgba(0, 100, 130, 0.3)' }}>
                            <View>
                                <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '500' }}>{vol.nome}</Text>
                                <Text style={{ color: vol.confirmado ? '#A6FF00' : '#A0B3B8', fontSize: 12, marginTop: 4 }}>
                                    {vol.confirmado ? 'Presença Confirmada' : 'Aguardando check-in...'}
                                </Text>
                            </View>

                            {!vol.confirmado ? (
                                <TouchableOpacity 
                                    onPress={() => confirmarPresenca(vol.id)}
                                    style={{ backgroundColor: 'rgba(166, 255, 0, 0.1)', padding: 10, borderRadius: 8 }}
                                >
                                    <Ionicons name="checkmark" size={24} color="#A6FF00" />
                                </TouchableOpacity>
                            ) : (
                                <Ionicons name="checkmark-done" size={24} color="#A6FF00" />
                            )}
                        </View>
                    ))}
                </ScrollView>
            </View>

            {/* Botão Fixo de Finalizar Ação no rodapé */}
            <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 24, backgroundColor: '#012A36' }}>
                <TouchableOpacity 
                    style={{ backgroundColor: '#E8ECEE', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 16, borderRadius: 12 }}
                >
                    <Text style={{ color: '#000000', fontWeight: 'bold', fontSize: 16, marginRight: 8 }}>
                        Finalizar Ação
                    </Text>
                    <Ionicons name="flag" size={18} color="black" />
                </TouchableOpacity>
            </View>
        </View>
    );
}