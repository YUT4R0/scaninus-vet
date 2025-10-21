import { Button } from '@/components/Button';
import { colors } from '@/styles/colors';
import { fs } from '@/utils/responsive';
import * as FileSystem from 'expo-file-system'; // NOVO IMPORT
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import { router, useLocalSearchParams } from 'expo-router';
import { Alert, Image, Text, View } from 'react-native';
const MAX_SIZE_BYTES = 1 * 1024 * 1024;

export default function Confirmation() {
  const { uri } = useLocalSearchParams<{ uri: string }>();

  if (!uri) {
    Alert.alert('Erro', 'Nenhuma imagem para confirmação.');
    router.replace('/analysis');
    return <View />;
  }

  const handleCancel = async () => {
    // Limpa o arquivo temporário se o usuário cancelar
    try {
      if (uri) {
        await FileSystem.deleteAsync(uri, { idempotent: true });
      }
    } catch (e) {
      console.warn('Erro ao deletar arquivo após cancelamento:', e);
    }
    router.replace('/'); // Volta para a tela inicial (instruções da câmera)
  };

  const handleSend = async () => {
    if (!uri) return;

    const MAX_COMPRESSION_ATTEMPTS = 10;
    let compressionQuality = 0.85;
    let attempt = 0;
    let currentUriToSend = uri;
    let fileSize = 0;

    const initialFileInfo = await FileSystem.getInfoAsync(currentUriToSend, { size: true });

    if (initialFileInfo.exists && initialFileInfo.size !== undefined) {
      fileSize = initialFileInfo.size;
    } else {
      Alert.alert('Erro', 'Arquivo de imagem não encontrado no cache.');
      return;
    }

    while (fileSize > MAX_SIZE_BYTES && attempt < MAX_COMPRESSION_ATTEMPTS) {
      attempt++;

      // Reduz a qualidade em passos, garantindo que não caia abaixo de 0.5 (50%)
      // Para a tentativa 1 (0.85 -> 0.70), Tentativa 2 (0.70 -> 0.55), etc.
      compressionQuality = Math.max(0.5, compressionQuality - 0.15);

      try {
        // CORREÇÃO: Usamos o ImageManipulator.manipulate para iniciar o contexto.
        // Aplicamos a compressão e obtemos o resultado em uma única cadeia de promises.

        // 1. Renderiza a imagem no contexto atual (sem ações, apenas para gerar o ImageRef)
        const imageRef = await ImageManipulator.manipulate(uri).renderAsync();

        // 2. Salva o resultado no disco com as opções de compressão
        const compressedResult = await imageRef.saveAsync({
          compress: compressionQuality,
          format: SaveFormat.JPEG,
        });

        currentUriToSend = compressedResult.uri;

        const newFileInfo = await FileSystem.getInfoAsync(currentUriToSend, { size: true });

        if (newFileInfo.exists && newFileInfo.size !== undefined) {
          fileSize = newFileInfo.size;
        } else {
          break;
        }

        console.log(
          `Tentativa ${attempt}: Qualidade ${Math.round(compressionQuality * 100)}%, Tamanho: ${Math.round(fileSize / 1024)}KB`
        );
      } catch (error) {
        console.error('Erro na compressão:', error);
        Alert.alert('Erro de Processamento', 'Falha ao comprimir a imagem.');
        break;
      }
    }

    if (fileSize > MAX_SIZE_BYTES) {
      Alert.alert(
        'Aviso de Tamanho',
        `A imagem (${Math.round(fileSize / 1024)}KB) ainda é muito grande (Máx: 1MB).`,
        [{ text: 'OK', style: 'cancel' }]
      );
      return;
    }
    router.replace({
      pathname: './single/agent-response',
      params: { uri: currentUriToSend },
    });
  };

  return (
    <View className="flex-1 justify-between gap-12 p-10">
      <View className="flex h-[20%] items-center justify-center gap-2">
        <Text allowFontScaling={false} style={{ fontSize: fs(28) }} className="font-regular">
          Confirmar imagem a ser analisada
        </Text>
        <Text
          allowFontScaling={false}
          style={{ fontSize: fs(14) }}
          className="font-regular leading-6">
          Antes de enviar para análise, certifique-se de que a legibilidade das informações esteja
          boa.
        </Text>
      </View>
      <View className="flex h-[60%] w-full items-center justify-center rounded-md bg-gray-600 p-0">
        {uri ? (
          <Image source={{ uri }} style={{ height: '100%', width: '100%' }} resizeMode="contain" />
        ) : (
          <Text allowFontScaling={false} style={{ fontSize: fs(13) }} className="text-gray-400">
            Nenhuma imagem para exibir.
          </Text>
        )}
      </View>
      <View className="flex h-[10%] w-full flex-row items-center justify-center gap-10">
        <Button onPress={handleCancel} style={{ backgroundColor: colors.red.base, width: '40%' }}>
          <Button.Title>Cancelar</Button.Title>
        </Button>
        <Button onPress={handleSend} style={{ backgroundColor: colors.green.base, width: '40%' }}>
          <Button.Title>Enviar</Button.Title>
        </Button>
      </View>
    </View>
  );
}
