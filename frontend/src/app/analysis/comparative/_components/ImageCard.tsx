import { colors } from '@/styles/colors';
import { IconEdit, IconTrash } from '@tabler/icons-react-native';
import { Dimensions, Image, StyleSheet, TouchableOpacity, View } from 'react-native';

interface ImageCardProps {
  uri: string;
  onRemove: (uri: string) => void;
  onEdit: (uri: string) => void;
}

const { width: screenWidth } = Dimensions.get('window');

export default function ImageCard({ onRemove, uri, onEdit }: ImageCardProps) {
  return (
    <View style={styles.card}>
      <Image source={{ uri }} style={styles.image} resizeMode="contain" />
      <View style={styles.overlay}>
        {/* Botão de Excluir */}
        <TouchableOpacity onPress={() => onRemove(uri)} style={styles.deleteButton}>
          <IconTrash size={20} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onEdit(uri)} style={styles.editButton}>
          <IconEdit size={20} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: screenWidth * 0.7,
    height: '95%',
    marginHorizontal: 10,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    // Adiciona uma sombra básica para melhor UX
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 5,
    right: 5,
  },
  deleteButton: {
    backgroundColor: colors.red.base,
    borderRadius: 20,
    padding: 5,
  },
  editButton: {
    backgroundColor: colors.blue.dark,
    borderRadius: 20,
    padding: 5,
  },
});
