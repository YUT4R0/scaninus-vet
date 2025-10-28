const domain = process.env.EXPO_PUBLIC_API_LOCAL_DOMAIN;
const port = process.env.EXPO_PUBLIC_API_LOCAL_PORT;

const baseURL = `http://${domain}:${port}/api/v1`;

export { baseURL };
