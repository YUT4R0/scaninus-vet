import { Button } from '@/components/Button';
import { colors } from '@/styles/colors';
import { fs } from '@/utils/responsive';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { IconCamera, IconUpload, IconX } from '@tabler/icons-react-native';
import { useCallback } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type AddFoodBottomSheetActionsProps = {
  onCapture: () => Promise<void>;
  onUpload: () => Promise<void>;
};

type FoodBottomSheetProps = {
  ref: React.RefObject<BottomSheetMethods | null>;
  onClose: () => void;
  actions: AddFoodBottomSheetActionsProps;
};

export default function AddFoodBottomSheet({ actions, onClose, ref }: FoodBottomSheetProps) {
  const snapPoints = ['25%'];

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} opacity={0.5} />
    ),
    []
  );

  return (
    <BottomSheet
      ref={ref}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      backgroundStyle={{ backgroundColor: colors.gray[100] }}
      backdropComponent={renderBackdrop}
      handleIndicatorStyle={{ backgroundColor: colors.gray[400] }}>
      <BottomSheetView style={styles.sheetContent}>
        <View style={styles.sheetHeader}>
          <Text style={styles.sheetTitle}>Adicionar Ração</Text>
          <TouchableOpacity onPress={() => onClose()}>
            <IconX size={24} color={colors.gray[600]} />
          </TouchableOpacity>
        </View>
        <Button style={styles.sheetButton} onPress={() => actions.onCapture()}>
          <Button.Icon icon={IconCamera} />
          <Button.Title>Tirar Nova Foto</Button.Title>
        </Button>
        <Button
          style={[styles.sheetButton, { backgroundColor: colors.green.light }]}
          onPress={() => actions.onUpload()}>
          <Button.Icon icon={IconUpload} />
          <Button.Title>Selecionar da Galeria</Button.Title>
        </Button>
      </BottomSheetView>
    </BottomSheet>
  );
}

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
});
