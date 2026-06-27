import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { BrandHeader, EmptyState, IconButton, PrimaryButton, ScreenTitle, cardStyle } from '../components/ui';
import { colors, radii } from '../theme';
import { formatMoney } from '../utils/format';

export default function CartScreen({
  cartDetails,
  cartCount,
  onChangeQuantity,
  onCheckout,
  onBackToProducts,
}) {
  const subtotal = cartDetails.reduce((sum, item) => sum + item.lineTotal, 0);
  const shipping = subtotal >= 120 || subtotal === 0 ? 0 : 12.9;
  const total = subtotal + shipping;

  return (
    <View style={styles.root}>
      <BrandHeader
        subtitle="Carrinho de compras"
        right={
          <IconButton
            icon="storefront-outline"
            color={colors.surface}
            background="#25314A"
            onPress={onBackToProducts}
          />
        }
      />
      <ScrollView contentContainerStyle={styles.content}>
        <ScreenTitle
          eyebrow="Area do cliente"
          title="Carrinho"
          subtitle="Revise quantidades antes de seguir para o checkout."
        />

        {cartDetails.length === 0 ? (
          <View style={styles.emptyWrap}>
            <EmptyState
              icon="cart-off"
              title="Carrinho vazio"
              subtitle="Escolha itens no catalogo para continuar o fluxo de compra."
              action={
                <PrimaryButton
                  label="Ver produtos"
                  icon="view-grid-outline"
                  onPress={onBackToProducts}
                />
              }
            />
          </View>
        ) : (
          <>
            <View style={styles.list}>
              {cartDetails.map((item) => (
                <CartLine key={item.productId} item={item} onChangeQuantity={onChangeQuantity} />
              ))}
            </View>

            <View style={[cardStyle, styles.summary]}>
              <SummaryLine label="Itens" value={`${cartCount}`} />
              <SummaryLine label="Subtotal" value={formatMoney(subtotal)} />
              <SummaryLine label="Entrega" value={shipping === 0 ? 'Gratis' : formatMoney(shipping)} />
              <View style={styles.divider} />
              <SummaryLine label="Total" value={formatMoney(total)} strong />
              <PrimaryButton label="Ir para checkout" icon="credit-card-check-outline" onPress={onCheckout} />
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

function CartLine({ item, onChangeQuantity }) {
  return (
    <View style={[cardStyle, styles.line]}>
      <View style={[styles.visual, { backgroundColor: item.product.color }]}>
        <MaterialCommunityIcons name={item.product.visual} size={28} color={colors.surface} />
      </View>
      <View style={styles.lineInfo}>
        <Text style={styles.itemName} numberOfLines={1}>
          {item.product.name}
        </Text>
        <Text style={styles.itemMeta}>{formatMoney(item.product.price)} cada</Text>
        <Text style={styles.lineTotal}>{formatMoney(item.lineTotal)}</Text>
      </View>
      <View style={styles.stepper}>
        <IconButton
          icon="minus"
          color={colors.ink}
          background={colors.background}
          onPress={() => onChangeQuantity(item.productId, item.quantity - 1)}
        />
        <Text style={styles.quantity}>{item.quantity}</Text>
        <IconButton
          icon="plus"
          color={colors.ink}
          background={colors.background}
          onPress={() => onChangeQuantity(item.productId, item.quantity + 1)}
        />
      </View>
    </View>
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
  emptyWrap: {
    paddingHorizontal: 18,
  },
  list: {
    paddingHorizontal: 18,
    gap: 12,
  },
  line: {
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  visual: {
    width: 58,
    height: 58,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lineInfo: {
    flex: 1,
    minWidth: 0,
    gap: 3,
  },
  itemName: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: '900',
  },
  itemMeta: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '700',
  },
  lineTotal: {
    color: colors.berry,
    fontSize: 15,
    fontWeight: '900',
  },
  stepper: {
    width: 44,
    alignItems: 'center',
    gap: 6,
  },
  quantity: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: '900',
  },
  summary: {
    marginHorizontal: 18,
    marginTop: 16,
    padding: 14,
    gap: 12,
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
  divider: {
    height: 1,
    backgroundColor: colors.line,
  },
});
