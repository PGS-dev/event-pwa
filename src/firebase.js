import firebase from 'firebase';
// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBAG2m7zw1uy7h1ofe4wJ4H6BpNiYvuU_o",
  authDomain: "pgs-events-development.firebaseapp.com",
  databaseURL: "https://pgs-events-development.firebaseio.com",
  projectId: "pgs-events-development",
  storageBucket: "pgs-events-development.appspot.com",
  messagingSenderId: "744706910081"
};
const firebaseApp = firebase.initializeApp(firebaseConfig);
export const db = firebaseApp.database();

// Retrieve Firebase Messaging object.
export const messaging = firebase.messaging();

export default firebaseApp;
