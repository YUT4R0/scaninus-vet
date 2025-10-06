import { fs } from '@/utils/responsive';
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
      <Text style={{ fontSize: fs(14) }} className="font-semibold">
        {title}
      </Text>
      <Text style={{ fontSize: fs(11) }} className="font-regular leading-5">
        {p1}
      </Text>
      {list && list.length > 0 && (
        <View className="my-0.5 flex flex-col">
          {list.map((item, i) => (
            <Text key={i} className="font-regular" style={{ fontSize: fs(13) }}>
              - {item};
            </Text>
          ))}
        </View>
      )}
      {p2 && (
        <Text style={{ fontSize: fs(11) }} className="font-regular leading-5">
          {p2}
        </Text>
      )}
    </View>
  );
}
