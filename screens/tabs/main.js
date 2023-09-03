import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import { firebase, auth } from '../../firebase';

const Main = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get('https://fakestoreapi.com/products')
      .then((res) => {
        setProducts(res.data);
      })
      .catch((e) => console.log(e))
      .finally(() => setLoading(false));
  }, []);

  const [favorites, setFavorites] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const userDocRef = firebase.firestore().collection('users').doc(user.email);
      const unsubscribe = userDocRef.onSnapshot((snapshot) => {
        const data = snapshot.data();
        if (data) {
          setFavorites(data.fav || []);
          setCart(data.cart || []);
        }
      });

      return () => {
        unsubscribe();
      };
    }
  }, []);

  const isProductInFavorites = (productId) => {
    return favorites.includes(productId);
  };

  const isProductInCart = (productId) => {
    return cart.includes(productId);
  };

  const toggleFavorites = async (productId) => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = firebase.firestore().collection('users').doc(user.email);
        const userDoc = await userDocRef.get();
        const currentFavorites = userDoc.data()?.fav || [];

        if (currentFavorites.includes(productId)) {
          const updatedFavorites = currentFavorites.filter((id) => id !== productId);
          await userDocRef.update({ fav: updatedFavorites });
          setFavorites(updatedFavorites);
        } else {
          currentFavorites.push(productId);
          await userDocRef.update({ fav: currentFavorites });
          setFavorites(currentFavorites);
        }
      }
    } catch (error) {
      console.error('Error updating favorites:', error);
    }
  };

  const toggleCart = async (productId) => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = firebase.firestore().collection('users').doc(user.email);
        const userDoc = await userDocRef.get();
        const currentCart = userDoc.data()?.cart || [];

        if (currentCart.includes(productId)) {
          const updatedCart = currentCart.filter((id) => id !== productId);
          await userDocRef.update({ cart: updatedCart });
          setCart(updatedCart);
        } else {
          currentCart.push(productId);
          await userDocRef.update({ cart: currentCart });
          setCart(currentCart);
        }
      }
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  };

  const renderItem = ({ item }) => {
    const isFavorite = isProductInFavorites(item.id);
    const isCarted = isProductInCart(item.id);

    const toggleFavoritesText = isFavorite ? 'Remove from Favorites' : 'Add to Favorites';
    const toggleCartText = isCarted ? 'Remove from Cart' : 'Add to Cart';

    return (
      <View style={styles.card}>
        <View style={styles.imageWrapper}>
          <Image source={{ uri: item.image }} style={styles.image} />
        </View>
        <View style={styles.content}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
          <Text style={styles.price}>{item.price} TL</Text>
          <TouchableOpacity style={styles.favoriteButton} onPress={() => toggleFavorites(item.id)}>
            <Text style={styles.favoriteButtonText}>{toggleFavoritesText}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cartButton} onPress={() => toggleCart(item.id)}>
            <Text style={styles.cartButtonText}>{toggleCartText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      ) : (
        <FlatList data={products} keyExtractor={(element) => element.id.toString()} renderItem={renderItem} />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
    elevation: 2,
  },
  imageWrapper: {
    flex: 1,
  },
  image: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 8,
  },
  content: {
    flex: 2,
    marginLeft: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    marginBottom: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  favoriteButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  cartButton: {
    backgroundColor: '#F44336',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  favoriteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cartButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Main;
