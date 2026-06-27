import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';

import { BrandHeader, Chip, InputField, PrimaryButton, ScreenTitle, cardStyle } from '../components/ui';
import { colors } from '../theme';
import { formatMoney } from '../utils/format';

const paymentOptions = ['Pix', 'Cartao', 'Boleto'];

export default function CheckoutScreen({ user, cartDetails, onConfirm, onBackToProducts }) {
  const [address, setAddress] = useState(user.address || '');
  const [receiver, setReceiver] = useState(user.name || '');
  const [phone, setPhone] = useState(user.phone || '');
  const [payment, setPayment] = useState('Pix');

  const subtotal = cartDetails.reduce((sum, item) => sum + item.lineTotal, 0);
  const shipping = subtotal >= 120 ? 0 : 12.9;
  const total = subtotal + shipping;

  const confirm = () => {
    if (!receiver.trim() || !address.trim() || !phone.trim()) {
      return;
    }

    onConfirm({
      delivery: {
        receiver: receiver.trim(),
        address: address.trim(),
        phone: phone.trim(),
      },
      payment: {
        method: payment,
        status: 'Aprovado em ambiente simulado',
      },
    });
  };

  const canConfirm = receiver.trim() && address.trim() && phone.trim();

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <BrandHeader subtitle="Checkout de compra" />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <ScreenTitle
          eyebrow="Area do cliente"
          title="Checkout"
          subtitle="Dados de entrega e pagamento para concluir a compra ficticia."
        />

        <View style={styles.form}>
          <InputField label="Recebedor" icon="account-outline" value={receiver} onChangeText={setReceiver} />
          <InputField label="Telefone" icon="phone-outline" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
          <InputField
            label="Endereco"
            icon="map-marker-outline"
            value={address}
            onChangeText={setAddress}
            multiline
          />

          <View style={styles.paymentArea}>
            <Text style={styles.label}>Pagamento</Text>
            <View style={styles.paymentRow}>
              {paymentOptions.map((option) => (
                <Chip
                  key={option}
                  label={option}
                  active={payment === option}
                  onPress={() => setPayment(option)}
                  color={colors.mint}
                />
              ))}
            </View>
          </View>
        </View>

        <View style={[cardStyle, styles.summary]}>
          <Text style={styles.summaryTitle}>Resumo</Text>
          {cartDetails.map((item) => (
            <View key={item.productId} style={styles.orderLine}>
              <Text style={styles.orderName} numberOfLines={1}>
                {item.quantity}x {item.product.name}
              </Text>
              <Text style={styles.orderValue}>{formatMoney(item.lineTotal)}</Text>
            </View>
          ))}
          <View style={styles.divider} />
          <SummaryLine label="Subtotal" value={formatMoney(subtotal)} />
          <SummaryLine label="Entrega" value={shipping === 0 ? 'Gratis' : formatMoney(shipping)} />
          <SummaryLine label="Total" value={formatMoney(total)} strong />
          <PrimaryButton
            label="Confirmar compra"
            icon="check-circle-outline"
            onPress={confirm}
            disabled={!canConfirm}
          />
          <PrimaryButton
            label="Voltar a loja"
            icon="arrow-left"
            variant="ghost"
            onPress={onBackToProducts}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function SummaryLine({ label, value, strong }) {
  return (
    <View style={styles.summaryLine}>
      <Text style={[styles.summaryLabel, strong && styles.summaryStrong]}>{label}</Text>
      <Text style={[styles.summaryValue, strong && styles.summaryStrong]}>{value}</Text>
    </View>
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
  form: {
    paddingHorizontal: 18,
    gap: 13,
  },
  paymentArea: {
    gap: 8,
  },
  label: {
    color: colors.ink,
    fontSize: 13,
    fontWeight: '800',
  },
  paymentRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  summary: {
    marginHorizontal: 18,
    marginTop: 16,
    padding: 14,
    gap: 11,
  },
  summaryTitle: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: '900',
  },
  orderLine: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'space-between',
  },
  orderName: {
    flex: 1,
    color: colors.muted,
    fontSize: 13,
    fontWeight: '700',
  },
  orderValue: {
    color: colors.ink,
    fontSize: 13,
    fontWeight: '900',
  },
  divider: {
    height: 1,
    backgroundColor: colors.line,
  },
  summaryLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  summaryLabel: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: '700',
  },
  summaryValue: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: '900',
  },
  summaryStrong: {
    color: colors.ink,
    fontSize: 18,
  },
});
