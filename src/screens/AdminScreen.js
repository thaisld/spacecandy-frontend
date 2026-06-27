import { useMemo, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { BrandHeader, Chip, IconButton, InputField, Metric, PrimaryButton, ScreenTitle, cardStyle } from '../components/ui';
import { colors, radii } from '../theme';
import { formatMoney, parsePrice } from '../utils/format';

const emptyForm = {
  id: null,
  name: '',
  category: '',
  description: '',
  price: '',
  stock: '',
  visual: 'candy-outline',
  color: '#6847F5',
  badge: '',
};

const colorOptions = [
  '#6847F5',
  '#E83E7C',
  '#20B486',
  '#35A7FF',
  '#F6C453',
  '#F97316',
];

const visualOptions = [
  'candy-outline',
  'star-four-points-outline',
  'earth',
  'meteor',
  'orbit',
  'bottle-soda-classic-outline',
];

export default function AdminScreen({ user, products, onSaveProduct, onRemoveProduct, onLogout }) {
  const [mode, setMode] = useState('list');
  const [form, setForm] = useState(emptyForm);
  const [query, setQuery] = useState('');

  const filteredProducts = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return products;
    }

    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(normalized) ||
        product.category.toLowerCase().includes(normalized)
    );
  }, [products, query]);

  const totalStock = products.reduce((sum, product) => sum + product.stock, 0);
  const totalValue = products.reduce((sum, product) => sum + (product.price * product.stock), 0);

  const editProduct = (product) => {
    setForm({
      ...product,
      price: String(product.price).replace('.', ','),
      stock: String(product.stock),
    });
    setMode('form');
  };

  const clearForm = () => {
    setForm(emptyForm);
    setMode('form');
  };

  const submit = () => {
    const payload = {
      ...form,
      name: form.name.trim(),
      category: form.category.trim() || 'Especial',
      description: form.description.trim(),
      badge: form.badge.trim() || 'Novo',
      price: parsePrice(form.price),
      stock: Number.parseInt(form.stock, 10) || 0,
    };

    if (!payload.name || Number.isNaN(payload.price) || payload.price <= 0) {
      Alert.alert('Produto incompleto', 'Preencha nome e preco valido.');
      return;
    }

    onSaveProduct(payload);
    setForm(emptyForm);
    setMode('list');
  };

  const confirmRemoval = (product) => {
    Alert.alert('Remover produto', `Deseja remover ${product.name}?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Remover', style: 'destructive', onPress: () => onRemoveProduct(product.id) },
    ]);
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <BrandHeader
        subtitle={`Administrador: ${user.name}`}
        right={<IconButton icon="logout" color={colors.surface} background="#25314A" onPress={onLogout} />}
      />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <ScreenTitle
          eyebrow="Area admin"
          title="Manutencao de produtos"
          subtitle="Cadastro, edicao, remocao e controle da lista de produtos."
        />

        <View style={styles.metricsRow}>
          <Metric label="Produtos" value={products.length} tone="violet" />
          <Metric label="Estoque" value={totalStock} tone="mint" />
          <Metric label="Valor total" value={formatMoney(totalValue)} tone="berry" />
        </View>

        <View style={styles.modeRow}>
          <Chip label="Lista" active={mode === 'list'} onPress={() => setMode('list')} color={colors.midnight} />
          <Chip label={form.id ? 'Editar' : 'Cadastrar'} active={mode === 'form'} onPress={clearForm} color={colors.berry} />
        </View>

        {mode === 'list' ? (
          <View style={styles.listArea}>
            <InputField label="Buscar produto" icon="magnify" value={query} onChangeText={setQuery} />
            <PrimaryButton label="Cadastrar produto" icon="package-variant-plus" onPress={clearForm} />

            <View style={styles.productList}>
              {filteredProducts.map((product) => (
                <AdminProductCard
                  key={product.id}
                  product={product}
                  onEdit={() => editProduct(product)}
                  onRemove={() => confirmRemoval(product)}
                />
              ))}
            </View>
          </View>
        ) : (
          <ProductForm form={form} setForm={setForm} onSubmit={submit} onCancel={() => setMode('list')} />
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function AdminProductCard({ product, onEdit, onRemove }) {
  return (
    <View style={[cardStyle, styles.productCard]}>
      <View style={[styles.visual, { backgroundColor: product.color }]}>
        <MaterialCommunityIcons name={product.visual} size={32} color={colors.surface} />
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={1}>
          {product.name}
        </Text>
        <Text style={styles.productMeta}>
          {product.category}  |  {product.stock} un.  |  {formatMoney(product.price)}
        </Text>
      </View>
      <View style={styles.productActions}>
        <IconButton icon="pencil-outline" background={colors.softSky} color={colors.sky} onPress={onEdit} />
        <IconButton icon="trash-can-outline" background={colors.softBerry} color={colors.danger} onPress={onRemove} />
      </View>
    </View>
  );
}

function ProductForm({ form, setForm, onSubmit, onCancel }) {
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  return (
    <View style={[cardStyle, styles.formCard]}>
      <Text style={styles.formTitle}>{form.id ? 'Editar produto' : 'Cadastrar produto'}</Text>
      <InputField label="Nome" icon="package-variant" value={form.name} onChangeText={(value) => update('name', value)} />
      <InputField label="Categoria" icon="tag-outline" value={form.category} onChangeText={(value) => update('category', value)} />
      <InputField label="Descricao" icon="text-box-outline" value={form.description} onChangeText={(value) => update('description', value)} multiline />
      <View style={styles.twoColumns}>
        <View style={styles.fieldColumn}>
          <InputField label="Preco" icon="cash" value={form.price} onChangeText={(value) => update('price', value)} keyboardType="decimal-pad" />
        </View>
        <View style={styles.fieldColumn}>
          <InputField label="Estoque" icon="counter" value={form.stock} onChangeText={(value) => update('stock', value)} keyboardType="number-pad" />
        </View>
      </View>
      <InputField label="Selo" icon="label-outline" value={form.badge} onChangeText={(value) => update('badge', value)} />

      <View style={styles.selectorBlock}>
        <Text style={styles.selectorLabel}>Cor</Text>
        <View style={styles.swatches}>
          {colorOptions.map((color) => (
            <Pressable
              key={color}
              onPress={() => update('color', color)}
              style={[
                styles.swatch,
                { backgroundColor: color },
                form.color === color && styles.swatchActive,
              ]}
            >
              {form.color === color && (
                <MaterialCommunityIcons name="check-bold" size={16} color={colors.surface} />
              )}
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.selectorBlock}>
        <Text style={styles.selectorLabel}>Icone</Text>
        <View style={styles.iconGrid}>
          {visualOptions.map((icon) => (
            <IconButton
              key={icon}
              icon={icon}
              background={form.visual === icon ? colors.midnight : colors.background}
              color={form.visual === icon ? colors.surface : colors.ink}
              onPress={() => update('visual', icon)}
            />
          ))}
        </View>
      </View>

      <PrimaryButton
        label={form.id ? 'Salvar alteracoes' : 'Cadastrar'}
        icon={form.id ? 'content-save-outline' : 'package-variant-plus'}
        onPress={onSubmit}
      />
      <PrimaryButton label="Cancelar" icon="close" variant="ghost" onPress={onCancel} />
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
  metricsRow: {
    paddingHorizontal: 18,
    flexDirection: 'row',
    gap: 10,
  },
  modeRow: {
    paddingHorizontal: 18,
    paddingTop: 16,
    flexDirection: 'row',
    gap: 8,
  },
  listArea: {
    paddingHorizontal: 18,
    paddingTop: 16,
    gap: 12,
  },
  productList: {
    gap: 12,
  },
  productCard: {
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
  productInfo: {
    flex: 1,
    minWidth: 0,
  },
  productName: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: '900',
  },
  productMeta: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 3,
  },
  productActions: {
    gap: 8,
  },
  formCard: {
    marginHorizontal: 18,
    marginTop: 16,
    padding: 14,
    gap: 13,
  },
  formTitle: {
    color: colors.ink,
    fontSize: 20,
    fontWeight: '900',
  },
  twoColumns: {
    flexDirection: 'row',
    gap: 10,
  },
  fieldColumn: {
    flex: 1,
  },
  selectorBlock: {
    gap: 8,
  },
  selectorLabel: {
    color: colors.ink,
    fontSize: 13,
    fontWeight: '800',
  },
  swatches: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  swatch: {
    width: 38,
    height: 38,
    borderRadius: radii.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  swatchActive: {
    borderWidth: 3,
    borderColor: colors.ink,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
});
