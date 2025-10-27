import { Button } from '@/components/Button';
import { colors } from '@/styles/colors';
import { fs } from '@/utils/responsive';
import { IconX } from '@tabler/icons-react-native';
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
};

type FieldsProps = {
  setTitle: (title: string) => void;
  title: string;
};

type SaveAnalysisFormProps = {
  modal: ModalProps;
  fields: FieldsProps;
};

export default function SaveAnalysisForm({ fields, modal }: SaveAnalysisFormProps) {
  return (
    <Modal transparent={true} visible={modal.isOpen} onRequestClose={() => modal.onClose()}>
      <View style={modalStyles.centeredView}>
        <View style={modalStyles.modalView}>
          <View className="mb-5 w-full flex-row items-center justify-between">
            <Text style={modalStyles.modalTitle}>Salvar Análise</Text>
            <TouchableOpacity onPress={() => modal.onClose()}>
              <IconX size={24} color={colors.gray[600]} />
            </TouchableOpacity>
          </View>

          <Text style={modalStyles.label}>Nome da análise:</Text>
          <TextInput
            style={modalStyles.input}
            onChangeText={fields.setTitle}
            value={fields.title}
            placeholder="Ex: Ração Teste Premium"
            maxLength={50}
            keyboardType="default"
          />

          <View className="mt-8 w-full flex-row justify-between">
            <Button
              onPress={() => modal.onClose()}
              style={{ backgroundColor: colors.gray[500], width: '45%' }}>
              <Button.Title>Cancelar</Button.Title>
            </Button>
            <Button
              onPress={modal.onSave}
              style={{ backgroundColor: colors.green.base, width: '45%' }}>
              <Button.Title>Salvar</Button.Title>
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const modalStyles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fundo escuro
  },
  modalView: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: fs(20),
    fontWeight: 'bold',
    color: colors.gray[600],
  },
  label: {
    alignSelf: 'flex-start',
    fontSize: fs(14),
    fontWeight: '500',
    marginBottom: 5,
    color: colors.gray[600],
  },
  input: {
    width: '100%',
    height: 45,
    backgroundColor: colors.gray[100],
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: fs(16),
    borderWidth: 1,
    borderColor: colors.gray[300],
  },
});
