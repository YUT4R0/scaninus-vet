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
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.gray[100] },
      }}
    />
  );
}
