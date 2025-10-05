import { Button } from '@/components/Button';
import { SingleAnalysisSteps } from '@/components/SingleAnalysisSteps';
import { colors } from '@/styles/colors';
import { IconArrowBack, IconCamera, IconPhoto } from '@tabler/icons-react-native'; // Mudei IconPlus para IconPhoto, mais intuitivo
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as FileSystem from 'expo-file-system'; // NOVO IMPORT
import * as MediaLibrary from 'expo-media-library'; // Certifique-se de que está importado
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';

const TEMP_FILE_NAME = 'cropped_photo.jpg'; // Nome fixo para o arquivo

export default function Index() {
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [isCapturing, setIsCapturing] = useState(false);
  const [mediaLibraryPermission, requestMediaLibraryPermission] = MediaLibrary.usePermissions();
  const cameraRef = useRef<CameraView | null>(null);

  const startCapture = async () => {
    if (!cameraPermission?.granted) {
      const { granted } = await requestCameraPermission();
      if (!granted) return Alert.alert('Erro', 'Permissão de Câmera é obrigatória.');
    }

    // 2. Verifica permissão do Media Library
    if (!mediaLibraryPermission?.granted) {
      const { granted } = await requestMediaLibraryPermission();
      if (!granted)
        return Alert.alert('Erro', 'Permissão de Mídia é obrigatória para processar a imagem.');
    }

    setIsCapturing(true);
  };

  const takePictureHandler = async () => {
    if (cameraRef.current) {
      // CORREÇÃO: Usamos takePicture() na nova API
      const photo = await cameraRef.current.takePictureAsync({
        quality: 1,
      });

      if (photo) {
        setIsCapturing(false);
        try {
          const newUri = FileSystem.documentDirectory + TEMP_FILE_NAME;

          await FileSystem.deleteAsync(newUri, { idempotent: true });
          await FileSystem.moveAsync({
            from: photo.uri,
            to: newUri,
          });

          // 3. Navega para a tela de crop com o NOVO URI (seguro)
          router.push({ pathname: '/crop-screen', params: { uri: newUri } });
        } catch (error) {
          console.error('Erro ao mover/salvar arquivo:', error);
          Alert.alert('Erro', 'Não foi possível preparar a foto para edição. Tente novamente.');
        }
      }
    }
  };

  // --- Renderização de Permissão (Permanece inalterada) ---
  if (!cameraPermission) {
    return <View className="flex flex-1 bg-white" />;
  }

  if (!cameraPermission.granted) {
    // ... (código para solicitar permissão) ...
    return (
      <View className="flex flex-1 flex-col justify-evenly bg-white p-10">
        <Text className="text-center font-regular text-4xl">Permissão Necessária</Text>
        <Text className="mt-4 text-center font-regular text-lg">
          Acesso à Câmera é obrigatório para escanear rótulos.
        </Text>
        <Button style={{ backgroundColor: colors.blue.base }} onPress={() => startCapture()}>
          <Button.Title>Conceder Permissão</Button.Title>
          <Button.Icon icon={IconCamera} />
        </Button>
      </View>
    );
  }

  // --- RENDERIZAÇÃO DA CÂMERA ---
  if (isCapturing) {
    return (
      <View style={{ flex: 1, backgroundColor: 'black' }}>
        <CameraView ref={cameraRef} style={{ flex: 1 }} facing="back">
          <View className="flex-1 justify-end bg-transparent p-6">
            <TouchableOpacity
              onPress={() => setIsCapturing(false)}
              style={{ position: 'absolute', left: 20, top: 50, zIndex: 10 }}
              className="rounded-full bg-gray-900/50 p-2">
              <IconArrowBack size={30} color="white" />
            </TouchableOpacity>

            <View className="absolute bottom-10 w-full flex-row items-center justify-center">
              <TouchableOpacity
                onPress={takePictureHandler}
                className="h-20 w-20 items-center justify-center rounded-full border-4 border-white bg-white/30">
                <IconPhoto size={30} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </CameraView>
      </View>
    );
  }

  // --- RENDERIZAÇÃO DA TELA DE INSTRUÇÕES ---
  return (
    <View className="flex flex-1 flex-col justify-evenly bg-white p-10">
      <Text className="text-center font-regular text-4xl">Siga as Instruções</Text>
      <SingleAnalysisSteps />
      <View className="mb-10">
        <Button style={{ backgroundColor: colors.blue.base }} onPress={startCapture}>
          <Button.Title>Iniciar Captura</Button.Title>
          <Button.Icon icon={IconCamera} />
        </Button>
      </View>
    </View>
  );
}
