import { colors } from '@/styles/colors';
import React from 'react';
import { ActivityIndicator, ActivityIndicatorProps } from 'react-native';

type Props = ActivityIndicatorProps;

export function Loading({ ...rest }: Props) {
  return (
    <ActivityIndicator
      {...rest}
      color={colors.green.base}
      className="flex-1 items-center justify-center bg-gray-100"
    />
  );
}
