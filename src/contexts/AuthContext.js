import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import api from '../services/api';

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStorageData() {
      try {
        const storedToken = await AsyncStorage.getItem('@spacecandy:token');

        if (storedToken) {
          // Pre-configure axios with token so we can fetch /me
          api.defaults.headers.Authorization = `Bearer ${storedToken}`;
          
          const response = await api.get('/auth/me');
          const user = response.data;
          
          const mappedUser = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.type === 'Admin' || user.type === 'ADMIN' || user.type === 0 || user.email === 'admin@spacecandy.com' ? 'admin' : 'customer', 
            phone: '(11) 98765-4321', 
            address: 'Rua das Galaxias, 42 - Via Lactea' 
          };
          
          setCurrentUser(mappedUser);
        }
      } catch (err) {
        console.warn('Failed to load user info', err);
        // Clear token if invalid
        await AsyncStorage.removeItem('@spacecandy:token');
      } finally {
        setLoading(false);
      }
    }

    loadStorageData();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/signin', { email, password });
      
      const { user, token } = response.data;
      
      const mappedUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.type === 'Admin' || user.type === 'ADMIN' || user.type === 0 || user.email === 'admin@spacecandy.com' ? 'admin' : 'customer', 
        phone: '(11) 98765-4321', 
        address: 'Rua das Galaxias, 42 - Via Lactea' 
      };

      // Só armazenamos o Token JWT no dispositivo
      await AsyncStorage.setItem('@spacecandy:token', token);
      
      // Injeta o token nas próximas requisições desta sessão
      api.defaults.headers.Authorization = `Bearer ${token}`;

      setCurrentUser(mappedUser);
      return true;
    } catch (error) {
      console.error(error);
      Alert.alert('Login falhou', 'Verifique suas credenciais.');
      return false;
    }
  };

  const register = async (name, email, password) => {
    try {
      await api.post('/auth/signup', { name, email, password });
      return await login(email, password);
    } catch (error) {
      console.error(error);
      Alert.alert('Cadastro falhou', 'Não foi possível cadastrar no momento.');
      return false;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('@spacecandy:token');
      setCurrentUser(null);
    } catch (err) {
      console.warn('Error on logout', err);
    }
  };

  const updateProfile = async (profileData) => {
    const updatedUser = { ...currentUser, ...profileData };
    setCurrentUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        signed: !!currentUser,
        currentUser,
        loading,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
