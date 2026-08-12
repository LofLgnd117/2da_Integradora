import * as React from 'react';
import { View } from 'react-native';
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
// Separamos tus pestañas en su propio componente
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color }) => {
          let iconName;
          
          // Asignación de íconos según la pantalla
          if (route.name === 'Inicio') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'Buscar') iconName = focused ? 'search' : 'search-outline';
          else if (route.name === 'Agregar') iconName = focused ? 'add-circle' : 'add-circle-outline'; 
          else if (route.name === 'Guardados') iconName = focused ? 'bookmark' : 'bookmark-outline';
          else if (route.name === 'Perfil') iconName = focused ? 'person' : 'person-outline';
          
          // Hacemos el ícono central un poco más grande
          const iconSize = route.name === 'Agregar' ? 32 : 24;

          return <Ionicons name={iconName} size={iconSize} color={color} />;
        },
        // Estilos idénticos a tu diseño de Figma
        tabBarActiveTintColor: '#F7F4D5',     // Color crema cuando está seleccionado
        tabBarInactiveTintColor: '#839958',   // Color verde oliva cuando no está seleccionado
        tabBarShowLabel: false,               // Ocultamos los textos de abajo
        tabBarStyle: { 
          backgroundColor: '#0A3323',         // Fondo verde oscuro
          borderTopWidth: 0,
          height: 65,
          paddingBottom: 10,
          paddingTop: 10
        },
        headerStyle: { backgroundColor: '#839958' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      })}
    >
      {/* ORDEN EXACTO COMO EN TU IMAGEN */}
      <Tab.Screen name="Inicio" component={HomeScreen} />
      <Tab.Screen name="Buscar" component={SearchScreen} />
      
      {/* BOTÓN CENTRAL "+" */}
      <Tab.Screen 
        name="Agregar" 
        component={View} // Componente vacío (dummy) porque nunca renderizamos esta pestaña
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault(); // Evita el comportamiento normal de la pestaña
            navigation.navigate('AddRecipe'); // Lanza la pantalla del Stack
          },
        })}
      />
      
      <Tab.Screen name="Guardados" component={SavedScreen} />
      <Tab.Screen name="Perfil" component={ProfileScreen} />
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