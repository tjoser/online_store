import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { firebase } from '../../firebase';
import { Ionicons } from '@expo/vector-icons';

const UsersTab = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    setLoading(true);

    const usersCollection = firebase.firestore().collection('users');

    let query = usersCollection;

    if (activeFilter === 'Manager') {
      query = query.where('mode', '==', 'manager');
    }

    const unsubscribe = query.onSnapshot((querySnapshot) => {
      const userData = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        userData.push({
          id: doc.id,
          email: data.email || '',
          cartItemCount: (data.cart && data.cart.length) || 0,
          favoritesCount: (data.fav && data.fav.length) || 0,
          mode: data.mode || 'user',
        });
      });

      setUsers(userData);
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, [activeFilter]);

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  const assignManager = async (userId) => {
    try {
      await firebase.firestore().collection('users').doc(userId).update({
        mode: 'manager',
      });
    } catch (error) {
      console.error('Error assigning manager:', error);
      Alert.alert('Error', 'Failed to assign manager role to the user.');
    }
  };

  const relegateToUser = async (userId) => {
    try {
      await firebase.firestore().collection('users').doc(userId).update({
        mode: 'user',
      });
    } catch (error) {
      console.error('Error relegate to user:', error);
      Alert.alert('Error', 'Failed to relegate the user to a normal user.');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.userItem}>
      <Ionicons name="person" size={32} color="#007AFF" style={styles.userIcon} />
      <View style={styles.userInfo}>
        <Text style={styles.userEmail}>{item.email}</Text>
        <Text style={styles.userStats}>🛒 Cart Items: {item.cartItemCount}</Text>
        <Text style={styles.userStats}>❤️ Favorites: {item.favoritesCount}</Text>
      </View>
      {item.mode === 'user' && (
        <TouchableOpacity
          style={styles.assignManagerButton}
          onPress={() => assignManager(item.id)}
        >
          <Text style={styles.assignManagerButtonText}>Assign a Manager</Text>
        </TouchableOpacity>
      )}
      {item.mode === 'manager' && (
        <TouchableOpacity
          style={styles.relegateToUserButton}
          onPress={() => relegateToUser(item.id)}
        >
          <Text style={styles.relegateToUserButtonText}>Relegate</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.label}>User List</Text>
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            activeFilter === 'All' && styles.activeFilter,
          ]}
          onPress={() => handleFilterChange('All')}
        >
          <Text style={styles.filterText}>All Users</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            activeFilter === 'Manager' && styles.activeFilter,
          ]}
          onPress={() => handleFilterChange('Manager')}
        >
          <Text style={styles.filterText}>Manager Users</Text>
        </TouchableOpacity>
      </View>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    backgroundColor: '#f5f5f5',
  },
  label: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#007AFF',
  },
  listContainer: {
    paddingBottom: 16,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: 'rgba(0, 0, 0, 0.2)',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 2,
  },
  userIcon: {
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  userEmail: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  userStats: {
    marginTop: 4,
    fontSize: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  activeFilter: {
    backgroundColor: '#007AFF',
  },
  filterText: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  assignManagerButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginRight: 8,
  },
  assignManagerButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  relegateToUserButton: {
    backgroundColor: 'red',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginRight: 8,
  },
  relegateToUserButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default UsersTab;
