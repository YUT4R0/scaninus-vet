import { SingleAnalysisHistory } from '@/store/single-analysis';
import { colors } from '@/styles/colors';
import { formatDate } from '@/utils/date-format';
import { fs } from '@/utils/responsive';
import { router } from 'expo-router';
import { Image, Text, TouchableOpacity, View } from 'react-native';

type Props = {
  analysis: SingleAnalysisHistory;
};

export const colorMap = {
  IMPRECISA: colors.red.base,
  SUCESSO: colors.green.light,
};

export default function SingleAnalysisHistoryCard({ analysis }: Props) {
  return (
    <TouchableOpacity
      style={{ elevation: 3, borderColor: colorMap[analysis.status] }}
      onPress={() => router.navigate(`./history/${analysis.id}`)}
      className="relative mx-auto mb-6 flex h-32 w-[99%] flex-col items-center justify-center overflow-hidden rounded-2xl border-[1px] bg-gray-200 p-3 pl-11">
      <View
        style={{ backgroundColor: colorMap[analysis.status] }}
        className="absolute left-0 h-32 w-8"
      />
      <View className="flex w-full flex-row gap-2">
        <View className="flex h-full w-[30%] ">
          <View style={{ elevation: 5, borderRadius: 12 }}>
            <Image
              source={{ uri: analysis.image_uri }}
              style={{
                height: '100%',
                width: '100%',
                borderRadius: 12,
                backgroundColor: '#5d5b5b',
                borderWidth: 1,
                borderColor: colorMap[analysis.status],
              }}
              resizeMode="contain"
            />
          </View>
        </View>
        <View className="flex h-full w-[70%] flex-col justify-between">
          <View className="flex flex-col">
            <Text allowFontScaling={false} style={{ fontSize: fs(16) }} className="font-semiBold">
              {analysis.title}
            </Text>
            <Text allowFontScaling={false} style={{ fontSize: fs(14) }} className="font-medium">
              ENN: {analysis.enn ? `${analysis.enn}%` : 'Indeterminado'}
            </Text>
          </View>
          <Text allowFontScaling={false} style={{ fontSize: fs(12) }} className=" font-regular">
            {formatDate(analysis.date)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
