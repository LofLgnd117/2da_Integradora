import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons'; 

// Importamos todas las pantallas
import StartScreen from './src/screens/StartScreen'; 
import HomeScreen from './src/screens/HomeScreen';
import SearchScreen from './src/screens/SearchScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';
import RecipeDetailScreen from './src/screens/RecipeDetailScreen';
import SavedScreen from './src/screens/SavedScreen';
import EditProfileScreen from './src/screens/EditProfileScreen';
import AccountSettingsScreen from './src/screens/AccountSettingsScreen';
import AddRecipeScreen from './src/screens/AddRecipeScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator(); // Creamos el mazo de cartas

// Separamos tus pestañas en su propio componente
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Inicio') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'Buscar') iconName = focused ? 'search' : 'search-outline';
          else if (route.name === 'Perfil') iconName = focused ? 'person' : 'person-outline';
          else if (route.name === 'Guardados') iconName = focused ? 'bookmark' : 'bookmark-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2E5834',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: { paddingBottom: 5, height: 60 },
        headerStyle: { backgroundColor: '#839958' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      })}
    >
      <Tab.Screen name="Inicio" component={HomeScreen} />
      <Tab.Screen name="Buscar" component={SearchScreen} />
      <Tab.Screen name="Perfil" component={ProfileScreen} />
      <Tab.Screen name="Guardados" component={SavedScreen} />
    </Tab.Navigator>
  );
}

// El componente principal ahora controla el flujo completo
export default function App() {
  return (
    <NavigationContainer>

      {/* headerShown: false oculta la barra superior fea del Stack */}
      <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Carta 1: Bienvenida */}
      <Stack.Screen name="Start" component={StartScreen} />
  
      {/* Carta 2: Login */}
      <Stack.Screen name="Login" component={LoginScreen} />

      {/* ¡AQUÍ AGREGAMOS LA NUEVA CARTA! */}
      <Stack.Screen name="Signup" component={SignupScreen} />
  
      {/* Carta 4: La aplicación principal (Las pestañas) */}
      <Stack.Screen name="Main" component={MainTabs} />
      
      {/* Carta 5: Detalle de la receta */}
      <Stack.Screen name="RecipeDetail" component={RecipeDetailScreen} />
      
      {/* Carta 6: Editar perfil */}
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      
      {/* Carta 7: Configuración de cuenta */}
      <Stack.Screen name="AccountSettings" component={AccountSettingsScreen} />

      {/* Carta 8: Agregar receta */}
      <Stack.Screen name="AddRecipe" component={AddRecipeScreen} />

      </Stack.Navigator>

    </NavigationContainer>
  );
}