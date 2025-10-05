import { Button } from '@/components/Button';
import Wellcome from '@/components/Wellcome';
import { router } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

export default function Index() {
  return (
    <View className="h-full flex-1 px-10 py-16">
      <Wellcome />
      <View className="mb-10">
        <Button onPress={() => router.navigate('/home')}>
          <Button.Title>Começar</Button.Title>
        </Button>
      </View>
    </View>
  );
}
