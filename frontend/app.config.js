const IS_DEV = process.env.APP_VARIANT === 'development';
const IS_PREVIEW = process.env.APP_VARIANT === 'preview';

const getUniqueIdentifier = () => {
  if (IS_DEV) {
    return 'com.pedro_yutaro.scaninusvet.dev';
  }

  if (IS_PREVIEW) {
    return 'com.pedro_yutaro.scaninusvet.preview';
  }

  return 'com.pedro_yutaro.scaninusvet';
};

const getAppName = () => {
  if (IS_DEV) {
    return 'ScaninusVet (Dev)';
  }

  if (IS_PREVIEW) {
    return 'ScaninusVet (Preview)';
  }

  return 'ScaninusVet';
};

export default {
  name: getAppName(),
  owner: 'pedro_yutaro',
  ios: {
    bundleIdentifier: getUniqueIdentifier(),
  },
  android: {
    package: getUniqueIdentifier(),
  },
  extra: {
    eas: {
      projectId: '24d8ebe4-2c6a-4b46-a7f4-e419c5dd882f',
    },

    // 2. VARIÁVEIS DE AMBIENTE (Opcional, mas útil para testes)
    // Se você não tem essa seção, adicione-a.
    // OBS: O Metro já as carrega via EXPO_PUBLIC_, mas tê-las aqui pode ajudar na consistência.
    EXPO_PUBLIC_API_DOMAIN: process.env.EXPO_PUBLIC_API_DOMAIN,
    EXPO_PUBLIC_API_PORT: process.env.EXPO_PUBLIC_API_PORT,
  },
};
