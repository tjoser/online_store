import React, { useEffect, useState } from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { auth, firebase } from '../firebase';
import { View, Text, StyleSheet } from 'react-native';
import Main from './tabs/main';
import Categories from './tabs/categories';
import Fav from './tabs/fav';
import Cart from './tabs/cart';
import UsersTab from './tabs/userstab';
import UpdateProductTab from './tabs/updateproducttab';

const Tab = createMaterialBottomTabNavigator();

const HomeScreen = () => {
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const userDocRef = firebase.firestore().collection('users').doc(user.email);

      userDocRef
        .get()
        .then((doc) => {
          if (doc.exists) {
            const userData = doc.data();
            if (userData && userData.mode) {
              setUserRole(userData.mode);
            }
          }
        })
        .catch((error) => {
          console.error('Error getting user role:', error);
        });
    }
  }, []);

  return (
    <Tab.Navigator
      initialRouteName="Feed"
      activeColor="#ffffff"
      barStyle={{ backgroundColor: '#3498db' }} 
    >
      <Tab.Screen
        name="Feed"
        component={Main}
        options={{
          tabBarLabel: 'Products',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="shopping" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Categories"
        component={Categories}
        options={{
          tabBarLabel: 'Categories',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="shopping-search" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Favourites"
        component={Fav}
        options={{
          tabBarLabel: 'Favourites',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="heart" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Cart"
        component={Cart}
        options={{
          tabBarLabel: 'Cart',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="cart" color={color} size={26} />
          ),
        }}
      />
      {(userRole === 'admin' || userRole === 'manager') && ( 
        <Tab.Screen
          name="UpdateProduct"
          component={UpdateProductTab} 
          options={{
            tabBarLabel: 'Update Product',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="pencil" color={color} size={26} />
            ),
          }}
        />
      )}
      {userRole === 'admin' && (
        <Tab.Screen
          name="Users"
          component={UsersTab}
          options={{
            tabBarLabel: 'Users',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="account-group" color={color} size={26} />
            ),
          }}
        />
      )}
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
