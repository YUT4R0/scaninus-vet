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
      <Text allowFontScaling={false} style={{ fontSize: fs(16) }} className="font-medium">
        {title}
      </Text>
      <Text
        allowFontScaling={false}
        style={{ fontSize: fs(13) }}
        className="font-regular leading-6">
        {p1}
      </Text>
      {list && list.length > 0 && (
        <View className="my-0.5 flex flex-col">
          {list.map((item, i) => (
            <Text
              allowFontScaling={false}
              key={i}
              className="font-regular"
              style={{ fontSize: fs(14) }}>
              {`•  ${item}`};
            </Text>
          ))}
        </View>
      )}
      {p2 && (
        <Text
          allowFontScaling={false}
          style={{ fontSize: fs(13) }}
          className="font-regular leading-6">
          {p2}
        </Text>
      )}
    </View>
  );
}
