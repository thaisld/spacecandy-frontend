import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { BrandHeader, InputField, PrimaryButton } from '../components/ui';
import { colors, radii } from '../theme';

export default function AuthScreen({ onLogin, onRegister }) {
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const submit = () => {
    if (mode === 'login') {
      onLogin({ email, password });
      return;
    }

    onRegister({ name, email, password });
  };

  const fillDemo = (role) => {
    if (role === 'admin') {
      setEmail('admin@spacecandy.com');
      setPassword('Admin123');
      setMode('login');
      return;
    }
    
    setEmail('cliente@spacecandy.com');
    setPassword('Cliente123');
    setMode('login');
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <BrandHeader subtitle="E-commerce acadêmico figurativo" />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.heroBand}>
          <View style={styles.orbit}>
            <MaterialCommunityIcons name="candy-outline" size={42} color={colors.surface} />
          </View>
          <View style={styles.heroText}>
            <Text style={styles.heroTitle}>Doces de outra galáxia</Text>
            <Text style={styles.heroSubtitle}>
              Loja fictícia para demonstrar login, catálogo, compra e área administrativa.
            </Text>
          </View>
        </View>

        <View style={styles.authPanel}>
          <View style={styles.switcher}>
            {['login', 'register'].map((option) => {
              const active = mode === option;
              return (
                <Pressable
                  key={option}
                  onPress={() => setMode(option)}
                  style={[styles.switchItem, active && styles.switchItemActive]}
                >
                  <Text style={[styles.switchText, active && styles.switchTextActive]}>
                    {option === 'login' ? 'Login' : 'Registro'}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.form}>
            {mode === 'register' && (
              <InputField
                label="Nome"
                icon="account-outline"
                value={name}
                onChangeText={setName}
              />
            )}
            <InputField
              label="E-mail"
              icon="email-outline"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
            <InputField
              label="Senha"
              icon="lock-outline"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <PrimaryButton
              label={mode === 'login' ? 'Entrar' : 'Criar conta'}
              icon={mode === 'login' ? 'login' : 'account-plus-outline'}
              onPress={submit}
            />
          </View>
        </View>

        <View style={styles.demoRow}>
          <PrimaryButton
            label="Cliente demo"
            icon="account-heart-outline"
            variant="secondary"
            onPress={() => fillDemo('customer')}
            style={styles.demoButton}
          />
          <PrimaryButton
            label="Admin demo"
            icon="shield-account-outline"
            variant="secondary"
            onPress={() => fillDemo('admin')}
            style={styles.demoButton}
          />
        </View>

        <View style={styles.notice}>
          <MaterialCommunityIcons name="school-outline" size={19} color={colors.mint} />
          <Text style={styles.noticeText}>
            Produtos 100% fictícios para projeto acadêmico.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 18,
    gap: 16,
  },
  heroBand: {
    backgroundColor: colors.midnight,
    borderRadius: radii.md,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  orbit: {
    width: 76,
    height: 76,
    borderRadius: radii.md,
    backgroundColor: colors.berry,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.sun,
  },
  heroText: {
    flex: 1,
    minWidth: 0,
  },
  heroTitle: {
    color: colors.ink,
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 0,
  },
  heroSubtitle: {
    color: '#C7CEDB',
    marginTop: 6,
    fontSize: 14,
    lineHeight: 20,
  },
  authPanel: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 14,
    gap: 16,
  },
  switcher: {
    height: 46,
    borderRadius: radii.md,
    backgroundColor: colors.background,
    padding: 4,
    flexDirection: 'row',
  },
  switchItem: {
    flex: 1,
    borderRadius: radii.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  switchItemActive: {
    backgroundColor: colors.midnight,
  },
  switchText: {
    color: colors.muted,
    fontWeight: '900',
    fontSize: 14,
  },
  switchTextActive: {
    color: colors.ink,
  },
  form: {
    gap: 13,
  },
  demoRow: {
    flexDirection: 'row',
    gap: 10,
  },
  demoButton: {
    flex: 1,
  },
  notice: {
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.softMint,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  noticeText: {
    flex: 1,
    color: colors.ink,
    fontSize: 13,
    fontWeight: '700',
  },
});
