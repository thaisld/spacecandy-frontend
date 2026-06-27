import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { BrandHeader, EmptyState, PrimaryButton, ScreenTitle, cardStyle } from '../components/ui';
import { colors, radii } from '../theme';
import { formatDateTime, formatMoney } from '../utils/format';

export default function HistoryScreen({ orders, onOpenReceipt, onBackToProducts }) {
  return (
    <View style={styles.root}>
      <BrandHeader subtitle="Historico de compras" />
      <ScrollView contentContainerStyle={styles.content}>
        <ScreenTitle
          eyebrow="Area do cliente"
          title="Historico"
          subtitle="Pedidos finalizados aparecem aqui com acesso ao comprovante."
        />

        <View style={styles.list}>
          {orders.length === 0 ? (
            <EmptyState
              icon="clipboard-text-clock-outline"
              title="Sem compras ainda"
              subtitle="Finalize um checkout para gerar o primeiro historico."
              action={<PrimaryButton label="Ver produtos" icon="storefront-outline" onPress={onBackToProducts} />}
            />
          ) : (
            orders.map((order) => (
              <View key={order.id} style={[cardStyle, styles.orderCard]}>
                <View style={styles.orderTop}>
                  <View style={styles.orderIcon}>
                    <MaterialCommunityIcons name="receipt-text-check-outline" size={26} color={colors.surface} />
                  </View>
                  <View style={styles.orderInfo}>
                    <Text style={styles.orderId}>{order.id}</Text>
                    <Text style={styles.orderDate}>{formatDateTime(order.createdAt)}</Text>
                  </View>
                  <Text style={styles.total}>{formatMoney(order.total)}</Text>
                </View>
                <Text style={styles.items} numberOfLines={1}>
                  {order.items.map((item) => `${item.quantity}x ${item.name}`).join('  |  ')}
                </Text>
                <PrimaryButton
                  label="Abrir comprovante"
                  icon="file-eye-outline"
                  variant="secondary"
                  onPress={() => onOpenReceipt(order)}
                />
              </View>
            ))
          )}
        </View>
      </ScrollView>
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
  list: {
    paddingHorizontal: 18,
    gap: 12,
  },
  orderCard: {
    padding: 14,
    gap: 12,
  },
  orderTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
  },
  orderIcon: {
    width: 50,
    height: 50,
    borderRadius: radii.md,
    backgroundColor: colors.sky,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orderInfo: {
    flex: 1,
    minWidth: 0,
  },
  orderId: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: '900',
  },
  orderDate: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
  total: {
    color: colors.berry,
    fontSize: 16,
    fontWeight: '900',
  },
  items: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '700',
  },
});
