import firebase from 'firebase';
// Initialize Firebase
const firebaseConfig = {
  apiKey: 'AIzaSyB34nvuC5VNLtxIjsSwhp4uUmdHJv7g5jE',
  authDomain: 'pgs-events-prod.firebaseapp.com',
  databaseURL: 'https://pgs-events-prod.firebaseio.com',
  projectId: 'pgs-events-prod',
  storageBucket: 'pgs-events-prod.appspot.com',
  messagingSenderId: '883519782377',
};
const firebaseApp = firebase.initializeApp(firebaseConfig);
export const db = firebaseApp.database();

// Retrieve Firebase Messaging object.
export const messaging = firebase.messaging();

export default firebaseApp;
