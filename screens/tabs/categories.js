import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, FlatList, Image, StyleSheet } from 'react-native';
import axios from 'axios';
import { SafeAreaView } from 'react-native-safe-area-context';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [productsByCategory, setProductsByCategory] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesResponse = await axios.get('https://fakestoreapi.com/products/categories');
        setCategories(categoriesResponse.data);

        const productData = {};
        for (const category of categoriesResponse.data) {
          const response = await axios.get(`https://fakestoreapi.com/products/category/${category}`);
          productData[category] = response.data.slice(0, 5);
        }
        setProductsByCategory(productData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.productItem}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <Text style={styles.productTitle}>{item.title}</Text>
      <Text style={styles.productPrice}>{item.price} TL</Text>
    </View>
  );

  const renderCategory = ({ item }) => (
    <View style={styles.categoryWrapper}>
      <Text style={styles.categoryTitle}>{item}</Text>
      <FlatList
        data={productsByCategory[item]}
        keyExtractor={(product) => product.id.toString()}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.root}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      ) : (
        <FlatList
          data={categories}
          keyExtractor={(element) => element}
          renderItem={renderCategory}
          contentContainerStyle={styles.container}
        />
      )}
    </SafeAreaView>
  );
};

export default Categories;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  categoryWrapper: {
    marginBottom: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 10,
  },
  categoryTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333', 
  },
  productItem: {
    marginRight: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000', 
    shadowOpacity: 0.2,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    elevation: 2,
  },
  productImage: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    borderRadius: 10,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
  },
});
