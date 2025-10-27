import { Button } from '@/components/Button';
import { colors } from '@/styles/colors';
import { fs } from '@/utils/responsive';
import { IconTrash } from '@tabler/icons-react-native';
import { useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

export default function AnalysisId() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View className="flex-1 px-10 pb-10">
      <Text
        allowFontScaling={false}
        style={{ fontSize: fs(28) }}
        className="w-full border-b text-center font-semiBold">
        Minha analise
      </Text>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 0, paddingVertical: 16, gap: 24 }}
        className="w-full">
        <View>
          <Button onPress={() => {}} style={{ backgroundColor: colors.red.base }}>
            <Button.Icon icon={IconTrash} />
            <Button.Title>Excluir Análise</Button.Title>
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}
