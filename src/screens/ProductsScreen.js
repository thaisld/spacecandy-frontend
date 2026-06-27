import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { BrandHeader, Chip, IconButton, InputField, PrimaryButton, ScreenTitle, cardStyle } from '../components/ui';
import { colors, radii } from '../theme';
import { formatMoney } from '../utils/format';

export default function ProductsScreen({ user, products, cartCount, onAddToCart, onGoToCart }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Todos');

  const categories = useMemo(() => {
    const unique = Array.from(new Set(products.map((product) => product.category)));
    return ['Todos', ...unique];
  }, [products]);

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return products.filter((product) => {
      const matchesCategory = category === 'Todos' || product.category === category;
      const matchesQuery =
        !normalizedQuery ||
        product.name.toLowerCase().includes(normalizedQuery) ||
        product.description.toLowerCase().includes(normalizedQuery);

      return matchesCategory && matchesQuery;
    });
  }, [products, query, category]);

  return (
    <View style={styles.root}>
      <BrandHeader
        subtitle={`Ola, ${user.name}`}
        right={
          <IconButton
            icon="cart-outline"
            color={colors.surface}
            background="#25314A"
            count={cartCount}
            onPress={onGoToCart}
          />
        }
      />

      <ScrollView contentContainerStyle={styles.content}>
        <ScreenTitle
          eyebrow={`${products.length} itens  |  novos toda semana`}
          title="A Loja"
          subtitle="Doces que parecem proibidos, mas sao 100% açúcar, legais e deliciosos."
        />

        <View style={styles.searchArea}>
          <InputField
            label="Buscar"
            icon="magnify"
            value={query}
            onChangeText={setQuery}
          />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chips}
          >
            {categories.map((item) => (
              <Chip
                key={item}
                label={item}
                active={category === item}
                onPress={() => setCategory(item)}
                color={item === 'Todos' ? colors.sun : colors.berry}
              />
            ))}
          </ScrollView>
        </View>

        <View style={styles.productList}>
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

function ProductCard({ product, onAddToCart }) {
  const disabled = product.stock === 0;
  const gradient = product.gradient ?? [product.color, colors.violet];

  return (
    <View style={[cardStyle, styles.productCard]}>
      <LinearGradient colors={gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.visual}>
        <View style={styles.badge}>
          <Text style={styles.badgeText} numberOfLines={1}>
            {product.badge}
          </Text>
        </View>
        <MaterialCommunityIcons name={product.visual} size={62} color={colors.ink} />
      </LinearGradient>
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={1}>
          {product.name}
        </Text>
        <Text style={styles.description} numberOfLines={2}>
          {product.description}
        </Text>
        <View style={styles.metaLine}>
          <Text style={styles.price}>{formatMoney(product.price)}</Text>
          <PrimaryButton
            label={disabled ? 'Esgotado' : '+ Add'}
            disabled={disabled}
            variant="secondary"
            onPress={() => onAddToCart(product.id)}
            style={styles.addButton}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingBottom: 28,
  },
  searchArea: {
    paddingHorizontal: 18,
    paddingTop: 4,
    gap: 12,
  },
  chips: {
    gap: 8,
    paddingRight: 18,
  },
  productList: {
    paddingHorizontal: 18,
    paddingTop: 20,
    gap: 28,
  },
  productCard: {
    overflow: 'hidden',
    borderColor: colors.line,
  },
  visual: {
    height: 210,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  productInfo: {
    padding: 18,
    gap: 12,
  },
  productName: {
    color: colors.ink,
    fontSize: 23,
    fontWeight: '900',
  },
  badge: {
    position: 'absolute',
    top: 16,
    left: 16,
    maxWidth: 140,
    borderRadius: radii.sm,
    backgroundColor: colors.black,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  badgeText: {
    color: colors.ink,
    fontFamily: 'Courier New',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 2,
  },
  description: {
    color: colors.muted,
    fontSize: 16,
    lineHeight: 23,
  },
  metaLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  price: {
    color: colors.sun,
    fontFamily: 'Courier New',
    fontSize: 19,
    fontWeight: '900',
  },
  addButton: {
    minWidth: 116,
    minHeight: 48,
    backgroundColor: colors.surface,
  },
});
