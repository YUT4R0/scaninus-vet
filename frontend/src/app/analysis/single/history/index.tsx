import { useSingleAnalysisStore } from '@/store/single-analysis';
import { fs } from '@/utils/responsive';
import { ScrollView, Text, View } from 'react-native';
import EmptyAnalysisHistory from './_components/EmptyAnalysis';
import SingleAnalysisHistoryCard from './_components/SingleAnalysisHistoryCard';

export default function Index() {
  const analysisHistory = useSingleAnalysisStore((state) => state.singleAnalyses);

  return (
    <View className="w-full flex-1 p-10">
      <Text
        allowFontScaling={false}
        style={{ fontSize: fs(20) }}
        className=" border-b pb-1 font-medium">
        Minhas análises simples
      </Text>
      {analysisHistory.length === 0 ? (
        <EmptyAnalysisHistory label="Nenhuma análise simples salva até o momento." />
      ) : (
        <ScrollView contentContainerStyle={{ flexGrow: 0 }} className="w-full flex-1 pt-4">
          {analysisHistory.map((analysis, i) => (
            <SingleAnalysisHistoryCard key={i} analysis={analysis} />
          ))}
        </ScrollView>
      )}
    </View>
  );
}
