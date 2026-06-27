import { NativeModules } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

let API_URL = 'http://192.168.100.140:8765'; // Fallback para a máquina original

if (__DEV__) {
  try {
    const scriptURL = NativeModules.SourceCode.scriptURL;
    if (scriptURL) {
      const match = scriptURL.match(/\w+:\/\/([^:\/]+)/);
      if (match && match[1]) {
        API_URL = `http://${match[1]}:8765`;
      }
    }
  } catch (error) {
    console.warn('Erro ao pegar IP dinamico:', error);
  }
}

console.log("==> Conectando na API em:", API_URL);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('@spacecandy:token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (err) {
      console.warn('Error reading token from async storage', err);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
