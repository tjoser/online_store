import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';


// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDYY8mKqrrcaQVpgGX7HIvE2W41efQuFlc",
    authDomain: "cz-london-store-99504.firebaseapp.com",
    projectId: "cz-london-store-99504",
    storageBucket: "cz-london-store-99504.appspot.com",
    messagingSenderId: "208898807485",
    appId: "1:208898807485:web:0692dd0f44a1e36dcd49d4"
};

// Initialize Firebase
let app;
if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig);
  firebase.firestore();

} else {
  app = firebase.app()
}

const auth = firebase.auth()

export { auth, firebase };