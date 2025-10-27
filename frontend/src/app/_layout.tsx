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
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="analysis/index" options={{ headerShown: false }} />
            <Stack.Screen name="analysis/info" options={{ headerShown: false }} />
            <Stack.Screen
              name="analysis/single/new/confirmation"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="analysis/comparative/new/confirmation"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="analysis/single/new/agent-response"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="analysis/comparative/new/agent-response"
              options={{ headerShown: false }}
            />

            <Stack.Screen
              name="analysis/single/new/index"
              options={{
                title: 'Nova Análise Simples',
                headerTitleStyle: {
                  fontSize: 18,
                  fontWeight: '100',
                  color: colors.gray[500],
                },
                headerTitleAlign: 'center',
              }}
            />
            <Stack.Screen
              name="analysis/comparative/new/index"
              options={{
                title: 'Nova Análise Comparativa',
                headerTitleStyle: {
                  fontSize: 18,
                  fontWeight: 100,
                  color: colors.gray[500],
                },
                headerTitleAlign: 'center',
              }}
            />
            <Stack.Screen
              name="analysis/single/history/index"
              options={{
                title: 'Histórico',
                headerTitleStyle: {
                  fontSize: 18,
                  fontWeight: '100',
                  color: colors.gray[500],
                },
                headerTitleAlign: 'center',
              }}
            />
            <Stack.Screen
              name="analysis/comparative/history/index"
              options={{
                title: 'Histórico',
                headerTitleStyle: {
                  fontSize: 18,
                  fontWeight: '100',
                  color: colors.gray[500],
                },
                headerTitleAlign: 'center',
              }}
            />
            <Stack.Screen
              name="analysis/single/history/[id]"
              options={{
                headerShadowVisible: false,
                title: '',
              }}
            />
            <Stack.Screen
              name="analysis/comparative/history/[id]"
              options={{
                headerShadowVisible: false,
                title: '',
              }}
            />
          </Stack>
        </SafeAreaView>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
