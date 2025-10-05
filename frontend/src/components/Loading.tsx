import { colors } from '@/styles/colors';
import React from 'react';
import { ActivityIndicator } from 'react-native';

export function Loading() {
  return (
    <ActivityIndicator
      color={colors.green.base}
      className="flex-1 items-center justify-center bg-gray-100"
    />
  );
}
