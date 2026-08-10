import React, { useState } from "react";
import { View, ScrollView, Text, Image, TextInput, TouchableOpacity, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignupScreen({ navigation }) {
  // Estados para los campos del formulario
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Estados independientes para mostrar/ocultar las contraseñas
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-[#839958]">
      <StatusBar barStyle="light-content" backgroundColor="#839958" />
      
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
        
        {/* ENCABEZADO */}
        <View className="px-8 pt-12 mb-10">
          <Text className="text-[#F7F4D5] text-3xl font-bold mb-2">
            Crear Cuenta
          </Text>
          <Text className="text-[#F7F4D5] text-base leading-relaxed">
            Únete a nuestra comunidad de chefs en casa.
          </Text>
        </View>

        {/* FORMULARIO */}
        <View className="px-8 w-full">
          
          {/* NOMBRE COMPLETO */}
          <View className="mb-5">
            <Text className="text-[#F7F4D5] text-base font-medium mb-2 ml-1">
              Nombre Completo
            </Text>
            <TextInput
              className="text-[#F7F4D5] text-base border border-[#D9D9D9] rounded-2xl px-4 min-h-[56px]"
              placeholder="Juan Pérez"
              placeholderTextColor="#D9D9D980"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />
          </View>

          {/* CORREO ELECTRÓNICO */}
          <View className="mb-5">
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

          {/* CONTRASEÑA */}
          <View className="mb-5">
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
                  source={{ uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/3zdM7I85eL/u4xqfhz4_expires_30_days.png" }}
                  resizeMode="contain"
                  className="w-5 h-5 opacity-80"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* CONFIRMAR CONTRASEÑA */}
          <View className="mb-10">
            <Text className="text-[#F7F4D5] text-base font-medium mb-2 ml-1">
              Confirmar Contraseña
            </Text>
            <View className="flex-row items-center border border-[#D9D9D9] rounded-2xl px-4 min-h-[56px]">
              <TextInput
                className="flex-1 text-[#F7F4D5] text-base"
                placeholder="••••••••"
                placeholderTextColor="#D9D9D980"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
              />
              <TouchableOpacity 
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                className="min-h-[48px] min-w-[48px] items-center justify-center -mr-2"
              >
                <Image
                  source={{ uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/3zdM7I85eL/n3o01xvx_expires_30_days.png" }}
                  resizeMode="contain"
                  className="w-5 h-5 opacity-80"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* BOTÓN REGISTRARSE */}
          <TouchableOpacity 
            onPress={() => navigation.navigate('Main')}
            className="bg-[#0A3323] rounded-2xl items-center justify-center min-h-[56px] mb-6 shadow-sm"
            activeOpacity={0.8}
          >
            <Text className="text-[#F7F4D5] text-lg font-bold tracking-wide">
              Registrarse
            </Text>
          </TouchableOpacity>

          {/* ENLACE DE INICIAR SESIÓN */}
          <View className="flex-row justify-center items-center">
            <Text className="text-[#F7F4D5] text-base">
              ¿Ya tienes una cuenta?
            </Text>
            <TouchableOpacity 
              className="min-h-[48px] justify-center px-2" 
              // Regresa a la pantalla anterior (Login)
              onPress={() => navigation.goBack()}
            >
              <Text className="text-[#0A3323] text-base font-bold">
                Iniciar Sesión
              </Text>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}