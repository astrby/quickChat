import { initializeApp } from "firebase/app";
import {getStorage} from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyAKOqijr_OmCxuDkyxO7yEjaUAZ6wHsYNg",
  authDomain: "quickchat-3b07a.firebaseapp.com",
  projectId: "quickchat-3b07a",
  storageBucket: "quickchat-3b07a.appspot.com",
  messagingSenderId: "1008105487522",
  appId: "1:1008105487522:web:68f92a69ee53e977efabfb"
};

const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);