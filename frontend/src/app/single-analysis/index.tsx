import { Button } from '@/components/Button';
import { SingleAnalysisSteps } from '@/components/SingleAnalysisSteps';
import { colors } from '@/styles/colors';
import { fs } from '@/utils/responsive';
import { IconCamera, IconUpload } from '@tabler/icons-react-native';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';

import { router } from 'expo-router';
import { Alert, Text, View } from 'react-native';
import { CropParamsProps } from '../crop-screen';

export default function Index() {
  const [cameraPermission, requestCameraPermission] = ImagePicker.useCameraPermissions();

  const requestImagePickerPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access media library is required!');
      return false;
    }
    return true;
  };

  const saveToCrop = async (result: ImagePicker.ImagePickerResult) => {
    if (!result.canceled) {
      try {
        const TEMP_FILE_NAME = `image_crop_${Date.now()}.jpg`;
        const newUri = FileSystem.documentDirectory + TEMP_FILE_NAME;

        await FileSystem.deleteAsync(newUri, { idempotent: true });
        await FileSystem.moveAsync({
          from: result.assets[0].uri,
          to: newUri,
        });

        const params: CropParamsProps = {
          uri: newUri,
          from: 'single-analysis',
        };
        router.navigate({ pathname: 'single-analysis/confirmation', params });
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

    saveToCrop(result);
  };

  const handleImageUpload = async () => {
    const hasPermission = await requestImagePickerPermissions();
    if (!hasPermission) return;

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
    });

    saveToCrop(result);
  };

  return (
    <View className="flex flex-1 flex-col justify-between p-10">
      <Text
        allowFontScaling={false}
        style={{ fontSize: fs(28) }}
        className="text-center font-regular">
        Siga as Instruções
      </Text>
      <SingleAnalysisSteps />
      <View className="mt-5 flex flex-col gap-2">
        {!cameraPermission || !cameraPermission.granted ? (
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
            <Button style={{ backgroundColor: colors.blue.dark }} onPress={handleCapture}>
              <Button.Title>Conceder Permissão</Button.Title>
              <Button.Icon icon={IconCamera} />
            </Button>
          </View>
        ) : (
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
        )}
      </View>
    </View>
  );
}
