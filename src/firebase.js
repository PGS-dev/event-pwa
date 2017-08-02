import * as firebase from 'firebase';
// Initialize Firebase
const firebaseConfig = {
  apiKey: 'AIzaSyCgcyA42Z0YZglbeVmkQArwKFxblOQPboA',
  authDomain: 'pgs-events.firebaseapp.com',
  databaseURL: 'https://pgs-events.firebaseio.com',
  projectId: 'pgs-events',
  storageBucket: 'pgs-events.appspot.com',
  messagingSenderId: '698328666123',
};
const firebaseApp = firebase.initializeApp(firebaseConfig);
export const db = firebaseApp.database();

// Retrieve Firebase Messaging object.
export const messaging = firebase.messaging();

export default firebaseApp;
