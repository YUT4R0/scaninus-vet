import { Button } from '@/components/Button';
import { useSingleAnalysisStore } from '@/store/single-analysis';
import { colors } from '@/styles/colors';
import { formatDate } from '@/utils/date-format';
import { fs } from '@/utils/responsive';
import { IconTrash } from '@tabler/icons-react-native';
import * as FileSystem from 'expo-file-system';
import { router, useLocalSearchParams } from 'expo-router';
import { Alert, Image, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import AnalysisVariablesChart from './_components/AnalysisVariablesChart';
import { colorMap } from './_components/SingleAnalysisHistoryCard';

export default function AnalysisId() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const analysis = useSingleAnalysisStore((state) => state.singleAnalyses).find((a) => a.id === id);
  const removeAnalysisFromStore = useSingleAnalysisStore((state) => state.removeAnalysis);

  if (!analysis) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text style={{ fontSize: fs(18) }}>Análise não encontrada.</Text>
      </View>
    );
  }

  const handleExcludeAnalysis = async () => {
    Alert.alert(
      'Excluir Análise',
      `Você tem certeza que deseja excluir o histórico da análise "${analysis.title}" permanetemente?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              if (analysis.image_uri) {
                await FileSystem.deleteAsync(analysis.image_uri, { idempotent: true });
              }
              removeAnalysisFromStore(analysis.id);
              router.replace('/analysis/single/history');
            } catch (error) {
              console.error('Erro fatal ao excluir análise:', error);
              Alert.alert('Erro', 'Não foi possível excluir o registro ou o arquivo físico.');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

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
        <View className="flex w-full flex-col justify-center">
          <Text allowFontScaling={false} style={{ fontSize: fs(16) }} className="font-medium">
            Proporção dos Valores:
          </Text>
          <AnalysisVariablesChart enn={analysis.enn} variables={analysis.variables} />
        </View>
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
        <View>
          <Button onPress={handleExcludeAnalysis} style={{ backgroundColor: colors.red.base }}>
            <Button.Icon icon={IconTrash} />
            <Button.Title>Excluir Análise</Button.Title>
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}
