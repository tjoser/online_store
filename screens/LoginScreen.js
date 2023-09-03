import { useNavigation } from '@react-navigation/core';
import React, { useEffect, useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { firebase, auth } from '../firebase';
import LogoImage from '../assets/cz-london-logo.png';

const Logo_Image = Image.resolveAssetSource(LogoImage).uri;

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigation.replace('Home');
      }
    });

    return unsubscribe;
  }, []);

  const handleSignUp = () => {
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((userCredentials) => {
        const user = userCredentials.user;

        console.log('Registered with:', user.email);

        firebase
          .firestore()
          .collection('users')
          .doc(user?.email)
          .set({
            email: email,
            id: user?.uid,
            mode: 'user',
            fav: null,
            cart: null,
          });
      })
      .catch((error) => alert(error.message));
  };

  const handleLogin = () => {
    auth
      .signInWithEmailAndPassword(email, password)
      .then((userCredentials) => {
        const user = userCredentials.user;
        console.log('Logged in with:', user.email);
      })
      .catch((error) => alert(error.message));
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <Image
        style={{
          resizeMode: 'contain',
          height: 100,
          width: 200,
          marginBottom: 20,
        }}
        source={{ uri: Logo_Image }}
      />

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={(text) => setEmail(text)}
          style={styles.input}
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={(text) => setPassword(text)}
          style={styles.input}
          secureTextEntry
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleLogin} style={styles.button}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleSignUp}
          style={[styles.button, styles.buttonOutline]}
        >
          <Text style={styles.buttonOutlineText}>Register</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.socialMediaContainer}>
        <Text style={styles.socialMediaText}>Follow us on Instagram:</Text>
        <TouchableOpacity
          onPress={() => {
            Linking.openURL('https://www.instagram.com/czlondon/');
          }}
        >
          <Text style={styles.socialMediaLink}>@czlondon</Text>
        </TouchableOpacity>
        <Text style={styles.contactText}>Call center: 0850 399 10 04</Text>
        <Text style={styles.contactText}>Email: info@czlondon.com</Text>
      </View>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  inputContainer: {
    width: '80%',
  },
  input: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonContainer: {
    width: '60%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  button: {
    backgroundColor: '#0782F9',
    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonOutline: {
    backgroundColor: 'white',
    marginTop: 10,
    borderColor: '#0782F9',
    borderWidth: 2,
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
  buttonOutlineText: {
    color: '#0782F9',
    fontWeight: '700',
    fontSize: 16,
  },
  socialMediaContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  socialMediaText: {
    fontSize: 16,
    marginBottom: 5,
  },
  socialMediaLink: {
    fontSize: 16,
    color: '#0782F9',
    textDecorationLine: 'underline',
  },
  contactText: {
    fontSize: 16,
    marginTop: 5,
  },
});
