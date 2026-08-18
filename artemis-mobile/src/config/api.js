import Constants from 'expo-constants';

// Se usa si Metro no logra detectar automáticamente la IP de tu computadora
// en la red local (por ejemplo, al correr en un build standalone).
// IMPORTANTE: esta IP cambia si te reconectas al Wi-Fi o cambias de red.
// Revisa la IPv4 actual con "ipconfig" (Windows) y actualízala aquí si el
// login se queda cargando sin responder.
const FALLBACK_HOST = '192.168.1.70';
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
