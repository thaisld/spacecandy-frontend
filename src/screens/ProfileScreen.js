import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';

import { BrandHeader, InputField, Metric, PrimaryButton, ScreenTitle, cardStyle } from '../components/ui';
import { colors } from '../theme';
import { formatMoney } from '../utils/format';

export default function ProfileScreen({ user, orders, onSaveProfile, onLogout }) {
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone || '');
  const [address, setAddress] = useState(user.address || '');

  const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <BrandHeader subtitle="Perfil do usuario" />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <ScreenTitle
          eyebrow="Area do cliente"
          title="Perfil"
          subtitle="Dados usados no fluxo de checkout e comprovante."
        />

        <View style={styles.metricsRow}>
          <Metric label="Compras" value={orders.length} tone="violet" />
          <Metric label="Total" value={formatMoney(totalSpent)} tone="berry" />
        </View>

        <View style={[cardStyle, styles.formCard]}>
          <Text style={styles.formTitle}>Dados do usuario</Text>
          <InputField label="Nome" icon="account-outline" value={name} onChangeText={setName} />
          <InputField
            label="E-mail"
            icon="email-outline"
            value={user.email}
            onChangeText={() => {}}
            editable={false}
          />
          <InputField label="Telefone" icon="phone-outline" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
          <InputField
            label="Endereco"
            icon="map-marker-outline"
            value={address}
            onChangeText={setAddress}
            multiline
          />
          <PrimaryButton
            label="Salvar perfil"
            icon="content-save-outline"
            onPress={() => {
              onSaveProfile({ name: name.trim(), phone: phone.trim(), address: address.trim() });
              Alert.alert('Sucesso', 'Perfil salvo localmente para a demonstracao.');
            }}
          />
          <PrimaryButton label="Sair" icon="logout" variant="danger" onPress={onLogout} />
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
    paddingBottom: 24,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 18,
  },
  formCard: {
    marginHorizontal: 18,
    marginTop: 16,
    padding: 14,
    gap: 13,
  },
  formTitle: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: '900',
  },
});
