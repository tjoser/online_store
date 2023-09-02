import { StyleSheet, Text, View, ActivityIndicator, FlatList, Image } from 'react-native'
import React, {useState, useEffect} from 'react'
import axios from 'axios'
import { SafeAreaView } from 'react-native-safe-area-context';




const Categories = () => {

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);


  useEffect(() => { 
    setLoading[true];
    axios.get('https://fakestoreapi.com/products/categories').then(res=>{
    setCategories(res.data)
    })
    .catch(e => console.log(e))
    .finally(() => setLoading(false));
  });


  const renderItem = ({item}) => (
    <View style={styles.wrapper}>
        <View style={styles.categoryChip} >
            <Text style={styles.categoryChipText} >{item}</Text>
        </View>

        
    </View>
  )

  return (
        <SafeAreaView style={styles.root}>
          {loading ? 
          <View style={styles.loadingContainer}>

              <ActivityIndicator size={"large"} color={"#000"}/>
                
          </View>
          :   
          <FlatList data={categories}
          keyExtractor={element => element}
          renderItem={renderItem}
          />} 
        </SafeAreaView>  
        )
}

export default Categories

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
  categoryChip:{
    padding:5,
    backgroundColor:"tomato",
    color:"#ffffffff",
    alignItems:"center",
    justifyContent: "center",
    textAlign:"center",
    marginVertical:20,
    borderRadius:20,
    width:"50%"
  },
  categoryChipText:{
    fontSize: 20,
    fontWeight:"bold"
  },
  wrapper:{
    alignItems:"center",
    justifyContent: "center", 
  }

})