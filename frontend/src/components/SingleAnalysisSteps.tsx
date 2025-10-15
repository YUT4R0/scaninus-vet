import { View } from 'react-native';
import { Step } from './Step';

export function SingleAnalysisSteps() {
  return (
    <View className="flex flex-col gap-5">
      <Step
        title="1 - Capture a Área de Garantia"
        p1={`Posicione a câmera sobre a seção "Níveis de Garantia" da embalagem da ração. Certifique-se de ter boa luz e que o texto não esteja com reflexos ou muito embaçado.`}
      />
      <Step
        title="2 - Ajuste e Isole o Texto"
        p1={`Após tirar a foto, use as bordas do quadro para cortar (crop) e isolar apenas a tabela ou parágrafo que contém os valores (Umidade, PB, EE, etc.).`}
      />
      <Step
        title="3 - Confirme a Legibilidade"
        p1={`Na tela de pré-visualização, confira se todos os valores nutricionais estão visíveis e legíveis no corte. Se o texto estiver borrado ou incompleto, toque em "Refazer".`}
      />
      <Step
        title="4 - Análise de ENN"
        p1={`Ao confirmar o envio, o ScaninusVet fará o processamento da imagem cortada, calculará o ENN e fornecerá um resumo rápido da qualidade da ração.`}
      />
    </View>
  );
}
