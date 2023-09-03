import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, ActivityIndicator, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { firebase, auth } from '../../firebase';
import { useNavigation } from '@react-navigation/native';

const Cart = () => {
  const [cartProducts, setCartProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchCartProducts();

    const user = auth.currentUser;
    if (user) {
      const userDocRef = firebase.firestore().collection('users').doc(user.email);
      return userDocRef.onSnapshot((snapshot) => {
        const currentCart = snapshot.data()?.cart || [];
        fetchCartProductsFromAPI(currentCart);
      });
    }

    return () => {};
  }, []);

  const fetchCartProducts = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = firebase.firestore().collection('users').doc(user.email);
        const userDoc = await userDocRef.get();
        const currentCart = userDoc.data()?.cart || [];
        fetchCartProductsFromAPI(currentCart);
      }
    } catch (error) {
      console.error('Error fetching cart products:', error);
      setLoading(false);
    }
  };

  const fetchCartProductsFromAPI = async (productIds) => {

    const apiUrl = 'https://fakestoreapi.com/products';

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();

      const cartProducts = data.filter((product) => productIds.includes(product.id));
      setCartProducts(cartProducts);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching cart products from API:', error);
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => {
    return (
      <View style={styles.wrapper}>
        <View style={styles.imageWrapper}>
          <Image source={{ uri: item.image }} style={styles.image} />
        </View>
        <View style={styles.textWrapper}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
          <Text style={styles.price}>{item.price} TL</Text>
        </View>
        <View style={styles.buttonWrapper}>
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: 'red' }]}
            onPress={() => removeFromCart(item.id)}
          >
            <Text style={styles.addButtonText}>Remove</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const removeFromCart = async (productId) => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = firebase.firestore().collection('users').doc(user.email);

        const userDoc = await userDocRef.get();
        const currentCart = userDoc.data()?.cart || [];

        const index = currentCart.indexOf(productId);
        if (index !== -1) {
          currentCart.splice(index, 1);

          await userDocRef.update({ cart: currentCart });
        }
      }
    } catch (error) {
      console.error('Error removing product from cart:', error);
    }
  };

  const calculateTotalPrice = () => {
    return cartProducts.reduce((total, product) => total + parseFloat(product.price), 0).toFixed(2);
  };

  const handleCheckout = () => {
    Linking.openURL('https://czlondon.com/');
  };

  const navigation = useNavigation();

  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        navigation.replace('Login');
      })
      .catch((error) => alert(error.message));
  };

  return (
    <SafeAreaView style={styles.root}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      ) : (
        <>
          <FlatList
            data={cartProducts}
            keyExtractor={(element) => element.id.toString()}
            renderItem={renderItem}
          />
          <View style={styles.totalContainer}>
            <Text style={styles.totalText}>Total Price: {calculateTotalPrice()} TL</Text>
            <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
              <Text style={styles.checkoutButtonText}>Checkout</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={handleSignOut}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </>
      )}
    </SafeAreaView>
  );
};

export default Cart;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    padding: 5,
    backgroundColor: '#ffffff',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 20,
    borderWidth: 1,
    borderColor: '#dedede',
    padding: 10,
  },
  imageWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
  textWrapper: {
    flex: 2,
    paddingHorizontal: 10,
    marginLeft: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    color: '#777',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
  },
  buttonWrapper: {
    flex: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButton: {
    marginVertical: 10,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    minWidth: 80, 
    marginLeft: 5
  },
  addButtonText: {
    fontSize: 16,
    color: '#ffffff',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 10,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  checkoutButton: {
    backgroundColor: 'blue',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  checkoutButtonText: {
    fontSize: 18,
    color: '#ffffff',
  },
  logoutButton: {
    backgroundColor: 'red',
    margin: 10,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  logoutButtonText: {
    fontSize: 18,
    color: '#ffffff',
  },
});
