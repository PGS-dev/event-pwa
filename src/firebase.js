import firebase from 'firebase';
// Initialize Firebase
const firebaseConfig = {
  apiKey: 'AIzaSyB6kCe0Z9poQL2u8inGvXYxy7e60QpXbdw',
  authDomain: 'pgs-events-dev-8fd6f.firebaseapp.com',
  databaseURL: 'https://pgs-events-dev-8fd6f.firebaseio.com',
  projectId: 'pgs-events-dev-8fd6f',
  storageBucket: 'pgs-events-dev-8fd6f.appspot.com',
  messagingSenderId: '521479899526',
};
const firebaseApp = firebase.initializeApp(firebaseConfig);
export const db = firebaseApp.database();

// Retrieve Firebase Messaging object.
export const messaging = firebase.messaging();

export default firebaseApp;
