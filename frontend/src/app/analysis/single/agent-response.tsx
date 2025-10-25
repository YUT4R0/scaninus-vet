import { SingleAnalysisAPiResponse } from '@/@types/single-analysis-api-response';
import { baseURL } from '@/api';
import { api } from '@/api/axios';
import { Button } from '@/components/Button';
import { Loading } from '@/components/Loading';
import { colors } from '@/styles/colors';
import { fs } from '@/utils/responsive';
import {
  IconCamera,
  IconCancel,
  IconFaceIdError,
  IconHome2,
  IconRobotFace,
} from '@tabler/icons-react-native';
import * as FileSystem from 'expo-file-system'; // NOVO IMPORT
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';

export default function AgentResponse() {
  const { uri } = useLocalSearchParams<{ uri: string }>();
  const [analysisResult, setAnalysisResult] = useState<SingleAnalysisAPiResponse | null>(null); // Estado para o resultado final
  const [error, setError] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  const handleSend = async (fileUri: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      const filename = fileUri.split('/').pop() || 'analysis_image.jpg';

      formData.append('image', {
        uri: fileUri,
        type: 'image/jpeg',
        name: filename,
      } as any);

      console.log(`end point: ${baseURL}/analysis/single`);

      const { data } = await api.post<SingleAnalysisAPiResponse>('/analysis/single', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 1000 * 90,
      });

      console.log(`====> RECEIVED DATA: ${data}`);

      setAnalysisResult(data);
    } catch (e: any) {
      console.warn('Erro ao enviar arquivo pra API:', e.message);
      setError('Falha na comunicação ou processamento da API.');
    } finally {
      try {
        await FileSystem.deleteAsync(fileUri, { idempotent: true });
      } catch (e) {
        console.warn('Erro ao deletar arquivo após envio:', e);
      }
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (uri && isLoading) {
      handleSend(uri);
    }
  }, [uri, isLoading]);

  return (
    <View className="flex flex-1 flex-col justify-between gap-4 p-10">
      <Text
        allowFontScaling={false}
        style={{ fontSize: fs(25) }}
        className="text-center font-regular">
        {uri && isLoading
          ? 'Analisando...'
          : error
            ? 'Houve um erro interno'
            : analysisResult?.response_title}
      </Text>
      <Text
        allowFontScaling={false}
        style={{ fontSize: fs(13) }}
        className="text-center font-regular leading-5">
        {uri && isLoading
          ? 'Isso pode levar alguns segundos'
          : error
            ? error
            : 'Veja o resultado abaixo'}
      </Text>

      <View className="mt-4 flex w-full flex-1 flex-col items-center justify-start gap-6">
        {isLoading || analysisResult?.status === 'SUCESSO' ? (
          <IconRobotFace size={40} color={colors.gray[400]} />
        ) : (
          <IconFaceIdError size={40} color={colors.gray[400]} />
        )}
        <View className="h-0.5 w-full bg-gray-500" />
        {isLoading ? (
          <View className="flex w-full flex-1 flex-col items-center">
            <Text
              allowFontScaling={false}
              style={{ fontSize: fs(20) }}
              className="w-[20%] rounded-3xl bg-gray-200 p-2 text-center font-semiBold">
              . . .
            </Text>
            <Loading size={50} />
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={{ flexGrow: 0 }}
            className="flex w-full flex-grow-0 flex-col rounded-3xl bg-gray-200">
            <Text allowFontScaling={false} className="px-6 pb-6 pt-6 font-regular">
              {analysisResult ? (
                <Text
                  allowFontScaling={false}
                  style={{ fontSize: fs(16) }}
                  className="font-semiBold">
                  {`ENN: ${analysisResult?.status === 'SUCESSO' ? `${analysisResult.enns}%` : 'Inconsistente'}\n`}
                </Text>
              ) : (
                <Text allowFontScaling={false} style={{ color: colors.red.base }}>
                  Não foi possível enviar o conteúdo a ser analisado para o servidor. Verifique sua
                  conexão com a internet ou tente novamente mais tarde.
                </Text>
              )}
              {analysisResult?.description}
            </Text>
            {analysisResult?.suggestion && (
              <View className="w-full border-t-[1px] border-t-gray-400 px-6 pb-6 pt-8">
                <Text
                  style={{ fontSize: fs(16) }}
                  allowFontScaling={false}
                  className="font-semiBold">
                  Sugestões:
                </Text>
                <Text allowFontScaling={false} className="font-regular">
                  {analysisResult.suggestion}
                </Text>
              </View>
            )}
          </ScrollView>
        )}
      </View>

      <View className="mt-10 flex w-full flex-row items-center justify-center gap-10">
        {isLoading ? (
          <Button
            onPress={() => router.replace({ pathname: '/analysis' })}
            style={{ backgroundColor: colors.red.base, width: '50%' }}>
            <Button.Icon icon={IconCancel} />
            <Button.Title>Cancelar</Button.Title>
          </Button>
        ) : (
          <>
            <Button
              onPress={() => router.replace({ pathname: '/analysis' })}
              style={{ backgroundColor: colors.gray[500], width: '46%' }}>
              <Button.Icon icon={IconHome2} />
              <Button.Title>Home</Button.Title>
            </Button>
            <Button
              onPress={() => router.replace({ pathname: '/analysis' })}
              style={{ backgroundColor: colors.blue.base, width: '46%' }}>
              <Button.Icon icon={IconCamera} />
              <Button.Title>Nova Análise</Button.Title>
            </Button>
          </>
        )}
      </View>
    </View>
  );
}
