const domain = process.env.EXPO_PUBLIC_API_DOMAIN;
const port = process.env.EXPO_PUBLIC_API_PORT;

const baseURL = `http://${domain}:${port}/api/v1`;

export { baseURL, domain, port };
