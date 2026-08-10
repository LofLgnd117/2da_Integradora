import React, { useState } from "react";
import { View, ScrollView, Text, Image, TextInput, TouchableOpacity, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-[#839958]">
      <StatusBar barStyle="light-content" backgroundColor="#839958" />
      
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
        
        {/* LOGO */}
        <View className="items-center pt-10 pb-8">
          <Image
            source={{ uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/3zdM7I85eL/a8jpn0ms_expires_30_days.png" }}
            resizeMode="contain"
            className="w-56 h-56"
          />
        </View>

        {/* TEXTOS DE BIENVENIDA */}
        <View className="px-8 mb-8">
          <Text className="text-[#F7F4D5] text-3xl font-bold mb-2">
            Bienvenido de nuevo
          </Text>
          <Text className="text-[#F7F4D5] text-base leading-relaxed">
            Inicia sesión para continuar tu viaje culinario.
          </Text>
        </View>

        {/* FORMULARIO */}
        <View className="px-8 w-full">
          
          {/* INPUT CORREO */}
          <View className="mb-6">
            <Text className="text-[#F7F4D5] text-base font-medium mb-2 ml-1">
              Correo Electrónico
            </Text>
            <TextInput
              className="text-[#F7F4D5] text-base border border-[#D9D9D9] rounded-2xl px-4 min-h-[56px]"
              placeholder="correo@ejemplo.com"
              placeholderTextColor="#D9D9D980"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* INPUT CONTRASEÑA */}
          <View className="mb-2">
            <Text className="text-[#F7F4D5] text-base font-medium mb-2 ml-1">
              Contraseña
            </Text>
            <View className="flex-row items-center border border-[#D9D9D9] rounded-2xl px-4 min-h-[56px]">
              <TextInput
                className="flex-1 text-[#F7F4D5] text-base"
                placeholder="••••••••"
                placeholderTextColor="#D9D9D980"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity 
                onPress={() => setShowPassword(!showPassword)}
                className="min-h-[48px] min-w-[48px] items-center justify-center -mr-2"
              >
                <Image
                  source={{ uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/3zdM7I85eL/u4nidnhj_expires_30_days.png" }}
                  resizeMode="contain"
                  className="w-5 h-5 opacity-80"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* OLVIDÉ MI CONTRASEÑA */}
          <TouchableOpacity className="self-end py-2 min-h-[48px] justify-center mb-8">
            <Text className="text-[#0A3323] text-base font-bold">
              ¿Olvidaste tu contraseña?
            </Text>
          </TouchableOpacity>

          {/* BOTÓN INICIAR SESIÓN */}
          <TouchableOpacity 
            onPress={() => navigation.navigate('Main')}
            className="bg-[#0A3323] rounded-2xl items-center justify-center min-h-[56px] mb-6 shadow-sm"
            activeOpacity={0.8}
          >
            <Text className="text-[#F7F4D5] text-lg font-bold tracking-wide">
              Iniciar Sesión
            </Text>
          </TouchableOpacity>

          {/* ENLACE DE REGISTRO */}
          <View className="flex-row justify-center items-center">
            <Text className="text-[#F7F4D5] text-base">
              ¿No tienes cuenta?
            </Text>
            <TouchableOpacity 
              className="min-h-[48px] justify-center px-2" 
              // Te lleva a la pantalla de registro
              onPress={() => navigation.navigate('Signup')}
            >
              <Text className="text-[#0A3323] text-base font-bold">
                Registrarse
              </Text>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}