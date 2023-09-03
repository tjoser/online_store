import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Button,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';

const UpdateProductTab = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [updatedProductData, setUpdatedProductData] = useState({
    title: '',
    description: '',
    price: '',
    imageUrl: '',
  });

  useEffect(() => {
    axios
      .get('https://fakestoreapi.com/products')
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error('Error fetching products:', error);
      });
  }, []);

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);

    setUpdatedProductData({
      title: product.title,
      description: product.description,
      price: product.price.toString(),
      imageUrl: product.image,
    });
  };

  const handleUpdateProduct = () => {
    if (!selectedProduct) {
      return;
    }

    console.log('Updating product:', selectedProduct);
    console.log('Updated data:', updatedProductData);
  };

  const renderProductItem = ({ item }) => (
    <TouchableOpacity
      style={styles.productItem}
      onPress={() => handleSelectProduct(item)}
    >
      <Text style={styles.productTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  const renderProductUpdateForm = () => (
    <View style={styles.productUpdateForm}>
      <Text style={styles.headerText}>Update Product</Text>
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={updatedProductData.title}
        onChangeText={(text) =>
          setUpdatedProductData({ ...updatedProductData, title: text })
        }
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={updatedProductData.description}
        onChangeText={(text) =>
          setUpdatedProductData({ ...updatedProductData, description: text })
        }
      />
      <TextInput
        style={styles.input}
        placeholder="Price"
        value={updatedProductData.price}
        onChangeText={(text) =>
          setUpdatedProductData({ ...updatedProductData, price: text })
        }
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Image URL"
        value={updatedProductData.imageUrl}
        onChangeText={(text) =>
          setUpdatedProductData({ ...updatedProductData, imageUrl: text })
        }
      />
      <Button title="Update Product" onPress={handleUpdateProduct} />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.productList}>
        <Text style={styles.headerText}>Select a Product to Update:</Text>
        <FlatList
          data={products}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderProductItem}
        />
      </View>
      {selectedProduct && renderProductUpdateForm()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f0f0f0',
  },
  productList: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  productItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  productTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  productUpdateForm: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
  },
});

export default UpdateProductTab;
