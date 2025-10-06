import { fs } from '@/utils/responsive';
import { Text, TouchableOpacity, TouchableOpacityProps, View } from 'react-native';

type Props = {
  title: string;
  description: string;
  icon?: string;
} & TouchableOpacityProps;

export function AnalysisOption({ description, title, ...rest }: Props) {
  return (
    <TouchableOpacity
      {...rest}
      className="flex h-32 w-full flex-row gap-3 rounded-2xl border-2 border-black p-3">
      <View className="h-24 w-24 bg-yellow-300"></View>
      <View className="flex h-full max-w-[69%] flex-col justify-center">
        <Text style={{ fontSize: fs(14) }} className="font-medium">
          {title}
        </Text>
        <Text style={{ fontSize: fs(11) }} className="break-words font-regular">
          {description}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
