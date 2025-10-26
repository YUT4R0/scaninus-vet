import { Button } from '@/components/Button';
import { colors } from '@/styles/colors';
import { fs } from '@/utils/responsive';
import { IconPlus } from '@tabler/icons-react-native';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';

import BottomSheet from '@gorhom/bottom-sheet';
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { Alert, Text, View } from 'react-native';
import AddFoodBottomSheet from '../_components/AddFoodBottomSheet';
import CropScreen, { EditedImageProps } from '../_components/CropScreen';
import ImageCard from '../_components/ImageCard';
const MAX_SIZE_BYTES = 1 * 1024 * 1024;

export default function Confirmation() {
  const { uri: uriParam } = useLocalSearchParams<{ uri: string }>();
  const [currentUri, setCurrentUri] = useState<string | undefined>(uriParam);

  const [isCropScreenOpen, setIsCropScreenOpen] = useState<boolean>(false);
  const [imageToEdit, setImageToEdit] = useState<string | null>(null);

  const bottomSheetRef = useRef<BottomSheet>(null);
  const handlePresentModalPress = useCallback(() => {
    bottomSheetRef.current?.expand();
  }, []);
  const handleCloseModalPress = useCallback(() => {
    bottomSheetRef.current?.close();
  }, []);

  const handleCapture = async () => {
    const { granted } = await ImagePicker.requestCameraPermissionsAsync();
    if (!granted) {
      Alert.alert('Permissão', 'Câmera é necessária.');
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const newUri = await processNewPhoto(result);
      if (newUri) {
        setCurrentUri(newUri);
      }
    }
  };

  const handleUploadFromGallery = async () => {
    const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!granted) {
      Alert.alert('Permissão', 'Acesso à galeria é necessário.');
      return;
    }

    let results = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 1,
      allowsEditing: false,
    });

    if (!results.canceled && results.assets && results.assets.length > 0) {
      const newUri = await processNewPhoto(results);
      if (newUri) {
        setCurrentUri(newUri);
        setImageToEdit(newUri);
        setIsCropScreenOpen(true);
      }
    }
  };

  const processNewPhoto = async (result: ImagePicker.ImagePickerResult) => {
    handleCloseModalPress();

    if (!result.canceled || result.assets !== null) {
      try {
        for (const [i, img] of result.assets.entries()) {
          const TEMP_FILE_NAME = `image_crop_${Date.now()}_${Math.random().toString(26).substring(2, 9)}_${i}.jpg`;

          const newUri = FileSystem.documentDirectory + TEMP_FILE_NAME;

          await FileSystem.deleteAsync(newUri, { idempotent: true });
          await FileSystem.copyAsync({
            from: img.uri,
            to: newUri,
          });

          return newUri;
        }
      } catch (error) {
        console.error('Erro ao mover/salvar arquivo:', error);
        Alert.alert('Erro', 'Não foi possível salvar a nova foto.');
      }
    }
  };

  const handleEdit = async (uriToEdit: string) => {
    setImageToEdit(uriToEdit);
    setIsCropScreenOpen(true);
  };

  const handleEditingComplete = (result: EditedImageProps) => {
    if (result.uri) {
      setCurrentUri(result.uri);
    }
    setImageToEdit(null);
    setIsCropScreenOpen(false);
  };

  const handleCancel = async () => {
    try {
      if (currentUri) {
        await FileSystem.deleteAsync(currentUri, { idempotent: true });
      }
    } catch (e) {
      console.warn('Erro ao deletar arquivo após cancelamento:', e);
    }
    router.replace('/analysis');
  };

  const compressImage = async (uriToCompress: string) => {
    let compressionQuality = 0.85;
    let attempt = 0;
    let fileUri = uriToCompress;
    let fileSize = 0;
    const MAX_COMPRESSION_ATTEMPTS = 10;

    let fileInfo = await FileSystem.getInfoAsync(fileUri, { size: true });
    if (fileInfo.exists && fileInfo.size !== undefined) {
      fileSize = fileInfo.size;
    } else {
      throw new Error('Arquivo não encontrado.');
    }

    while (fileSize > MAX_SIZE_BYTES && attempt < MAX_COMPRESSION_ATTEMPTS) {
      attempt++;
      compressionQuality = Math.max(0.5, compressionQuality - 0.15);

      const imageRef = await ImageManipulator.manipulate(fileUri).renderAsync();

      const compressedResult = await imageRef.saveAsync({
        compress: compressionQuality,
        format: SaveFormat.JPEG,
      });

      fileUri = compressedResult.uri;

      let newFileInfo = await FileSystem.getInfoAsync(fileUri, { size: true });
      if (newFileInfo.exists && newFileInfo.size !== undefined) {
        fileSize = newFileInfo.size;
      } else {
        Alert.alert(
          'Falha na Leitura',
          'Houve algum problema na leitura do arquivo comprimido. Tente novamente com uma outra imagem.',
          [{ text: 'OK', style: 'cancel' }]
        );
        return;
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

    return fileUri;
  };

  const handleSend = async () => {
    if (!currentUri) return;

    try {
      const compressedUri = await compressImage(currentUri);
      router.replace({
        pathname: './agent-response',
        params: { uri: compressedUri },
      });
    } catch (error: any) {
      Alert.alert(
        'Erro de Envio',
        error.message || 'Falha ao compactar uma das imagens para o limite de 1MB.'
      );
    }
  };

  const handleRemove = async (uriToRemove: string) => {
    Alert.alert(
      'Exluir Ração',
      'Você tem certeza que deseja excluir esta imagem (as edições não serão salvas)?',
      [
        {
          text: 'Cancelar',
          onPress: () => {
            return;
          },
        },
        {
          text: 'Excluir',
          onPress: async () => {
            try {
              await FileSystem.deleteAsync(uriToRemove, { idempotent: true });
              setCurrentUri(undefined);
            } catch (e) {
              console.warn('Erro ao deletar arquivo:', e);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

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
    <View className="flex-1 justify-between p-10">
      <View className="flex items-center justify-center">
        <Text
          allowFontScaling={false}
          style={{ fontSize: fs(25) }}
          className="text-center font-semiBold">
          Confirmar Rótulo
        </Text>
        <Text
          allowFontScaling={false}
          style={{ fontSize: fs(14) }}
          className="text-center font-regular leading-6">
          Antes de enviar para análise, certifique-se de que a legibilidade das informações esteja
          boa.
        </Text>
      </View>
      <View className="flex h-[70%] w-full items-center justify-center">
        {currentUri ? (
          <ImageCard onEdit={handleEdit} onRemove={handleRemove} uri={currentUri} />
        ) : (
          <ImageCard.Empty label="Nenhuma ração selecionada." />
        )}
      </View>

      <View className="mx-auto w-[50%]">
        {!currentUri && (
          <Button
            onPress={handlePresentModalPress}
            style={{
              backgroundColor: colors.blue.light,
              width: '100%',
              borderRadius: 25,
              borderWidth: 2,
              borderStyle: 'dashed',
              borderColor: colors.blue.dark,
            }}>
            <Button.Icon icon={IconPlus} />
            <Button.Title>Adicionar Ração</Button.Title>
          </Button>
        )}
      </View>

      <View className="mt-5 flex w-full flex-row items-center justify-between">
        <Button onPress={handleCancel} style={{ backgroundColor: colors.red.base, width: '45%' }}>
          <Button.Title>Cancelar</Button.Title>
        </Button>
        <Button onPress={handleSend} style={{ backgroundColor: colors.green.base, width: '45%' }}>
          <Button.Title>Enviar</Button.Title>
        </Button>
      </View>
      <AddFoodBottomSheet
        ref={bottomSheetRef}
        onClose={handleCloseModalPress}
        actions={{
          onCapture: handleCapture,
          onUpload: handleUploadFromGallery,
        }}
      />
    </View>
  );
}
