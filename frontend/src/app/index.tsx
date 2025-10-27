import { Button } from '@/components/Button';
import Wellcome from '@/components/Wellcome';
import { IconArrowRight } from '@tabler/icons-react-native';
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
          <Button.Icon icon={IconArrowRight} />
          <Button.Title>COMEÇAR</Button.Title>
        </Button>
      </View>
    </View>
  );
}
