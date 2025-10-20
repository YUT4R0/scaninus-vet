import { Loading } from '@/components/Loading';
import { colors } from '@/styles/colors';
import {
  Rubik_400Regular,
  Rubik_500Medium,
  Rubik_600SemiBold,
  Rubik_700Bold,
  useFonts,
} from '@expo-google-fonts/rubik';
import { Stack } from 'expo-router';
import React from 'react';

import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import '../../global.css';

export default function Layot() {
  const [fontsLoaded] = useFonts({
    Rubik_600SemiBold,
    Rubik_400Regular,
    Rubik_500Medium,
    Rubik_700Bold,
  });

  if (!fontsLoaded) return <Loading />;

  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={{ flex: 1, backgroundColor: colors.gray[100] }}
        edges={['top', 'bottom']}>
        <Stack
          screenOptions={{
            headerShown: true,
            contentStyle: { backgroundColor: colors.gray[100] },
            headerStyle: { backgroundColor: colors.gray[100] },
          }}>
          <Stack.Screen name="index" options={{ headerShown: false, title: 'Bem-vindo' }} />
          <Stack.Screen name="home" options={{ headerShown: false, title: 'Home' }} />

          <Stack.Screen
            name="single-analysis/index"
            options={{
              title: 'Análise Simples',
              headerTitleStyle: {
                fontSize: 18,
              },
              headerTitleAlign: 'center',
            }}
          />
          <Stack.Screen
            name="single-analysis/agent-response"
            options={{
              title: 'Resultado da Análise',
              headerTitleAlign: 'center',
              headerTitleStyle: {
                fontSize: 18,
              },
            }}
          />
          <Stack.Screen
            name="single-analysis/confirmation"
            options={{ title: '', headerShown: false }}
          />
        </Stack>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
