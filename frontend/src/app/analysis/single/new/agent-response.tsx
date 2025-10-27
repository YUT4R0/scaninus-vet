import { SingleAnalysisAPiResponse } from '@/@types/single-analysis-api-response';
import { baseURL } from '@/api';
import { api } from '@/api/axios';
import { Button } from '@/components/Button';
import { colors } from '@/styles/colors';
import { fs } from '@/utils/responsive';
import {
  IconCamera,
  IconCancel,
  IconDeviceFloppy,
  IconFaceIdError,
  IconHome2,
  IconRobotFace,
} from '@tabler/icons-react-native';
import * as FileSystem from 'expo-file-system'; // NOVO IMPORT
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, Text, View } from 'react-native';

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

  const handleCancel = async () => {
    Alert.alert(
      'Cancelar Análise',
      'Você tem certeza que deseja cancelar a análise (os anexos serão perdidos)?',
      [
        {
          text: 'Continuar análise',
          onPress: () => {
            return;
          },
        },
        {
          text: 'Cancelar análise',
          onPress: async () => {
            try {
              await FileSystem.deleteAsync(uri, { idempotent: true });
            } catch (e) {
              console.warn('Erro ao deletar arquivo:', e);
            } finally {
              router.replace({ pathname: '/analysis' });
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  useEffect(() => {
    if (uri && isLoading) {
      handleSend(uri);
    }
  }, [uri, isLoading]);

  return (
    <View className="flex flex-1 flex-col justify-between gap-4 p-10">
      <View className="flex w-full flex-col items-center justify-center">
        <Text
          allowFontScaling={false}
          style={{ fontSize: fs(20) }}
          className="text-center font-medium text-gray-400">
          Resultado da Análise Simples
        </Text>
      </View>
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
        style={{ fontSize: fs(14) }}
        className="text-center font-regular leading-5">
        {uri && isLoading
          ? 'Isso pode levar alguns segundos'
          : error
            ? error
            : 'Veja o resultado abaixo'}
      </Text>

      <View className="mt-4 flex w-full flex-1 flex-col items-center justify-start">
        {isLoading || analysisResult?.status === 'SUCESSO' ? (
          <IconRobotFace size={40} color={colors.gray[400]} />
        ) : (
          <IconFaceIdError size={40} color={colors.gray[400]} />
        )}
        <View className="mt-6 h-0.5 w-full bg-gray-500" />
        {/* MAIN CONTAINER RESPONSE */}
        <ScrollView
          contentContainerStyle={{ flexGrow: 0 }}
          className=" min-h-[70%] w-full flex-grow-0 flex-col pt-6">
          {/* PRIMEIRA MENAGEM */}
          <View
            className="mx-0.5 flex flex-col items-start self-end rounded-3xl rounded-tr-sm bg-gray-200 p-6"
            style={{
              elevation: 3,
            }}>
            <Text allowFontScaling={false} style={{ fontSize: fs(16) }} className="font-medium">
              Analise a seguinte ração:
            </Text>
            <View style={{ elevation: 6, borderRadius: 12 }}>
              <Image
                source={{ uri }}
                style={{
                  height: 64,
                  width: 64,
                  borderRadius: 12,
                  backgroundColor: '#5d5b5b',
                  borderWidth: 2,
                  borderColor: colors.green.light,
                }}
                resizeMode="contain"
              />
            </View>
          </View>
          {/* SEGUNDA MENSAGEM SEM CONTEUDO */}
          {isLoading ? (
            <View className="mx-0.5 my-10 flex w-[99%] flex-1 flex-row items-center gap-3.5">
              <View
                style={{ elevation: 3 }}
                className="w-[20%] rounded-3xl rounded-tl-sm bg-gray-200 p-2">
                <Text
                  allowFontScaling={false}
                  style={{ fontSize: fs(20) }}
                  className="text-center font-semiBold">
                  . . .
                </Text>
              </View>
              <ActivityIndicator
                size={20}
                color={colors.gray[400]}
                className="items-center justify-center"
              />
            </View>
          ) : (
            // SEGUNDA MENSAGEM COM CONTEUDO
            <View
              style={{ elevation: 3 }}
              className="mx-0.5 my-10 flex w-[99%] flex-col rounded-3xl rounded-tl-sm bg-gray-200">
              <Text allowFontScaling={false} className="p-6 font-regular">
                {analysisResult ? (
                  <Text
                    allowFontScaling={false}
                    style={{ fontSize: fs(16) }}
                    className="font-semiBold">
                    {`ENN: ${analysisResult?.status === 'SUCESSO' ? `${analysisResult.enn}%` : 'Inconsistente'}\n`}
                  </Text>
                ) : (
                  <Text allowFontScaling={false} style={{ color: colors.red.base }}>
                    Não foi possível enviar o conteúdo a ser analisado para o servidor. Verifique
                    sua conexão com a internet ou tente novamente mais tarde.
                  </Text>
                )}
                {analysisResult?.description}
              </Text>

              {analysisResult?.suggestion && (
                <View className="w-full border-t-[1px] border-t-gray-400 px-6 pb-6 pt-8">
                  <Text
                    allowFontScaling={false}
                    style={{ fontSize: fs(16) }}
                    className="font-semiBold">
                    Sugestão:
                  </Text>
                  <Text allowFontScaling={false} className="font-regular">
                    {analysisResult.suggestion}
                  </Text>
                </View>
              )}
            </View>
          )}
          {analysisResult && (
            <View className="mb-10 flex w-full flex-row items-center justify-between">
              <Button
                onPress={() => router.replace({ pathname: '/analysis/single/new' })}
                style={{ backgroundColor: colors.blue.base, width: '30%' }}>
                <Button.Icon icon={IconCamera} />
                <Button.Title>Nova</Button.Title>
              </Button>
              <Button
                onPress={() => router.replace({ pathname: '/analysis' })}
                style={{ backgroundColor: colors.gray[500], width: '30%' }}>
                <Button.Icon icon={IconHome2} />
                <Button.Title>Home</Button.Title>
              </Button>
              <Button
                onPress={() => router.replace({ pathname: '/analysis/single/history' })}
                style={{ backgroundColor: colors.green.light, width: '30%' }}>
                <Button.Icon icon={IconDeviceFloppy} />
                <Button.Title>Salvar</Button.Title>
              </Button>
            </View>
          )}
        </ScrollView>
        <View className="flex w-full flex-row items-center justify-center gap-6">
          {isLoading ? (
            <Button
              onPress={() => handleCancel}
              style={{ backgroundColor: colors.red.base, width: '50%' }}>
              <Button.Icon icon={IconCancel} />
              <Button.Title>Cancelar</Button.Title>
            </Button>
          ) : (
            !analysisResult && (
              <>
                <Button
                  onPress={() => router.replace({ pathname: '/analysis' })}
                  style={{ backgroundColor: colors.gray[500], width: '46%' }}>
                  <Button.Icon icon={IconHome2} />
                  <Button.Title>Home</Button.Title>
                </Button>
                <Button
                  onPress={() => router.replace({ pathname: '/analysis/single/new' })}
                  style={{ backgroundColor: colors.blue.base, width: '46%' }}>
                  <Button.Icon icon={IconCamera} />
                  <Button.Title>Nova Análise</Button.Title>
                </Button>
              </>
            )
          )}
        </View>
      </View>
    </View>
  );
}
