import React, { useState, useEffect } from 'react';
import { View, Text, Image, ActivityIndicator, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { firebase, auth } from '../../firebase';

const Fav = () => {
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchFavoriteProducts();

    const user = auth.currentUser;
    if (user) {
      const userDocRef = firebase.firestore().collection('users').doc(user.email);
      return userDocRef.onSnapshot((snapshot) => {
        const currentFavorites = snapshot.data()?.fav || [];
        fetchFavoriteProductsFromAPI(currentFavorites);
      });
    }

    return () => {};
  }, []);

  const fetchFavoriteProducts = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = firebase.firestore().collection('users').doc(user.email);
        const userDoc = await userDocRef.get();
        const currentFavorites = userDoc.data()?.fav || [];
        fetchFavoriteProductsFromAPI(currentFavorites);
      }
    } catch (error) {
      console.error('Error fetching favorite products:', error);
      setLoading(false);
    }
  };

  const fetchFavoriteProductsFromAPI = async (productIds) => {
    const apiUrl = 'https://fakestoreapi.com/products';

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();

      const favoriteProducts = data.filter((product) => productIds.includes(product.id));
      setFavoriteProducts(favoriteProducts);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching favorite products from API:', error);
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
            style={[styles.addButton, { backgroundColor: 'green' }]}
            onPress={() => addToCart(item.id)}
          >
            <Text style={styles.addButtonText}>Add to Cart</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: 'red' }]}
            onPress={() => removeFromFavorites(item.id)}
          >
            <Text style={styles.addButtonText}>Remove from Favorites</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const addToCart = async (productId) => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = firebase.firestore().collection('users').doc(user.email);

        const userDoc = await userDocRef.get();
        const currentCart = userDoc.data()?.cart || [];

        if (!currentCart.includes(productId)) {
          currentCart.push(productId);

          await userDocRef.update({ cart: currentCart });

          alert('Product added to cart!');
        } else {
          alert('Product is already in the cart.');
        }
      } else {
        alert('User not authenticated.');
      }
    } catch (error) {
      console.error('Error adding product to cart:', error);
    }
  };

  const removeFromFavorites = async (productId) => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = firebase.firestore().collection('users').doc(user.email);

        const userDoc = await userDocRef.get();
        const currentFavorites = userDoc.data()?.fav || [];

        const index = currentFavorites.indexOf(productId);
        if (index !== -1) {
          currentFavorites.splice(index, 1);

          await userDocRef.update({ fav: currentFavorites });
        }
      }
    } catch (error) {
      console.error('Error removing product from favorites:', error);
    }
  };

  return (
    <SafeAreaView style={styles.root}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          {favoriteProducts.map((item) => (
            <View key={item.id} style={styles.productContainer}>
              <View style={styles.productCard}>
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
                    style={[styles.addButton, { backgroundColor: 'green' }]}
                    onPress={() => addToCart(item.id)}
                  >
                    <Text style={styles.addButtonText}>Add to Cart</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.addButton, { backgroundColor: 'red' }]}
                    onPress={() => removeFromFavorites(item.id)}
                  >
                    <Text style={styles.addButtonText}>Remove from Favorites</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default Fav;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  scrollViewContent: {
    padding: 10,
  },
  image: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
  productContainer: {
    marginBottom: 20,
  },
  productCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#dedede',
    padding: 10,
  },
  imageWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  textWrapper: {
    flex: 2,
    paddingHorizontal: 10,
    marginLeft: 10
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 16,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonWrapper: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  addButton: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    marginVertical: 5,

  },
  addButtonText: {
    fontSize: 16,
    color: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
