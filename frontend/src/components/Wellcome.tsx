import { fs } from '@/utils/responsive';
import { Text, View } from 'react-native';
import { Step } from './Step';

export default function Wellcome() {
  const items = [
    'Umidade',
    'Proteína Bruta',
    'Extrato Etéreo (Gordura)',
    'Material Fibroso',
    'Material Mineral',
  ];

  return (
    <View className="flex-1 flex-col justify-between gap-10">
      {/* HEADER */}
      <View className="flex-col items-center justify-center gap-2">
        <Text style={{ fontSize: fs(30) }} className="font-extrabold">
          ScaninusVet 🐶
        </Text>
        <Text style={{ fontSize: fs(15) }} className="text-center font-semiBold">
          Cálculos Nutricionais Instantâneos
        </Text>
      </View>

      {/* BODY */}
      <View className="flex-1 flex-col gap-4">
        <Step
          title="Cansado de Rótulos confusos?"
          p1="ScaninusVet simplifica a complexa análise nutricional de rações caninas. Em segundos,
            transforme as informações do Niveis de Garantias em informações claras e acionáveis."
        />
        <Step
          title="Como funciona?"
          p1="O sistema calcula o percentual de ENN (Extrativos Não-Nitrogenados) com precisão por
            meio da leitura de informações como:"
          list={items}
          p2={`Nas quais serão escaneadas da sessão de "Níveis de garantia" na embalagem, economizando tempo e oferecendo análises detalhadas sobre o custo-benefício da ração.`}
        />
      </View>
    </View>
  );
}
