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
import { GestureHandlerRootView } from 'react-native-gesture-handler';
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
    <GestureHandlerRootView style={{ flex: 1 }}>
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
            <Stack.Screen name="analysis/index" options={{ headerShown: false, title: 'Home' }} />
            <Stack.Screen
              name="analysis/single/agent-response"
              options={{ headerShown: false, title: 'Home' }}
            />
            <Stack.Screen
              name="analysis/comparative/agent-response"
              options={{ headerShown: false, title: 'Home' }}
            />

            <Stack.Screen
              name="analysis/single/index"
              options={{
                title: 'Análise Simples',
                headerTitleStyle: {
                  fontSize: 18,
                  fontWeight: '100',
                  color: colors.gray[500],
                },
                headerShadowVisible: false,
                headerTitleAlign: 'center',
              }}
            />
            {/* <Stack.Screen
              name="analysis/single/agent-response"
              options={{
                title: 'Resultado da Análise',
                headerShadowVisible: false,
                headerTitleStyle: {
                  fontSize: 18,
                  fontWeight: '100',
                  color: colors.gray[500],
                },
                headerTitleAlign: 'center',
              }}
            /> */}
            <Stack.Screen
              name="analysis/single/confirmation"
              options={{
                title: '',
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="analysis/comparative/index"
              options={{
                title: 'Análise Comparativa',
                headerTitleStyle: {
                  fontSize: 18,
                  fontWeight: '100',
                  color: colors.gray[500],
                },
                headerShadowVisible: false,
                headerTitleAlign: 'center',
              }}
            />
            {/* <Stack.Screen
              name="analysis/comparative/agent-response"
              options={{
                title: 'Resultado da Análise',
                headerShadowVisible: false,
                headerTitleStyle: {
                  fontSize: 18,
                  fontWeight: '100',
                  color: colors.gray[500],
                },
                headerTitleAlign: 'center',
              }}
            /> */}
            <Stack.Screen
              name="analysis/comparative/confirmation"
              options={{ title: '', headerShown: false }}
            />
          </Stack>
        </SafeAreaView>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
