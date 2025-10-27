import { fs } from '@/utils/responsive';
import { Text, TouchableOpacity, TouchableOpacityProps, View } from 'react-native';

type AnalysisHistoricOptionProps = {
  label: string;
  amountAnalysis: number;
} & TouchableOpacityProps;

export const MAX_ANALYSIS = 3;

export default function AnalysisHistoryOption({
  label,
  amountAnalysis,
  ...rest
}: AnalysisHistoricOptionProps) {
  return (
    <TouchableOpacity
      {...rest}
      style={{ elevation: 3 }}
      className="flex h-24 w-full flex-col justify-center gap-2 rounded-2xl border-[1px] border-gray-200 bg-gray-100 p-3">
      <Text allowFontScaling={false} style={{ fontSize: fs(16) }} className="font-medium">
        {label}
      </Text>
      <View className="h-3 w-full rounded-xl bg-gray-400">
        <View
          style={{ width: `${(amountAnalysis / MAX_ANALYSIS) * 100}%` }}
          className={'h-3 rounded-xl bg-green-500'}
        />
      </View>
      <Text
        allowFontScaling={false}
        style={{ fontSize: fs(10) }}
        className="text-center font-regular">
        {amountAnalysis}/{MAX_ANALYSIS}
      </Text>
    </TouchableOpacity>
  );
}
