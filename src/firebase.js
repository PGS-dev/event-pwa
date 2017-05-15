import * as firebase from 'firebase';
// Initialize Firebase
const firebaseConfig = {
  apiKey: 'AIzaSyCzPlXBWNmzh-p0R9xhXS4GAVRdyPUsIvc',
  authDomain: 'pgs-events-dev.firebaseapp.com',
  databaseURL: 'https://pgs-events-dev.firebaseio.com',
  projectId: 'pgs-events-dev',
  storageBucket: 'pgs-events-dev.appspot.com',
  messagingSenderId: '950810380947',
};
const firebaseApp = firebase.initializeApp(firebaseConfig);
export const db = firebaseApp.database();

export default firebaseApp;
