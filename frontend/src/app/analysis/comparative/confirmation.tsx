import { Button } from '@/components/Button';
import { colors } from '@/styles/colors';
import { fs } from '@/utils/responsive';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet'; // NOVO IMPORT
import { IconCamera, IconUpload, IconX } from '@tabler/icons-react-native';
import * as FileSystem from 'expo-file-system';
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';

import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useRef, useState } from 'react';
import {
  Alert,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SELECTION_LIMIT } from '.';
import CropScreen, { EditedImageProps } from './_components/CropScreen';
import ImageCard from './_components/ImageCard';

const { width: screenWidth } = Dimensions.get('window');
const MAX_SIZE_BYTES = 1 * 1024 * 1024; // 1 MB

export default function Confirmation() {
  // CORREÇÃO: Recebendo o parâmetro 'uris' (string separada por vírgula)
  const { uris: urisParam } = useLocalSearchParams<{ uris: string | string[] }>();

  // Converte o parâmetro para um array de URIs
  const initialUris = Array.isArray(urisParam) ? urisParam : urisParam ? urisParam.split(',') : [];

  // Estado que armazena a lista ATUAL de URIs
  const [currentUris, setCurrentUris] = useState<string[]>(initialUris);

  // Estado que armazena a lista ATUAL de URIs
  const [isCropScreenOpen, setIsCropScreenOpen] = useState<boolean>(false);
  const [imageToEdit, setImageToEdit] = useState<string | null>(null);

  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = ['25%'];

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

    // Loop de compressão (tentativas de 0.85 até 0.50)
    while (fileSize > MAX_SIZE_BYTES && attempt < MAX_COMPRESSION_ATTEMPTS) {
      attempt++;
      compressionQuality = Math.max(0.5, compressionQuality - 0.15);

      const result = await ImageManipulator.manipulateAsync(fileUri, [], {
        compress: compressionQuality,
        format: SaveFormat.JPEG,
      });

      // O URI de compressão deve ser lido para verificar o novo tamanho
      fileUri = result.uri;

      let newFileInfo = await FileSystem.getInfoAsync(fileUri, { size: true });
      if (newFileInfo.exists && newFileInfo.size !== undefined) {
        fileSize = newFileInfo.size;
      } else {
        throw new Error('Falha na leitura do arquivo comprimido.');
      }
    }

    if (fileSize > MAX_SIZE_BYTES) {
      // Se ainda for muito grande, retorna um erro para ser tratado no handleSendBatch
      throw new Error(`O arquivo ${Math.round(fileSize / 1024)}KB é grande demais.`);
    }

    return fileUri; // Retorna o URI comprimido final
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
      'Exluir imagem',
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
    // Limpa TODOS os arquivos e volta para o início
    const deletePromises = currentUris.map((uri) =>
      FileSystem.deleteAsync(uri, { idempotent: true })
    );
    await Promise.all(deletePromises);
    router.replace('/');
  };

  const handleSendBatch = async () => {
    if (currentUris.length < 2) {
      Alert.alert('Atenção', 'Você precisa de pelo menos 2 rações para a análise comparativa.');
      return;
    }

    try {
      // 1. COMPRESSÃO EM LOTE (Paralela)
      const compressionPromises = currentUris.map((uri) => compressImage(uri));
      const compressedUris = await Promise.all(compressionPromises);

      // 2. NAVEGAÇÃO PARA A TELA DE ANÁLISE
      router.replace({
        pathname: './comparative/agent-response',
        params: { uris: compressedUris.join(',') }, // Envia o novo array de URIs como string
      });
    } catch (error: any) {
      // Captura erros de compressão/tamanho
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
    <View style={styles.container}>
      {/* 1. HEADER */}
      <View style={styles.header}>
        <Text
          allowFontScaling={false}
          style={{ fontSize: fs(25) }}
          className="text-center font-semiBold">
          {`Confirmar Rótulos (${currentUris.length}/${SELECTION_LIMIT})`}
        </Text>
        <Text
          allowFontScaling={false}
          style={{ fontSize: fs(13) }}
          className="text-center font-regular leading-5 text-gray-600">
          Revise e ajuste as fotos antes de enviar o lote para análise.
        </Text>
      </View>

      {/* 2. SCROLLVIEW HORIZONTAL (CORREÇÃO DO SCROLL) */}
      <View className="flex h-[60%] w-full items-center justify-center">
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.flatlistContent}>
          {currentUris.length > 0 ? (
            currentUris.map((uri) => (
              <ImageCard key={uri} uri={uri} onEdit={handleEdit} onRemove={handleRemove} />
            ))
          ) : (
            <View style={styles.emptyList}>
              <Text allowFontScaling={false} style={{ fontSize: fs(16) }} className="text-gray-400">
                Nenhuma ração adicionada.
              </Text>
            </View>
          )}
        </ScrollView>
      </View>

      {/* 3. BOTÕES DE AÇÃO */}
      <View style={styles.footer}>
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

      {/* 4. BOTÃO ADICIONAR Ração */}
      <View style={styles.actionButtons}>
        {currentUris.length < SELECTION_LIMIT && (
          <Button
            onPress={handlePresentModalPress}
            style={{ backgroundColor: colors.blue.light, width: '100%' }}>
            <Button.Icon icon={IconCamera} />
            <Button.Title>Adicionar Ração</Button.Title>
          </Button>
        )}
      </View>

      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        backgroundStyle={{ backgroundColor: colors.gray[100] }}
        handleIndicatorStyle={{ backgroundColor: colors.gray[400] }}>
        <BottomSheetView style={styles.sheetContent}>
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>Adicionar Ração</Text>
            <TouchableOpacity onPress={handleCloseModalPress}>
              <IconX size={24} color={colors.gray[600]} />
            </TouchableOpacity>
          </View>
          <Button style={styles.sheetButton} onPress={handleCapture}>
            <Button.Icon icon={IconCamera} />
            <Button.Title>Tirar Nova Foto</Button.Title>
          </Button>
          <Button
            style={[styles.sheetButton, { backgroundColor: colors.green.light }]}
            onPress={handleUploadFromGallery}>
            <Button.Icon icon={IconUpload} />
            <Button.Title>Selecionar da Galeria</Button.Title>
          </Button>
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
}

// --- Estilos ---
const styles = StyleSheet.create({
  sheetContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  sheetTitle: {
    fontSize: fs(20),
    fontWeight: 'bold',
    color: colors.gray[600],
  },
  sheetButton: {
    marginBottom: 10,
    backgroundColor: colors.blue.base,
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  header: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  flatlistContent: {
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  emptyList: {
    width: screenWidth - 40,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 10,
  },
  actionButtons: {
    width: '100%',
    marginTop: 10,
  },
});
