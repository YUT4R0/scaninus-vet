import { fs } from '@/utils/responsive';
import { IconLayersDifference, IconTextScan2 } from '@tabler/icons-react-native';
import { router } from 'expo-router';
import { Text, View } from 'react-native';
import AnalysisOption from './_components/AnalysisOption';

export default function Index() {
  return (
    <View className="flex-1 gap-12 px-10 py-16">
      <View className="flex items-center justify-center gap-4">
        <Text allowFontScaling={false} style={{ fontSize: fs(28) }} className="font-regular">
          Qual tipo de Análise deseja fazer?
        </Text>
        <Text
          allowFontScaling={false}
          style={{ fontSize: fs(14) }}
          className="font-regular leading-6">
          Antes de começar, certifique-se de habilidar o uso da câmera durante o uso da aplicação.
        </Text>
      </View>

      <View className="flex flex-col justify-center gap-8">
        <AnalysisOption
          title="Análise Simples"
          description="Será feita a análise de qualidade dedicada a uma ração."
          icon={IconTextScan2}
          onPress={() => router.push('analysis/single')}
        />
        <AnalysisOption
          title="Análise Comparativa"
          description="Será feita uma análise comparativa de qualidade entre duas ou mais rações."
          icon={IconLayersDifference}
          onPress={() => router.push('analysis/comparative')}
        />
      </View>
    </View>
  );
}
