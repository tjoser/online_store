import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { auth } from '../../firebase'
import { useNavigation } from '@react-navigation/core'


const Cart = () => {
    const navigation = useNavigation()

  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        navigation.replace("Login")
      })
      .catch(error => alert(error.message))
  }


  return (
    <View style={styles.container}>
    <Text>Email: {auth.currentUser?.email}</Text>
    <TouchableOpacity
      onPress={handleSignOut}
      style={styles.button}
    >
      <Text style={styles.buttonText}>Sign out</Text>
    </TouchableOpacity>
    
  </View>

  )
}

export default Cart

const styles = StyleSheet.create({})