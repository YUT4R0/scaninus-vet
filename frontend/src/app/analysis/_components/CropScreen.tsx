import { ImageEditor } from 'expo-dynamic-image-crop';
import React, { useEffect, useState } from 'react';
import { Dimensions, Modal, StyleSheet, Text, View } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

export type EditedImageProps = {
  uri: string;
  width: number;
  height: number;
};

interface CropScreenProps {
  uri: string;
  onCancel: () => void;
  onComplete: (data: EditedImageProps) => void;
  isVisible: boolean;
}

export default function CropScreen({ onCancel, onComplete, uri, isVisible }: CropScreenProps) {
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

  return (
    <Modal animationType="slide" visible={isVisible} className="relative flex-1">
      <ImageEditor
        key={uri}
        isVisible={isVisible}
        imageUri={uri}
        dynamicCrop={true}
        onEditingComplete={onComplete}
        onEditingCancel={onCancel}
      />

      <Text style={styles.instructionOverlay}>
        Ajuste a moldura para selecionar *apenas* a tabela de Níveis de Garantia.
      </Text>
    </Modal>
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
