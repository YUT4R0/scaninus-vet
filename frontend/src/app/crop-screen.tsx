import { ImageEditor } from 'expo-dynamic-image-crop';
import * as FileSystem from 'expo-file-system'; // NOVO IMPORT
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Dimensions, StyleSheet, Text, View } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

export type CropParamsProps = {
  uri: string;
  from: string;
};

export default function CropScreen() {
  const { uri, from } = useLocalSearchParams<CropParamsProps>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (uri) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [uri]);

  if (!uri || isLoading) {
    return (
      <View className="flex-1">
        <Text style={{ color: 'white' }}>Carregando imagem...</Text>
      </View>
    );
  }

  const handleEditingComplete = (data: { uri: string; width: number; height: number }) => {
    router.navigate({ pathname: `${from}/confirmation`, params: { uri: data.uri } });
  };

  const handleCancel = async () => {
    try {
      if (uri) {
        await FileSystem.deleteAsync(uri, { idempotent: true });
      }
    } catch (e) {
      Alert.alert(
        'Atenção',
        'Houve um problema na remoção de cache da foto.',
        [{ text: 'OK', onPress: () => router.back() }],
        { cancelable: false }
      );
    }

    Alert.alert(
      'Atenção',
      'Edição cancelada. Refaça a captura.',
      [{ text: 'OK', onPress: () => router.back() }],
      { cancelable: false }
    );
  };

  return (
    <View className="relative flex-1">
      <ImageEditor
        key={uri}
        isVisible={true}
        imageUri={uri}
        dynamicCrop={true}
        onEditingComplete={handleEditingComplete}
        onEditingCancel={handleCancel}
      />

      <Text style={styles.instructionOverlay}>
        Ajuste a moldura para selecionar *apenas* a tabela de Níveis de Garantia.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  instructionOverlay: {
    position: 'absolute',
    top: '50%',
    width: screenWidth * 0.8,
    alignSelf: 'center',
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
    padding: 8,
    borderRadius: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 90,
  },
});
