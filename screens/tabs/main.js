import { StyleSheet, Text, View, ActivityIndicator, FlatList, Image, TouchableOpacity } from 'react-native'
import React, {useState, useEffect} from 'react'
import axios from 'axios'
import { SafeAreaView } from 'react-native-safe-area-context';
import {firebase , auth } from '../../firebase'





const Main = () => {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);


  useEffect(() => { 
    setLoading[true];
    axios.get('https://fakestoreapi.com/products').then(res=>{
    setProducts(res.data)
    })
    .catch(e => console.log(e))
    .finally(() => setLoading(false));
  });


  const renderItem = ({item}) => {
    const isFavorite = isProductInFavorites(item.id);
    const isCarted = isProductInCart(item.id);

    const toggleFavorites = isFavorite ? removeFromFavorites : addToFavorites;
    const toggleCart = isCarted ? removeFromCart : addToCart;

    const favoritesText = isFavorite ? 'Remove from Favorites' : 'Add to Favorites';
    const cartText = isCarted ? 'Remove from Cart' : 'Add to Cart';

    return (

    <View style={styles.wrapper}>
      <View style={styles.ImageAndButtonwrapper}>
      
        <View style={styles.Imagewrapper} >
          <Image source={{uri: item.image}} style={styles.image} />
        </View>
        <View>
          <TouchableOpacity style={styles.addButtonFav} >
            <Text  style={styles.addButtonText}
                   onPress={() => toggleFavorites(item.id)}
                    >
            
            {favoritesText}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.addButtonCart} >
            <Text  style={styles.addButtonText}
                   onPress={() => toggleCart(item.id)}
                    >
            
            {cartText}            </Text>
          </TouchableOpacity>


        </View>
        </View>
        <View style={styles.Textwrapper} >
           <Text style={styles.text}>{item.title}</Text>
           <Text style={styles.text}>{item.description}</Text>
           <Text style={styles.text}>{item.price} TL</Text>

        </View>
    </View>
  )}

  const addToFavorites = async (productId) => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = firebase.firestore().collection('users').doc(user.email);
  
        // Get the current favorites array
        const userDoc = await userDocRef.get();
        const currentFavorites = userDoc.data().fav || [];
  
        // Check if the product ID is not already in the favorites
        if (!currentFavorites.includes(productId)) {
          currentFavorites.push(productId);
  
          // Update the Firestore document with the updated favorites array
          await userDocRef.update({ fav: currentFavorites });
  
          alert('Product added to favorites!');
        } else {
          alert('Product is already in favorites.');
        }
      } else {
        alert('User not authenticated.');
      }
    } catch (error) {
      console.error('Error adding product to favorites:', error);
    }
  };
  

  const isProductInFavorites = async (productId) => {
    const user = auth.currentUser;
    if (user) {
      const userDocRef = firebase.firestore().collection('users').doc(user.email);
      const userDoc = await userDocRef.get();
      const currentFavorites = userDoc.data().fav || []; 
      console.log(currentFavorites.includes(productId));
      return currentFavorites.includes(productId);
    }
    return false;
  };


  const isProductInCart = async (productId) => {
    const user = auth.currentUser;
    if (user) {
      const userDocRef = firebase.firestore().collection('users').doc(user.email);
      const userDoc = await userDocRef.get();
      const currentCart = userDoc.data().cart || []; 
      return currentCart.includes(productId);
    }
    return false;
  };


  const addToCart = async (productId) => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = firebase.firestore().collection('users').doc(user.email);
          const userDoc = await userDocRef.get();
        const currentCart = userDoc.data().cart || [];
  
        // Check if the product ID is not already in the favorites
        if (!currentCart.includes(productId)) {
          currentCart.push(productId);
  
          // Update the Firestore document with the updated favorites array
          await userDocRef.update({ cart: currentCart });
  
          alert('Product added to cart!');
        } else {
          alert('Product is already in cart.');
        }
      } else {
        alert('User not authenticated.');
      }
    } catch (error) {
      console.error('Error adding product to favorites:', error);
    }
  };




  
  const removeFromFavorites = async (productId) => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = firebase.firestore().collection('users').doc(user.email);

        // Get the current favorites array
        const userDoc = await userDocRef.get();
        const currentFavorites = userDoc.data().fav || [];

        // Check if the product ID is in the favorites
        const index = currentFavorites.indexOf(productId);
        if (index !== -1) {
          currentFavorites.splice(index, 1);

          // Update the Firestore document with the updated favorites array
          await userDocRef.update({ fav: currentFavorites });

          alert('Product removed from favorites!');
        } else {
          alert('Product is not in favorites.');
        }
      } else {
        alert('User not authenticated.');
      }
    } catch (error) {
      console.error('Error removing product from favorites:', error);
    }
  };




  const removeFromCart = async (productId) => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = firebase.firestore().collection('users').doc(user.email);

        // Get the current cart array
        const userDoc = await userDocRef.get();
        const currentCart = userDoc.data().cart || [];

        // Check if the product ID is in the cart
        const index = currentCart.indexOf(productId);
        if (index !== -1) {
          currentCart.splice(index, 1);

          await userDocRef.update({ fav: currentCart });

          alert('Product removed from cart!');
        } else {
          alert('Product is not in cart.');
        }
      } else {
        alert('User not authenticated.');
      }
    } catch (error) {
      console.error('Error removing product from cart:', error);
    }
  };


  return (
        <SafeAreaView style={styles.root}>
          {loading ? 
          <View style={styles.loadingContainer}>

              <ActivityIndicator size={"large"} color={"#000"}/>
                
          </View>
          :   
          <FlatList data={products}
          keyExtractor={element => element.id}
          renderItem={renderItem}
          />} 
        </SafeAreaView>  
        )
}

export default Main

const styles = StyleSheet.create({
  root:{
    flex:1,
    padding:5,
    backgroundColor:"#ffffff"
  },
  loadingContainer:{
    alignItems: "center",
    justifyContent: "center",
    flex:1
  },
  image:{
    width:150,
    height:150,
    resizeMode: 'contain',

  },
  text:{
    marginVertical:5
  },
  wrapper:{
    alignItems:"center",
    flexDirection:"row",
    justifyContent:"center", 
    marginVertical:20,
    borderWidth:1,
    borderColor: "#dedede",
    padding:10
  },
  Imagewrapper:{
    flex:1,
    alignItems:"center",
    justifyContent:"center", 
  },
  Textwrapper:{
    flex:1
  },
  ImageAndButtonwrapper:{
    flex:1,
    alignItems:"center",
    justifyContent:"center", 
  },
  addButtonFav:{
   marginVertical:10,
   backgroundColor:"blue",
   padding:10,
   alignItems:"center",
    justifyContent:"center", 
  },
  addButtonCart:{
    marginVertical:10,
    backgroundColor:"red",
    padding:10,
    alignItems:"center",
     justifyContent:"center", 
   },
  addButtonText:{
    fontSize:19,
    color:"#ffffffff",
    alignItems:"center",
    justifyContent:"center", 
   },



  
})