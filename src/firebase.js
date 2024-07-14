// firebase.js
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyBOxH0963OW9bp7Yd5V0PQoARpyqPmatmo",
    authDomain: "recipe-blog-ae8f6.firebaseapp.com",
    projectId: "recipe-blog-ae8f6",
    storageBucket: "recipe-blog-ae8f6.appspot.com",
    messagingSenderId: "716716022951",
    appId: "1:716716022951:web:c189e346d0406afaa6cf82",
    measurementId: "G-1XFNVQB03L"
  };

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };
