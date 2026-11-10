// Compatível tanto com Vite (import.meta.env) quanto com Node.js (process.env no test-api.js)
const env =
  (typeof import.meta !== 'undefined' && import.meta.env) ||
  (typeof process !== 'undefined' && process.env) ||
  {};

export const API_URL = env.VITE_API_URL || '';
export const WHATSAPP_NUMERO = env.VITE_WHATSAPP_NUMERO || '';
export const NOME_LOJA = env.VITE_NOME_LOJA || 'Catálogo de Calçados';
export const SUBTITULO_LOJA =
  env.VITE_SUBTITULO_LOJA || 'Escolha seu modelo e peça direto pelo WhatsApp';

export const CONFIG = {
  API_URL,
  WHATSAPP_NUMERO,
  NOME_LOJA,
  SUBTITULO_LOJA,
};

export default CONFIG;
