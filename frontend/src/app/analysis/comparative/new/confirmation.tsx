import { Button } from '@/components/Button';
import { colors } from '@/styles/colors';
import { fs } from '@/utils/responsive';
import BottomSheet from '@gorhom/bottom-sheet'; // NOVO IMPORT
import { IconPlus } from '@tabler/icons-react-native';
import * as FileSystem from 'expo-file-system';
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';

import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useRef, useState } from 'react';
import { Alert, ScrollView, Text, View } from 'react-native';
import { SELECTION_LIMIT } from '.';
import AddFoodBottomSheet from '../../_components/AddFoodBottomSheet';
import CropScreen, { EditedImageProps } from '../../_components/CropScreen';
import ImageCard from '../../_components/ImageCard';

const MAX_SIZE_BYTES = 1 * 1024 * 1024; // 1 MB

export default function Confirmation() {
  const { uris: urisParam } = useLocalSearchParams<{ uris: string | string[] }>();
  const initialUris = Array.isArray(urisParam) ? urisParam : urisParam ? urisParam.split(',') : [];
  const [currentUris, setCurrentUris] = useState<string[]>(initialUris);

  const [isCropScreenOpen, setIsCropScreenOpen] = useState<boolean>(false);
  const [imageToEdit, setImageToEdit] = useState<string | null>(null);

  const bottomSheetRef = useRef<BottomSheet>(null);
  const handlePresentModalPress = useCallback(() => {
    bottomSheetRef.current?.expand();
  }, []);
  const handleCloseModalPress = useCallback(() => {
    bottomSheetRef.current?.close();
  }, []);

  const processNewPhoto = async (result: ImagePicker.ImagePickerResult) => {
    handleCloseModalPress();

    if (currentUris.length >= SELECTION_LIMIT) {
      Alert.alert('Limite Atingido', `Você pode comparar no máximo ${SELECTION_LIMIT} rações.`);
      return;
    }
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

          setCurrentUris((prev) => [...prev, newUri]);
        }
      } catch (error) {
        console.error('Erro ao mover/salvar arquivo:', error);
        Alert.alert('Erro', 'Não foi possível salvar a nova foto.');
      }
    }
  };

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
      processNewPhoto(result);
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
      allowsMultipleSelection: true,
      aspect: [3, 4],
      selectionLimit: SELECTION_LIMIT - currentUris.length,
    });
    if (!results.canceled && results.assets && results.assets.length > 0) {
      processNewPhoto(results);
    }
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

  const handleEdit = async (uriToEdit: string) => {
    setIsCropScreenOpen(true);
    setImageToEdit(uriToEdit);
  };

  const handleEditingComplete = (result: EditedImageProps) => {
    if (result.uri) {
      const updatedImages = currentUris.map((uri) => (uri === imageToEdit ? result.uri : uri));
      setCurrentUris(updatedImages);
    }
    setImageToEdit(null);
    setIsCropScreenOpen(false);
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
              setCurrentUris((prev) => prev.filter((uri) => uri !== uriToRemove));
            } catch (e) {
              console.warn('Erro ao deletar arquivo:', e);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleCancelAll = async () => {
    Alert.alert(
      'Cancelar Preparação',
      'Você tem certeza que deseja cancelar a preparação (as alterações não serão salvas)?',
      [
        {
          text: 'Não',
          onPress: () => {
            return;
          },
        },
        {
          text: 'Sim',
          onPress: async () => {
            try {
              const deletePromises = currentUris.map((uri) =>
                FileSystem.deleteAsync(uri, { idempotent: true })
              );
              await Promise.all(deletePromises);
            } catch (e) {
              console.warn('Erro ao deletar arquivo após cancelamento:', e);
            } finally {
              router.replace('/analysis');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleSendBatch = async () => {
    if (currentUris.length < 2) {
      Alert.alert('Atenção', 'Você precisa de pelo menos 2 rações para a análise comparativa.');
      return;
    }

    try {
      const compressionPromises = currentUris.map((uri) => compressImage(uri));
      const compressedUris = await Promise.all(compressionPromises);

      router.replace({
        pathname: './agent-response',
        params: { uris: compressedUris.join(',') },
      });
    } catch (error: any) {
      Alert.alert(
        'Erro de Envio',
        error.message || 'Falha ao compactar uma das imagens para o limite de 1MB.'
      );
    }
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
    <View className="flex-1 items-center justify-between py-10">
      {/* 1. HEADER */}
      <View className="w-full items-center px-10">
        <Text
          allowFontScaling={false}
          style={{ fontSize: fs(25) }}
          className="text-center font-semiBold">
          {`Confirmar Rótulos (${currentUris.length}/${SELECTION_LIMIT})`}
        </Text>
        <Text
          allowFontScaling={false}
          style={{ fontSize: fs(14) }}
          className="text-center font-regular leading-6">
          Revise e ajuste as fotos antes de enviar o lote para análise.
        </Text>
      </View>

      {/* 2. SCROLLVIEW HORIZONTAL (CORREÇÃO DO SCROLL) */}
      <View className="flex h-[70%] w-full items-center justify-center">
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 10, alignItems: 'center' }}>
          {currentUris.length > 0 ? (
            currentUris.map((uri, i) => (
              <View key={i} className="flex-col items-center gap-1 py-5">
                <Text
                  allowFontScaling={false}
                  style={{ fontSize: fs(20) }}
                  className="text-center font-semiBold">
                  Ração Nº{i + 1}
                </Text>
                <ImageCard key={i} uri={uri} onEdit={handleEdit} onRemove={handleRemove} />
              </View>
            ))
          ) : (
            <ImageCard.Empty label="Nenhuma ração adicionada." />
          )}
        </ScrollView>
      </View>

      {/* 4. BOTÃO ADICIONAR Ração */}
      <View className="w-[50%]">
        {currentUris.length < SELECTION_LIMIT && (
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

      {/* 3. BOTÕES DE AÇÃO */}
      <View className="mt-5 flex w-full flex-row justify-between px-10">
        <Button
          onPress={handleCancelAll}
          style={{ backgroundColor: colors.red.base, width: '45%' }}>
          <Button.Title>Cancelar Tudo</Button.Title>
        </Button>
        <Button
          onPress={handleSendBatch}
          style={{ backgroundColor: colors.green.base, width: '45%' }}>
          <Button.Title>Analisar Lote</Button.Title>
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
