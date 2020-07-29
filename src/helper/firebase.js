import firebase from 'firebase'

var firebaseConfig = {
  apiKey: "AIzaSyCaLpm3TFnF0KuStCkf1kpBuCgxG-M2TVQ",
  authDomain: "chatoo-3a0f2.firebaseapp.com",
  databaseURL: "https://chatoo-3a0f2.firebaseio.com",
  projectId: "chatoo-3a0f2",
  storageBucket: "chatoo-3a0f2.appspot.com",
  messagingSenderId: "103686911850",
  appId: "1:103686911850:web:fe119144c6110fb35cd713"
};

export default firebase.initializeApp(firebaseConfig)
