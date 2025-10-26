import { Button } from '@/components/Button';
import { colors } from '@/styles/colors';
import { fs } from '@/utils/responsive';
import { IconCamera, IconUpload } from '@tabler/icons-react-native';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { Alert, Text, View } from 'react-native';
import ComparativeAnalysisSteps from './_components/ComparativeAnalysisSteps';

export const SELECTION_LIMIT = 3;

export default function Index() {
  const [cameraPermission, requestCameraPermission] = ImagePicker.useCameraPermissions();
  const [mediaLibraryPermission, requestMediaLibraryPermission] =
    ImagePicker.useMediaLibraryPermissions();

  const handleSaving = async (result: ImagePicker.ImagePickerResult) => {
    if (!result.canceled || result.assets !== null) {
      try {
        const uris: string[] = [];
        for (const [i, img] of result.assets.entries()) {
          const TEMP_FILE_NAME = `image_crop_${Date.now()}_${Math.random().toString(26).substring(2, 9)}_${i}.jpg`;

          const newUri = FileSystem.documentDirectory + TEMP_FILE_NAME;

          await FileSystem.deleteAsync(newUri, { idempotent: true });
          await FileSystem.copyAsync({
            from: img.uri,
            to: newUri,
          });

          uris.push(newUri);
        }
        router.navigate({
          pathname: './comparative/confirmation',
          params: { uris: uris.join(',') },
        });
      } catch (error) {
        console.error('Erro ao mover/salvar arquivo:', error);
        Alert.alert(
          'Erro',
          'Não foi possível preparar a imagem local para edição. Tente novamente.'
        );
      }
    }
  };

  const handleCapture = async () => {
    if (!cameraPermission?.granted) {
      const { granted } = await requestCameraPermission();
      if (!granted) return Alert.alert('Erro', 'Permissão de Câmera é obrigatória.');
    }

    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
      cameraType: ImagePicker.CameraType.back,
    });

    handleSaving(result);
  };

  const handleImageUpload = async () => {
    if (!mediaLibraryPermission?.granted) {
      const { granted } = await requestMediaLibraryPermission();
      if (!granted) {
        Alert.alert('Erro', 'Permissão de Galeria é obrigatória para fazer upload.');
        return;
      }
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 1,
      allowsMultipleSelection: true,
      aspect: [3, 4],
      selectionLimit: SELECTION_LIMIT,
    });

    handleSaving(result);
  };

  const isReady = cameraPermission?.granted && mediaLibraryPermission?.granted;
  const renderPermissionView = !cameraPermission?.granted || !mediaLibraryPermission?.granted;

  return (
    <View className="flex flex-1 flex-col justify-between p-10">
      <Text
        allowFontScaling={false}
        style={{ fontSize: fs(28) }}
        className="text-center font-regular">
        Siga as Instruções
      </Text>
      <ComparativeAnalysisSteps />
      <View className="mt-5 flex flex-col gap-2">
        {renderPermissionView ? (
          <View className="mx-auto mt-5 flex flex-col gap-2 rounded-2xl border-[1px] border-gray-400 bg-yellow-50 px-10 py-6">
            <Text
              allowFontScaling={false}
              style={{ fontSize: fs(12) }}
              className="text-center font-semiBold leading-3">
              Permissão Necessária
            </Text>
            <Text
              allowFontScaling={false}
              style={{ fontSize: fs(10) }}
              className="text-center font-regular">
              Acesso à Câmera é obrigatório para escanear rótulos.
            </Text>
            <Button
              style={{ backgroundColor: colors.blue.dark }}
              onPress={() => {
                requestCameraPermission();
                requestMediaLibraryPermission();
              }}>
              <Button.Title>Conceder Permissão</Button.Title>
              <Button.Icon icon={IconCamera} />
            </Button>
          </View>
        ) : (
          isReady && (
            <>
              <Button style={{ backgroundColor: colors.blue.base }} onPress={handleCapture}>
                <Button.Icon icon={IconCamera} />
                <Button.Title>Iniciar Captura</Button.Title>
              </Button>
              <Text allowFontScaling={false} className="text-center font-regular">
                ou
              </Text>
              <Button style={{ backgroundColor: colors.green.light }} onPress={handleImageUpload}>
                <Button.Icon icon={IconUpload} />
                <Button.Title>Fazer Upload</Button.Title>
              </Button>
            </>
          )
        )}
      </View>
    </View>
  );
}
