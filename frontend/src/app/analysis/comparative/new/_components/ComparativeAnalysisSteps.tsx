import { Step } from '@/components/Step';
import { View } from 'react-native';

export default function ComparativeAnalysisSteps() {
  return (
    <View className="flex flex-col gap-5">
      <Step
        title="1 - Prepare e Capture"
        p1={`Inicie a câmera e tire a foto da tabela de "Níveis de Garantia" da primeira ração. Garanta que a iluminação esteja boa.`}
      />
      <Step
        title="2 - Ajuste de Área"
        p1={`Na tela de edição, use a moldura para isolar APENAS as informações essenciais (Umidade, PB, EE, MF, MM). Isto garante a leitura correta do conteúdo.`}
      />
      <Step
        title="3 - Confirme e Adicione"
        p1={`Após o corte, a foto será adicionada à sua lista de comparação. Você pode continuar tirando fotos até um máximo de 3 rações.`}
      />
      <Step
        title="4 - Gerencie e Envie"
        p1={`Na tela de confirmação, revise a lista. Você pode excluir uma ração ou adicionar outra (até o limite). O sistema exige um mínimo de 2 rações para iniciar a análise.`}
      />
    </View>
  );
}
