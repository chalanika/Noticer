import * as firebase from "firebase";

var firebaseConfig = {
  apiKey: "AIzaSyC13ltbiXQJgxGBAubq3Ayv8JM727GpTP0",
  authDomain: "noticer-462f2.firebaseapp.com",
  databaseURL: "https://noticer-462f2.firebaseio.com",
  projectId: "noticer-462f2",
  storageBucket: "noticer-462f2.appspot.com",
  messagingSenderId: "816457671012",
  appId: "1:816457671012:web:6c75675107ac4acaaeda71",
  measurementId: "G-M87GMGY8SK",
};

firebase.initializeApp(firebaseConfig);

export default firebase;
