import { Button } from '@/components/Button';
import Wellcome from '@/components/Wellcome';
import { router } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

export default function Index() {
  return (
    <View className="flex-1 gap-5 px-10 py-16">
      <View className="flex h-[85%]">
        <Wellcome />
      </View>
      <View className="flex h-[15%] w-full justify-center">
        <Button onPress={() => router.navigate('/analysis')}>
          <Button.Title>Começar</Button.Title>
        </Button>
      </View>
    </View>
  );
}
