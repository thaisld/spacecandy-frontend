import React, { useContext, useEffect, useState, useMemo } from 'react';
import { Alert, SafeAreaView, StyleSheet, View, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { colors } from './src/theme';
import AuthScreen from './src/screens/AuthScreen';
import ProductsScreen from './src/screens/ProductsScreen';
import CartScreen from './src/screens/CartScreen';
import CheckoutScreen from './src/screens/CheckoutScreen';
import ReceiptScreen from './src/screens/ReceiptScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import AdminScreen from './src/screens/AdminScreen';
import BottomNav from './src/components/BottomNav';
import { buildOrderId } from './src/utils/format';

import { AuthProvider, AuthContext } from './src/contexts/AuthContext';
import api from './src/services/api';

const customerTabs = [
  { key: 'products', label: 'Loja', icon: 'view-grid-outline' },
  { key: 'cart', label: 'Carrinho', icon: 'cart-outline' },
  { key: 'history', label: 'Historico', icon: 'clipboard-text-clock-outline' },
  { key: 'profile', label: 'Perfil', icon: 'account-circle-outline' },
];

function Root() {
  const { signed, currentUser, loading: authLoading, login, register, logout, updateProfile } = useContext(AuthContext);
  
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [activeScreen, setActiveScreen] = useState('products');
  const [cartItems, setCartItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [receiptOrder, setReceiptOrder] = useState(null);

  useEffect(() => {
    if (signed) {
      fetchProducts();
      if (currentUser?.role !== 'admin') {
        fetchOrders();
      }
    }
  }, [signed]);

  const fetchProducts = async () => {
    try {
      setProductsLoading(true);
      // Fetch converted to BRL if customer, else normal? The API allows targetCurrency
      // Aumentamos o 'size' para evitar que os produtos fiquem escondidos na paginação 2
      const res = await api.get('/products?targetCurrency=BRL&size=100');
      // Spring Boot returns a Page object containing 'content' array
      const productList = res.data.content ? res.data.content : res.data;
      
      // Map API DTO to frontend format
      const mapped = productList.map(p => ({
        id: p.id, // DTO id is long/number
        name: p.name, 
        category: p.category || 'Gomas',
        description: p.description,
        price: p.convertedPrice || p.price,
        stock: p.stock,
        visual: p.imageURL || 'orbit', 
        color: p.color || '#E83E7C',
        gradient: [p.color || '#F356AE', '#9561F2'],
        badge: 'NOVO',
      }));
      setProducts(mapped);
    } catch (err) {
      console.error(err);
      Alert.alert('Erro', 'Não foi possível carregar os produtos.');
    } finally {
      setProductsLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await api.get('/ws/orders?targetCurrency=BRL');
      // Spring Boot Page object
      const orderList = res.data.content ? res.data.content : res.data;
      
      const mappedOrders = orderList.map((o) => ({
        id: o.id,
        createdAt: o.orderDate,
        customer: currentUser,
        items: o.items.map((i) => ({
          productId: i.productId,
          name: i.product?.model || 'Produto',
          visual: i.product?.imageURL || 'orbit',
          quantity: i.quantity,
          price: i.convertedPriceAtPruchase || i.priceAtPurchase,
          lineTotal: (i.convertedPriceAtPruchase || i.priceAtPurchase) * i.quantity,
        })),
        subtotal: o.totalConvertedPrice || o.totalPrice,
        shipping: 0,
        total: o.totalConvertedPrice || o.totalPrice,
        status: 'Pedido confirmado',
        delivery: {
          receiver: currentUser?.name || 'Cliente',
          address: currentUser?.address || 'Rua das Galaxias, 42 - Via Lactea',
          phone: currentUser?.phone || '(11) 98765-4321'
        },
        payment: {
          method: 'Cartão de Crédito',
          status: 'Aprovado'
        }
      }));

      setOrders(mappedOrders);
    } catch (err) {
      console.warn('Erro ao carregar histórico de pedidos', err);
    }
  };

  const cartDetails = useMemo(() => {
    return cartItems
      .map((item) => {
        const product = products.find((entry) => entry.id === item.productId);
        if (!product) return null;
        return {
          ...item,
          product,
          lineTotal: product.price * item.quantity,
        };
      })
      .filter(Boolean);
  }, [cartItems, products]);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogin = async ({ email, password }) => {
    const success = await login(email, password);
    if (success) {
      setReceiptOrder(null);
      setActiveScreen('products');
    }
  };

  const handleRegister = async ({ name, email, password }) => {
    if (!name.trim() || !email || password.length < 4) {
      Alert.alert('Cadastro incompleto', 'Preencha nome, e-mail e senha.');
      return;
    }
    const success = await register(name, email, password);
    if (success) {
      setActiveScreen('products');
    }
  };

  const handleLogout = () => {
    logout();
    setActiveScreen('products');
    setCartItems([]);
    setOrders([]);
    setReceiptOrder(null);
  };

  const handleAddToCart = (productId) => {
    const product = products.find((item) => item.id === productId);
    const cartLine = cartItems.find((item) => item.productId === productId);
    const currentQuantity = cartLine?.quantity ?? 0;

    if (!product || product.stock <= currentQuantity) {
      Alert.alert('Estoque limitado', 'Não há mais unidades disponíveis.');
      return;
    }

    setCartItems((current) => {
      const exists = current.some((item) => item.productId === productId);
      if (!exists) return [...current, { productId, quantity: 1 }];
      return current.map((item) =>
        item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item
      );
    });
  };

  const handleChangeQuantity = (productId, nextQuantity) => {
    const product = products.find((item) => item.id === productId);
    if (!product) return;

    if (nextQuantity <= 0) {
      setCartItems((current) => current.filter((item) => item.productId !== productId));
      return;
    }

    if (nextQuantity > product.stock) {
      Alert.alert('Estoque', `Temos ${product.stock} unidade(s).`);
      return;
    }

    setCartItems((current) =>
      current.map((item) =>
        item.productId === productId ? { ...item, quantity: nextQuantity } : item
      )
    );
  };

  const handleCheckout = async (checkoutData) => {
    if (cartDetails.length === 0) return;

    const payload = {
      items: cartDetails.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
      }))
    };

    try {
      await api.post('/ws/orders', payload);
      Alert.alert('Sucesso', 'Pedido criado com sucesso!');
      
      // Update local state temporarily
      const subtotal = cartDetails.reduce((sum, item) => sum + item.lineTotal, 0);
      const shipping = subtotal >= 120 ? 0 : 12.9;
      const total = subtotal + shipping;

      const order = {
        id: buildOrderId(),
        createdAt: new Date().toISOString(),
        customer: currentUser,
        items: cartDetails.map((item) => ({
          productId: item.product.id,
          name: item.product.name,
          visual: item.product.visual,
          quantity: item.quantity,
          price: item.product.price,
          lineTotal: item.lineTotal,
        })),
        subtotal,
        shipping,
        total,
        status: 'Pedido confirmado',
        delivery: checkoutData.delivery,
        payment: checkoutData.payment,
      };

      setOrders((current) => [order, ...current]);
      setCartItems([]);
      setReceiptOrder(order);
      setActiveScreen('receipt');
      fetchProducts(); // Refresh stock
    } catch (err) {
      console.error(err);
      Alert.alert('Erro', 'Não foi possível finalizar o pedido.');
    }
  };

  const handleSaveProduct = async (productData) => {
    // Expected ProductInDTO: description, brand, model, currency, price, imageURL
    const isEditing = !!productData.id;
    
    // As the frontend modal expects standard names, we map back to ProductInDTO:
    const payload = {
      description: productData.description || '',
      category: productData.category || 'Especial',
      name: productData.name || 'Doce Genérico',
      currency: 'BRL',
      price: productData.price,
      stock: productData.stock,
      imageURL: productData.visual || 'candy-outline',
      color: productData.color || '#E83E7C'
    };

    try {
      if (isEditing) {
        await api.put(`/ws/products/${productData.id}`, payload);
        Alert.alert('Sucesso', 'Produto atualizado.');
      } else {
        await api.post('/ws/products', payload);
        Alert.alert('Sucesso', 'Produto criado.');
      }
      fetchProducts();
    } catch (err) {
      console.error(err);
      Alert.alert('Erro', 'Falha ao salvar produto.');
    }
  };

  const handleRemoveProduct = async (productId) => {
    try {
      await api.delete(`/ws/products/${productId}`);
      setCartItems((current) => current.filter((item) => item.productId !== productId));
      fetchProducts();
    } catch (err) {
      console.error(err);
      Alert.alert('Erro', 'Falha ao deletar produto.');
    }
  };

  if (authLoading) {
    return (
      <SafeAreaView style={[styles.safeArea, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{color: '#fff'}}>Carregando...</Text>
      </SafeAreaView>
    );
  }

  if (!signed) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="light" />
        <AuthScreen onLogin={handleLogin} onRegister={handleRegister} />
      </SafeAreaView>
    );
  }

  if (currentUser?.role === 'admin') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="light" />
        <AdminScreen
          user={currentUser}
          products={products}
          onSaveProduct={handleSaveProduct}
          onRemoveProduct={handleRemoveProduct}
          onLogout={handleLogout}
        />
      </SafeAreaView>
    );
  }

  const renderCustomerScreen = () => {
    const sharedProps = {
      user: currentUser,
      products,
      cartItems,
      cartDetails,
      cartCount,
      orders,
      onAddToCart: handleAddToCart,
      onGoToCart: () => setActiveScreen('cart'),
      onChangeQuantity: handleChangeQuantity,
      onCheckout: () => setActiveScreen('checkout'),
      onBackToProducts: () => setActiveScreen('products'),
      onOpenReceipt: (order) => {
        setReceiptOrder(order);
        setActiveScreen('receipt');
      },
      onHistory: () => setActiveScreen('history'),
      onLogout: handleLogout,
      onSaveProfile: updateProfile,
    };

    if (activeScreen === 'cart') return <CartScreen {...sharedProps} />;
    if (activeScreen === 'checkout') return <CheckoutScreen {...sharedProps} onConfirm={handleCheckout} />;
    if (activeScreen === 'receipt') {
      return (
        <ReceiptScreen
          order={receiptOrder}
          onHistory={() => setActiveScreen('history')}
          onBackToProducts={() => setActiveScreen('products')}
        />
      );
    }
    if (activeScreen === 'history') return <HistoryScreen {...sharedProps} />;
    if (activeScreen === 'profile') return <ProfileScreen {...sharedProps} />;
    return <ProductsScreen {...sharedProps} />;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <View style={styles.app}>
        {renderCustomerScreen()}
        <BottomNav
          tabs={customerTabs}
          activeKey={activeScreen === 'receipt' || activeScreen === 'checkout' ? 'cart' : activeScreen}
          cartCount={cartCount}
          onChange={setActiveScreen}
          iconRenderer={(name, size, color) => (
            <MaterialCommunityIcons name={name} size={size} color={color} />
          )}
        />
      </View>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Root />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.midnight,
  },
  app: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
