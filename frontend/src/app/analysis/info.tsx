import { Button } from '@/components/Button';
import { Step } from '@/components/Step';
import { fs } from '@/utils/responsive';
import { router } from 'expo-router';
import { Text, View } from 'react-native';

const items = [
  'Umidade',
  'Proteína Bruta',
  'Extrato Etéreo (Gordura)',
  'Material Fibroso',
  'Material Mineral',
];

export default function Info() {
  return (
    <View className="flex-1 flex-col items-center justify-around p-10">
      <Text allowFontScaling={false} style={{ fontSize: fs(32) }} className=" font-bold">
        Sobre o Sistema
      </Text>
      <View className="flex flex-col items-center gap-5">
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
      <Button onPress={() => router.replace('/analysis')} style={{ width: '100%' }}>
        <Button.Title>Entendi</Button.Title>
      </Button>
    </View>
  );
}
