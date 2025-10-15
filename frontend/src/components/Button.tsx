import { colors } from '@/styles/colors';
import { fs } from '@/utils/responsive';
import { IconProps as TablerIconProps } from '@tabler/icons-react-native';
import React from 'react';
import {
  ActivityIndicator,
  Text,
  TextProps,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';

type ButtonProps = TouchableOpacityProps & {
  isLoading?: boolean;
};

function Button({ children, style, isLoading = false, ...rest }: ButtonProps) {
  return (
    <TouchableOpacity
      className="flex h-14 max-h-14 flex-row items-center justify-center gap-4 rounded-xl bg-green-base"
      activeOpacity={0.8}
      disabled={isLoading}
      style={style}
      {...rest}>
      {isLoading ? <ActivityIndicator size={'small'} color={colors.gray[100]} /> : children}
    </TouchableOpacity>
  );
}

function Title({ children }: TextProps) {
  return (
    <Text style={{ fontSize: fs(12) }} className="font-semiBold leading-snug text-gray-100">
      {children}
    </Text>
  );
}

type IconProps = {
  icon: React.ComponentType<TablerIconProps>;
};

function Icon({ icon: Icon }: IconProps) {
  return <Icon size={24} color={colors.gray[100]} />;
}

Button.Title = Title;
Button.Icon = Icon;

export { Button };
