import { Button } from '@/components/Button';
import { colors } from '@/styles/colors';
import { router, useLocalSearchParams } from 'expo-router';
import { Text, View, Image, Alert } from 'react-native';
import * as FileSystem from 'expo-file-system'; // NOVO IMPORT


export default function Confirmation() {
    const { uri } = useLocalSearchParams<{ uri: string }>();

    if (!uri) {
      Alert.alert('Erro', 'Nenhuma imagem para confirmação.')
      router.replace('/home')
      return <View />
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
    <View className="flex-1 gap-12 px-10 py-28 justify-between">
      <View className="flex items-center justify-center gap-4 h-[20%]">
        <Text className="font-regular text-4xl">Confirmar imagem a ser analisada</Text>
        <Text className="font-regular text-lg">
          Antes de enviar para análise, certifique-se de que a legibilidade das informações esteja boa.
        </Text>
      </View>
      <View className='flex bg-gray-600 rounded-md p-0 justify-center items-center w-full h-[60%]'>
        {
          uri ? (
            <Image
          source={{ uri }}
          style={{ height: '100%', width: '100%' }}
          resizeMode='contain'
        />
          ) : (
              <Text className="text-gray-400 text-lg">Nenhuma imagem para exibir.</Text>
          )
        }
      </View>
      <View className='flex h-[10%] w-full justify-center items-center flex-row gap-10'>
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
