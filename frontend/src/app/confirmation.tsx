import { Button } from '@/components/Button';
import { colors } from '@/styles/colors';
import { fs } from '@/utils/responsive';
import * as FileSystem from 'expo-file-system'; // NOVO IMPORT
import { router, useLocalSearchParams } from 'expo-router';
import { Alert, Image, Text, View } from 'react-native';

export default function Confirmation() {
  const { uri } = useLocalSearchParams<{ uri: string }>();

  if (!uri) {
    Alert.alert('Erro', 'Nenhuma imagem para confirmação.');
    router.replace('/home');
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
    router.replace('/single-analysis'); // Volta para a tela inicial (instruções da câmera)
  };

  const handleSend = async () => {
    // Lógica de ENVIO da imagem para o backend
    Alert.alert('Sucesso!', 'Imagem enviada para análise!', [
      {
        text: 'OK',
        onPress: async () => {
          // Limpa o arquivo temporário após o envio bem-sucedido
          try {
            if (uri) {
              await FileSystem.deleteAsync(uri, { idempotent: true });
            }
          } catch (e) {
            console.warn('Erro ao deletar arquivo após envio:', e);
          }
          router.replace('/'); // Volta para a tela inicial (instruções da câmera)
        },
      },
    ]);
    // Aqui você faria a chamada API para enviar 'uri' ou o conteúdo da imagem.
  };

  return (
    <View className="flex-1 justify-between gap-12 px-10 py-16">
      <View className="flex h-[20%] items-center justify-center gap-2">
        <Text style={{ fontSize: fs(25) }} className="font-regular">
          Confirmar imagem a ser analisada
        </Text>
        <Text style={{ fontSize: fs(13) }} className="font-regular leading-5">
          Antes de enviar para análise, certifique-se de que a legibilidade das informações esteja
          boa.
        </Text>
      </View>
      <View className="flex h-[60%] w-full items-center justify-center rounded-md bg-gray-600 p-0">
        {uri ? (
          <Image source={{ uri }} style={{ height: '100%', width: '100%' }} resizeMode="contain" />
        ) : (
          <Text style={{ fontSize: fs(13) }} className="text-gray-400">
            Nenhuma imagem para exibir.
          </Text>
        )}
      </View>
      <View className="flex h-[10%] w-full flex-row items-center justify-center gap-10">
        <Button onPress={handleCancel} style={{ backgroundColor: colors.red.base, width: '50%' }}>
          <Button.Title>Cancelar</Button.Title>
        </Button>
        <Button onPress={handleSend} style={{ backgroundColor: colors.green.base, width: '50%' }}>
          <Button.Title>Enviar</Button.Title>
        </Button>
      </View>
    </View>
  );
}
