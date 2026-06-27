import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { BrandHeader, EmptyState, PrimaryButton, ScreenTitle, cardStyle } from '../components/ui';
import { colors, radii } from '../theme';
import { formatDateTime, formatMoney } from '../utils/format';

export default function ReceiptScreen({ order, onHistory, onBackToProducts }) {
  if (!order) {
    return (
      <View style={styles.root}>
        <BrandHeader subtitle="Comprovante de compra" />
        <View style={styles.emptyWrap}>
          <EmptyState
            icon="receipt-text-remove-outline"
            title="Nenhum comprovante aberto"
            action={<PrimaryButton label="Voltar a loja" icon="storefront-outline" onPress={onBackToProducts} />}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <BrandHeader subtitle="Comprovante de compra" />
      <ScrollView contentContainerStyle={styles.content}>
        <ScreenTitle
          eyebrow="Area do cliente"
          title="Comprovante"
          subtitle="Resumo do pedido confirmado no ambiente simulado."
        />

        <View style={[cardStyle, styles.receipt]}>
          <View style={styles.receiptHead}>
            <View style={styles.successIcon}>
              <MaterialCommunityIcons name="check-bold" size={28} color={colors.surface} />
            </View>
            <View style={styles.receiptHeadText}>
              <Text style={styles.orderId}>{order.id}</Text>
              <Text style={styles.status}>{order.status}</Text>
              <Text style={styles.date}>{formatDateTime(order.createdAt)}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Itens</Text>
            {order.items.map((item) => (
              <View key={item.productId} style={styles.itemLine}>
                <Text style={styles.itemName} numberOfLines={1}>
                  {item.quantity}x {item.name}
                </Text>
                <Text style={styles.itemValue}>{formatMoney(item.lineTotal)}</Text>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Entrega</Text>
            <Text style={styles.detail}>{order.delivery.receiver}</Text>
            <Text style={styles.detail}>{order.delivery.address}</Text>
            <Text style={styles.detail}>{order.delivery.phone}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pagamento</Text>
            <Text style={styles.detail}>{order.payment.method}</Text>
            <Text style={styles.detail}>{order.payment.status}</Text>
          </View>

          <View style={styles.totals}>
            <ReceiptTotal label="Subtotal" value={formatMoney(order.subtotal)} />
            <ReceiptTotal label="Entrega" value={order.shipping === 0 ? 'Gratis' : formatMoney(order.shipping)} />
            <ReceiptTotal label="Total" value={formatMoney(order.total)} strong />
          </View>
        </View>

        <View style={styles.actions}>
          <PrimaryButton label="Historico" icon="clipboard-text-clock-outline" onPress={onHistory} style={styles.action} />
          <PrimaryButton
            label="Comprar mais"
            icon="storefront-outline"
            variant="secondary"
            onPress={onBackToProducts}
            style={styles.action}
          />
        </View>
      </ScrollView>
    </View>
  );
}

function ReceiptTotal({ label, value, strong }) {
  return (
    <View style={styles.totalLine}>
      <Text style={[styles.totalLabel, strong && styles.totalStrong]}>{label}</Text>
      <Text style={[styles.totalValue, strong && styles.totalStrong]}>{value}</Text>
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
  emptyWrap: {
    padding: 18,
  },
  receipt: {
    marginHorizontal: 18,
    padding: 16,
    gap: 16,
  },
  receiptHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  successIcon: {
    width: 58,
    height: 58,
    borderRadius: radii.md,
    backgroundColor: colors.mint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  receiptHeadText: {
    flex: 1,
    minWidth: 0,
  },
  orderId: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: '900',
  },
  status: {
    color: colors.success,
    fontSize: 14,
    fontWeight: '900',
    marginTop: 2,
  },
  date: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
  section: {
    borderTopWidth: 1,
    borderTopColor: colors.line,
    paddingTop: 12,
    gap: 5,
  },
  sectionTitle: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: '900',
  },
  itemLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  itemName: {
    flex: 1,
    color: colors.muted,
    fontSize: 13,
    fontWeight: '700',
  },
  itemValue: {
    color: colors.ink,
    fontSize: 13,
    fontWeight: '900',
  },
  detail: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '700',
  },
  totals: {
    borderTopWidth: 1,
    borderTopColor: colors.line,
    paddingTop: 12,
    gap: 7,
  },
  totalLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  totalLabel: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: '700',
  },
  totalValue: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: '900',
  },
  totalStrong: {
    color: colors.ink,
    fontSize: 18,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 18,
    paddingTop: 16,
  },
  action: {
    flex: 1,
  },
});
