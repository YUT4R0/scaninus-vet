import { useSingleAnalysisStore } from '@/store/single-analysis';
import { formatDate } from '@/utils/date-format';
import { fs } from '@/utils/responsive';
import { useLocalSearchParams } from 'expo-router';
import { Image, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { colorMap } from './_components/SingleAnalysisHistoryCard';

export default function AnalysisId() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const analysis = useSingleAnalysisStore((state) => state.singleAnalyses).filter(
    (analysis) => analysis.id === id
  )[0];

  return (
    <View className="flex-1 px-10 pb-10">
      <Text
        allowFontScaling={false}
        style={{ fontSize: fs(28) }}
        className="w-full border-b text-center font-semiBold">
        {analysis.title}
      </Text>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 0, paddingVertical: 16, gap: 24 }}
        className="w-full">
        <View className="flex w-full flex-1 flex-col gap-2">
          <View className="flex flex-row justify-between">
            <Text allowFontScaling={false} style={{ fontSize: fs(16) }} className="font-medium">
              Ração Analisada ({analysis.status.toLowerCase()}):
            </Text>
            <Text allowFontScaling={false} style={{ fontSize: fs(14) }} className="font-regular">
              {formatDate(analysis.date)}
            </Text>
          </View>
          <View style={{ elevation: 6, borderRadius: 12 }} className="self-center ">
            <Image
              source={{ uri: analysis.image_uri }}
              style={{
                height: 256,
                width: 256,
                borderRadius: 12,
                backgroundColor: '#5d5b5b',
                borderWidth: 1,
                borderColor: colorMap[analysis.status],
              }}
              resizeMode="contain"
            />
          </View>
        </View>
        <Text allowFontScaling={false} style={{ fontSize: fs(16) }} className="font-medium">
          ENN Calculado: {analysis.enn ? `${analysis.enn}%` : 'Indeterminado'}
        </Text>
        <View className="flex w-full flex-1 flex-col gap-1">
          <Text allowFontScaling={false} style={{ fontSize: fs(16) }} className="font-medium">
            Descrição:
          </Text>
          <View
            style={{ elevation: 2 }}
            className="mx-0.5 flex flex-col items-start self-end rounded-lg border-[1px] border-gray-200 bg-gray-200 p-6">
            <Text allowFontScaling={false} style={{ fontSize: fs(16) }} className="font-regular">
              {analysis.description}
            </Text>
          </View>
        </View>
        <View className="flex w-full flex-1 flex-col gap-1">
          <Text allowFontScaling={false} style={{ fontSize: fs(16) }} className="font-medium">
            Sugestão:
          </Text>
          <View
            style={{ elevation: 2 }}
            className="mx-0.5 flex flex-col items-start self-end rounded-lg border-[1px] border-gray-200 bg-gray-200 p-6">
            <Text allowFontScaling={false} style={{ fontSize: fs(16) }} className="font-regular">
              {analysis.suggestion}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
