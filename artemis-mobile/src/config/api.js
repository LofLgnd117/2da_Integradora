import Constants from 'expo-constants';

// Se usa si Metro no logra detectar automáticamente la IP de tu computadora
// en la red local (por ejemplo, al correr en un build standalone).
const FALLBACK_HOST = '10.155.34.65';
const PORT = 3000;

function detectHost() {
  const hostUri =
    Constants.expoConfig?.hostUri ||
    Constants.expoGoConfig?.debuggerHost ||
    Constants.manifest2?.extra?.expoClient?.hostUri ||
    Constants.manifest?.debuggerHost;

  if (hostUri) {
    const host = hostUri.split(':')[0];
    if (host) return host;
  }
  return FALLBACK_HOST;
}

export const API_BASE_URL = `http://${detectHost()}:${PORT}`;
