import { useEffect, useState } from 'react';
import { Platform, StatusBar } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { commonStyles, colors } from '../styles/commonStyles';
import { setupErrorLogging } from '../utils/errorLogger';
import * as Font from 'expo-font';
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
} from '@expo-google-fonts/inter';
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';

const STORAGE_KEY = 'app-state';

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);

  let [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  useEffect(() => {
    setupErrorLogging();
    
    const prepareApp = async () => {
      try {
        // Any additional setup can go here
        console.log('App initialization complete');
      } catch (error) {
        console.error('Error during app initialization:', error);
      } finally {
        setIsReady(true);
      }
    };

    if (fontsLoaded) {
      prepareApp();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded || !isReady) {
    return null; // You could show a splash screen here
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={commonStyles.safeArea}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={colors.background}
        translucent={false}
      />
      <Stack
        screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        animation: 'slide_from_right',
        animationDuration: 300,
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="assessment" />
        <Stack.Screen name="roadmap" />
        <Stack.Screen name="dashboard" />
        <Stack.Screen name="profile" />
      </Stack>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}