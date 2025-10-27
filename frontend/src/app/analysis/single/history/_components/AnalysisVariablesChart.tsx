import { EnnVariables } from '@/@types/enn-variables';
import { colors } from '@/styles/colors';
import { fs } from '@/utils/responsive';
import { SCREEN_WIDTH } from '@gorhom/bottom-sheet';
import { StyleSheet, Text, View } from 'react-native';
import { PieChart } from 'react-native-chart-kit';

type ChartProps = {
  variables: EnnVariables;
  enn: number;
};

export default function AnalysisVariablesChart({ variables, enn }: ChartProps) {
  const CHART_COLORS = {
    PB: '#4CAF50', // Proteína Bruta (Verde)
    EE: '#FFC107', // Extrato Etéreo (Amarelo)
    MF: '#9E9E9E', // Matéria Fibrosa (Cinza)
    MM: '#795548', // Matéria Mineral (Marrom)
    U: '#2196F3', // Umidade (Azul Claro)
    ENN: colors.red.base, // ENN (Laranja)
  };

  if (enn === null || !variables || typeof variables !== 'object') {
    return (
      <Text style={{ color: colors.gray[500], textAlign: 'center' }}>
        Dados insuficientes para o gráfico.
      </Text>
    );
  }

  const ennValue = parseFloat(enn.toString());
  const totalGarantia =
    (variables.PB || 0) +
    (variables.EE || 0) +
    (variables.MF || 0) +
    (variables.MM || 0) +
    (variables.U || 0) +
    ennValue;

  const chartData = [
    {
      name: '% ENN',
      percentage: ennValue,
      color: CHART_COLORS.ENN,
      legendFontColor: CHART_COLORS.ENN,
      legendFontSize: fs(16),
    },
    {
      name: '% U',
      percentage: variables.U,
      color: CHART_COLORS.U,
      legendFontColor: CHART_COLORS.U,
      legendFontSize: fs(12),
    },
    {
      name: '% PB',
      percentage: variables.PB,
      color: CHART_COLORS.PB,
      legendFontColor: CHART_COLORS.PB,
      legendFontSize: fs(12),
    },
    {
      name: '% EE',
      percentage: variables.EE,
      color: CHART_COLORS.EE,
      legendFontColor: CHART_COLORS.EE,
      legendFontSize: fs(12),
    },
    {
      name: '% MF',
      percentage: variables.MF,
      color: CHART_COLORS.MF,
      legendFontColor: CHART_COLORS.MF,
      legendFontSize: fs(12),
    },
    {
      name: '% MM',
      percentage: variables.MM,
      color: CHART_COLORS.MM,
      legendFontColor: CHART_COLORS.MM,
      legendFontSize: fs(12),
    },
  ].map((item) => ({
    ...item,
    // Renomeia 'percentage' para 'population' (exigido pelo chart-kit)
    population: item.percentage,
  }));

  // 3. Configurações de Aparência do Gráfico
  const chartConfig = {
    backgroundColor: colors.gray[100],
    backgroundGradientFrom: colors.gray[100],
    backgroundGradientTo: colors.gray[100],
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    decimalPlaces: 1,
  };

  return (
    <View style={chartStyles.chartContainer}>
      <PieChart
        data={chartData}
        width={SCREEN_WIDTH * 0.9} // Usa a largura da tela para responsividade
        height={220}
        chartConfig={chartConfig}
        accessor={'population'} // Campo que contém o valor
        backgroundColor={'transparent'}
        paddingLeft={'15'} // Afasta do eixo
        absolute
      />
      {/* O chart-kit renderiza a legenda automaticamente abaixo se tiver dados */}
    </View>
  );
}

const chartStyles = StyleSheet.create({
  chartContainer: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 5,
  },
  // ... (Outros estilos, removendo a lógica de Rosca manual)
});
