import { AnalysisOption } from '@/components/AnalysisOption';
import { router } from 'expo-router';
import { Text, View } from 'react-native';

export default function Home() {
  return (
    <View className="flex-1 gap-12  px-10 py-28">
      <View className="flex items-center justify-center gap-4">
        <Text className="font-regular text-4xl">Qual tipo de Análise deseja fazer?</Text>
        <Text className="font-regular text-lg">
          Antes de começar, certifique-se de habilidar o uso da câmera durante o uso da aplicação.
        </Text>
      </View>

      <View className="flex flex-col justify-center gap-8">
        <AnalysisOption
          title="Análise Simples"
          description="Será feita a análise de qualidade dedicada a uma ração."
          onPress={() => router.navigate('/single-analysis')}
        />
        <AnalysisOption
          title="Análise Comparativa"
          description="Será feita uma análise comparativa de qualidade entre duas ou mais rações."
        />
      </View>
    </View>
  );
}
