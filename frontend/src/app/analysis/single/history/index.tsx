import { colors } from '@/styles/colors';
import { fs } from '@/utils/responsive';
import { IconBoneOff } from '@tabler/icons-react-native';
import * as Crypto from 'expo-crypto';
import { router } from 'expo-router';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

interface AnalysisData {
  id: string;
  status: 'IMPRECISA' | 'COMPLETA';
  imageUri: string;
  title: string;
  enn: number;
  description: string;
  suggestion: string;
  date: string;
}

export const MOCKED_ANALYSES: AnalysisData[] = [
  {
    id: Crypto.randomUUID(),
    status: 'COMPLETA',
    imageUri: 'https://via.placeholder.com/150/FFD700/000000?text=Racao1', // Imagem de exemplo
    title: 'Minha Primeira Análise',
    enn: 34,
    description:
      'Esta ração apresenta um bom balanço de nutrientes para cães adultos de porte médio, com destaque para a alta concentração de proteínas. No entanto, o teor de matéria fibrosa é um pouco abaixo do ideal para promover uma boa saúde intestinal.',
    suggestion:
      'Considere complementar com fontes de fibra natural, como abóbora cozida, ou buscar uma ração com teor de fibra ligeiramente superior.',
    date: '28/10/2025',
  },
  {
    id: Crypto.randomUUID(),
    status: 'COMPLETA',
    imageUri: 'https://via.placeholder.com/150/ADD8E6/000000?text=Racao2', // Imagem de exemplo
    title: 'Análise Ração Premium',
    enn: 42,
    description:
      'Excelente perfil nutricional, com destaque para a alta digestibilidade e proporções equilibradas de ácidos graxos essenciais. Ideal para cães com alta demanda energética ou em fase de crescimento.',
    suggestion:
      'Mantenha a dieta conforme as recomendações do fabricante. Não há necessidade de suplementos adicionais.',
    date: '15/11/2025',
  },
  {
    id: Crypto.randomUUID(),
    status: 'IMPRECISA',
    imageUri: 'https://via.placeholder.com/150/FF6347/000000?text=Racao3', // Imagem de exemplo
    title: 'Ração de Manutenção',
    enn: 28,
    description:
      'Adequada para cães adultos com nível de atividade moderado. O teor de proteína é suficiente, mas a presença de aditivos artificiais deve ser observada em cães sensíveis.',
    suggestion:
      'Se o cão apresentar sensibilidade ou alergias, procure alternativas com ingredientes mais naturais e sem corantes.',
    date: '03/12/2025',
  },
];

export default function Index() {
  const colorMap = {
    IMPRECISA: colors.red.base,
    COMPLETA: colors.green.light,
  };

  return (
    <View className="w-full flex-1 p-10">
      <Text
        allowFontScaling={false}
        style={{ fontSize: fs(20) }}
        className=" border-b pb-1 font-medium">
        Minhas análises simples
      </Text>
      {MOCKED_ANALYSES.length === 0 ? (
        <View className="flex h-full w-full flex-col items-center justify-center gap-5 p-3">
          <IconBoneOff size={48} color={colors.gray[400]} />
          <Text
            allowFontScaling={false}
            style={{ fontSize: fs(14), color: colors.gray[400] }}
            className="text-center font-medium">
            Nenhuma análise simples salva até o momento.
          </Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ flexGrow: 0 }} className="w-full flex-1 pt-4">
          {MOCKED_ANALYSES.map((analysis, i) => (
            <TouchableOpacity
              key={i}
              style={{ elevation: 3, borderColor: colorMap[analysis.status] }}
              onPress={() => router.navigate(`./history/${analysis.id}`)}
              className="relative mx-auto mb-6 flex h-32 w-[99%] flex-col items-center justify-center overflow-hidden rounded-2xl border-[1px] bg-gray-200 p-3 pl-11">
              <View
                style={{ backgroundColor: colorMap[analysis.status] }}
                className="absolute left-0 h-32 w-8"
              />
              <View className="flex w-full flex-row gap-2">
                <View className="flex h-full w-[30%]">
                  <View style={{ elevation: 3, borderRadius: 12 }} className="h-24 w-24">
                    <View style={{ borderRadius: 12 }} className="h-full w-full bg-yellow-200" />
                  </View>
                </View>
                <View className="flex h-full w-[70%] flex-col justify-between">
                  <View className="flex flex-col">
                    <Text
                      allowFontScaling={false}
                      style={{ fontSize: fs(16) }}
                      className="font-semiBold">
                      {analysis.title}
                    </Text>
                    <Text
                      allowFontScaling={false}
                      style={{ fontSize: fs(14) }}
                      className="font-medium">
                      ENN: {analysis.enn ? `${analysis.enn}%` : 'Indeterminado'}
                    </Text>
                  </View>
                  <Text
                    allowFontScaling={false}
                    style={{ fontSize: fs(12) }}
                    className=" font-regular">
                    {analysis.date}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
}
