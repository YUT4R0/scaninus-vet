import { Text, View } from 'react-native';

type Props = {
  title: string;
  p1: string;
  p2?: string;
  list?: string[];
};

export function Step({ p1, title, list, p2 }: Props) {
  return (
    <View className="flex flex-col gap-1">
      <Text className="text-xl font-semibold">{title}</Text>
      <Text className="font-regular text-base">{p1}</Text>
      {list && list.length > 0 && (
        <View className="my-1 flex flex-col">
          {list.map((item, i) => (
            <Text key={i} className="font-regular text-lg">
              - {item};
            </Text>
          ))}
        </View>
      )}
      {p2 && <Text className="font-regular text-base">{p2}</Text>}
    </View>
  );
}
