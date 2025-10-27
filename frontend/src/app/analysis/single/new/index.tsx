import { Button } from '@/components/Button';
import { colors } from '@/styles/colors';
import { fs } from '@/utils/responsive';
import { IconCamera, IconUpload } from '@tabler/icons-react-native';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';

import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Text, View } from 'react-native';
import CropScreen, { EditedImageProps } from '../../_components/CropScreen';
import SingleAnalysisSteps from './_components/SingleAnalysisSteps';

export default function Index() {
  const [cameraPermission, requestCameraPermission] = ImagePicker.useCameraPermissions();
  const [mediaLibraryPermission, requestMediaLibraryPermission] =
    ImagePicker.useMediaLibraryPermissions();

  const [isCropScreenOpen, setIsCropScreenOpen] = useState<boolean>(false);
  const [imageToEdit, setImageToEdit] = useState<string | null>(null);

  const handleSaving = async (result: ImagePicker.ImagePickerResult) => {
    if (!result.canceled) {
      try {
        const TEMP_FILE_NAME = `image_crop_${Date.now()}.jpg`;
        const newUri = FileSystem.documentDirectory + TEMP_FILE_NAME;

        await FileSystem.deleteAsync(newUri, { idempotent: true });
        await FileSystem.moveAsync({
          from: result.assets[0].uri,
          to: newUri,
        });

        return newUri;
      } catch (error) {
        console.error('Erro ao mover/salvar arquivo:', error);
        Alert.alert(
          'Erro',
          'Não foi possível preparar a imagem local para edição. Tente novamente.'
        );
      }
    }
  };

  const gotoConfirmation = (uri?: string) => {
    if (uri) {
      const params = {
        uri,
      };
      router.navigate({ pathname: './new/confirmation', params });
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

    const newUri = await handleSaving(result);
    gotoConfirmation(newUri);
  };

  const handleEditingComplete = (result: EditedImageProps) => {
    setImageToEdit(null);
    setIsCropScreenOpen(false);
    gotoConfirmation(result.uri);
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
    });

    const newUri = await handleSaving(result);
    if (newUri) {
      setImageToEdit(newUri);
      setIsCropScreenOpen(true);
    }
  };

  const isReady = cameraPermission?.granted && mediaLibraryPermission?.granted;
  const renderPermissionView = !cameraPermission?.granted || !mediaLibraryPermission?.granted;

  if (isCropScreenOpen && imageToEdit) {
    return (
      <CropScreen
        onCancel={() => {
          setIsCropScreenOpen(false);
          setImageToEdit(null);
        }}
        onComplete={handleEditingComplete}
        uri={imageToEdit}
        key={imageToEdit}
        isVisible={isCropScreenOpen}
      />
    );
  }

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
        {renderPermissionView ? (
          <View className="mx-auto flex flex-col gap-2 rounded-2xl border-[1px] border-gray-400 bg-yellow-50 px-10 py-6">
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
