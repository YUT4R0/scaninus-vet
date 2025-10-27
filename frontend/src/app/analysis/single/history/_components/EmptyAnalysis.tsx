import { colors } from '@/styles/colors';
import { fs } from '@/utils/responsive';
import { IconBoneOff } from '@tabler/icons-react-native';
import { Text, View } from 'react-native';

type Props = {
  label: string;
};

export default function EmptyAnalysisHistory({ label }: Props) {
  return (
    <View className="flex h-full w-full flex-col items-center justify-center gap-5 p-3">
      <IconBoneOff size={48} color={colors.gray[400]} />
      <Text
        allowFontScaling={false}
        style={{ fontSize: fs(14), color: colors.gray[400] }}
        className="text-center font-medium">
        {label}
      </Text>
    </View>
  );
}
