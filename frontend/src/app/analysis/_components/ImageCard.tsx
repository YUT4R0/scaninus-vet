import { colors } from '@/styles/colors';
import { fs } from '@/utils/responsive';
import { IconEdit, IconTrash } from '@tabler/icons-react-native';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ImageCardProps {
  uri: string;
  onRemove: (uri: string) => void;
  onEdit: (uri: string) => void;
}

const { width: screenWidth } = Dimensions.get('window');

function ImageCard({ onRemove, uri, onEdit }: ImageCardProps) {
  return (
    <View style={styles.card}>
      <Image source={{ uri }} style={styles.image} resizeMode="contain" />
      <View style={styles.overlay}>
        <TouchableOpacity onPress={() => onRemove(uri)} style={styles.deleteButton}>
          <IconTrash size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onEdit(uri)} style={styles.editButton}>
          <IconEdit size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

type EmptyProps = {
  label: string;
};

function Empty({ label }: EmptyProps) {
  return (
    <View style={styles.card}>
      <Text allowFontScaling={false} style={{ fontSize: fs(16) }} className="text-gray-400">
        {label}
      </Text>
    </View>
  );
}

ImageCard.Empty = Empty;

export default ImageCard;

const styles = StyleSheet.create({
  card: {
    width: screenWidth * 0.8,
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
    top: 8,
    right: 8,
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
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
