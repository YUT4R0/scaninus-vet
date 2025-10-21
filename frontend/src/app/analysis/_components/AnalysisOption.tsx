import { fs } from '@/utils/responsive';
import { Text, TouchableOpacity, TouchableOpacityProps, View } from 'react-native';

import { colors } from '@/styles/colors';
import { IconProps as TablerIconProps } from '@tabler/icons-react-native';

type Props = {
  title: string;
  description: string;
  icon: React.ComponentType<TablerIconProps>;
} & TouchableOpacityProps;

export default function AnalysisOption({ description, title, icon: Icon, ...rest }: Props) {
  return (
    <TouchableOpacity
      {...rest}
      className="flex h-32 w-full flex-row items-center gap-3 rounded-2xl border-[1px] border-black bg-gray-200 p-3">
      <Icon size={90} color={colors.blue.light} />
      <View className="flex h-full max-w-[69%] flex-col items-start justify-center">
        <Text allowFontScaling={false} style={{ fontSize: fs(16) }} className="font-medium">
          {title}
        </Text>
        <Text
          allowFontScaling={false}
          style={{ fontSize: fs(14) }}
          className="break-words font-regular">
          {description}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
