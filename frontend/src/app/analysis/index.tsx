import { useSingleAnalysisStore } from '@/store/single-analysis';
import { fs } from '@/utils/responsive';
import {
  IconCirclePlus,
  IconHistory,
  IconLayersDifference,
  IconTextScan2,
} from '@tabler/icons-react-native';
import { router } from 'expo-router';
import { Text, View } from 'react-native';
import AnalysisHistoryOption from './_components/AnalysisHistoryOption';
import AnalysisOption from './_components/AnalysisOption';

export const ANALYSIS_HISTORY_LIMIT = 3;

export default function Index() {
  const singleAnalysisHistory = useSingleAnalysisStore((state) => state.singleAnalyses);

  return (
    <View className="w-full flex-1 gap-8 p-10">
      <View className="flex items-start justify-center gap-2">
        <Text allowFontScaling={false} style={{ fontSize: fs(32) }} className="font-medium">
          Seja bem vindo, tutor.
        </Text>
        <Text
          allowFontScaling={false}
          style={{ fontSize: fs(12) }}
          className="font-regular leading-5">
          Antes de começar, certifique-se de habilidar o uso da câmera durante o uso da aplicação.
        </Text>
      </View>
      <View className="flex w-full flex-col items-start justify-center gap-4">
        <View className="flex w-full flex-row items-center gap-2 border-b border-b-gray-400">
          <IconCirclePlus size={22} />
          <Text allowFontScaling={false} style={{ fontSize: fs(18) }} className=" font-semiBold">
            Nova Análise
          </Text>
        </View>
        <View className="flex w-full flex-col justify-center gap-8">
          <AnalysisOption
            title="Análise Simples"
            description="Será feita a análise de qualidade dedicada a uma ração."
            icon={IconTextScan2}
            onPress={() => router.push('analysis/single/new')}
          />
          <AnalysisOption
            title="Análise Comparativa"
            description="Será feita uma análise comparativa de qualidade entre duas ou mais rações."
            icon={IconLayersDifference}
            onPress={() => router.push('analysis/comparative/new')}
          />
        </View>
      </View>
      <View className="flex w-full flex-col items-start justify-center gap-4">
        <View className="flex w-full flex-row items-center gap-2 border-b border-b-gray-400">
          <IconHistory size={22} />
          <Text allowFontScaling={false} style={{ fontSize: fs(18) }} className="font-semiBold">
            Histórico
          </Text>
        </View>
        <View className="flex w-full flex-col justify-center gap-4">
          <AnalysisHistoryOption
            label="Análises Simples"
            amountAnalysis={singleAnalysisHistory.length}
            onPress={() => router.push('analysis/single/history')}
          />
          <AnalysisHistoryOption
            label="Análises Comparativas"
            amountAnalysis={0}
            onPress={() => router.push('analysis/comparative/history')}
          />
        </View>
      </View>
    </View>
  );
}
