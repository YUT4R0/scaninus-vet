import { IconArrowBack } from '@tabler/icons-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ImageEditor } from 'expo-dynamic-image-crop';
import * as FileSystem from 'expo-file-system'; // NOVO IMPORT


const { width: screenWidth } = Dimensions.get('window');

export default function CropScreen() {
  const { uri } = useLocalSearchParams<{ uri: string }>();
  const [isLoading, setIsLoading] = useState(true); // Estado de Carregamento/Inicialização

      useEffect(() => {
        if (uri) {
            // Um pequeno delay pode ajudar o React a garantir que a View está pronta
            const timer = setTimeout(() => {
                setIsLoading(false);
            }, 50); // Delay mínimo
            return () => clearTimeout(timer);
        }
    }, [uri]);

  if (!uri || isLoading) {
            return <View style={styles.container}><Text style={{color: 'white'}}>Carregando imagem...</Text></View>;

  }


  // Chamado quando o usuário clica em 'Confirmar' no editor
  const handleEditingComplete = (data: { uri: string; width: number; height: number }) => {
    // 1. O URI retornado (data.uri) é o da imagem FINAL, cortada e comprimida.

    // 2. Limpeza (Opcional, mas se o ImageEditor for inteligente o suficiente para não deixar lixo)
    // O ImageEditor deve retornar um URI novo e temporário, pronto para envio.

    // 3. Navegar para a tela de confirmação.
    router.replace({ pathname: '/confirmation', params: { uri: data.uri } });
  };

  // Chamado quando o usuário cancela a edição
  const handleCancel = async () => {
     try {
        if (uri) {
           await FileSystem.deleteAsync(uri, { idempotent: true }); 
        }
    } catch(e) {
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
    // Usa View com flex-1 para garantir que o ImageEditor ocupe toda a área.
    <View style={styles.container}>
      {/* 1. Componente ImageEditor */}
      <ImageEditor
      key={uri}
        isVisible={true}
        imageUri={uri} // URI da foto vinda da CameraView
        dynamicCrop={true}
        // Callbacks de resultado
        onEditingComplete={handleEditingComplete}
        onEditingCancel={handleCancel}
      />

      {/* 2. Botão de Cancelamento de Overlay (para UX, se o ImageEditor não tiver um nativo claro) */}
      <SafeAreaView style={styles.escapeButtonContainer} edges={['top']}>
        {/* Usamos o handleCancel principal */}
        <TouchableOpacity onPress={handleCancel} className="rounded-full bg-gray-900/50 p-2">
          <IconArrowBack size={30} color="white" />
        </TouchableOpacity>
      </SafeAreaView>

      {/* 3. Instrução em Overlay (Opcional) */}
      <Text style={styles.instructionOverlay}>
        Ajuste a moldura para selecionar *apenas* a tabela de Níveis de Garantia.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black', // Garante que a tela de fundo seja preta
  },
  escapeButtonContainer: {
    position: 'absolute',
    left: 10,
    top: StatusBar.currentHeight || 40, // Abaixo da barra de status
    zIndex: 100,
  },
  instructionOverlay: {
    position: 'absolute',
    top: (StatusBar.currentHeight || 40) + 50, // Abaixo do botão de voltar
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
