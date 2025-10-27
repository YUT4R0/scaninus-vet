import { fs } from '@/utils/responsive';
import { useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { MOCKED_ANALYSES } from '.';

export default function AnalysisId() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const analysis = MOCKED_ANALYSES.filter((analysis) => analysis.id === id)[0];

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
              {analysis.date}
            </Text>
          </View>
          <View
            style={{ elevation: 3, borderRadius: 12, height: 256, width: 256 }}
            className="flex items-center self-center">
            <View
              style={{ borderRadius: 12, height: 256, width: 256 }}
              className=" bg-yellow-200"
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
