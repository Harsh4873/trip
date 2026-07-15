import { getApp, getApps, initializeApp } from "firebase/app";
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from "firebase/firestore";

const firebaseConfig = {
  projectId: "harsh-trip-2026",
  appId: "1:378105846844:web:3689cb50e397361c373739",
  storageBucket: "harsh-trip-2026.firebasestorage.app",
  apiKey: "AIzaSyDvI6-FyxJZ8HAkUDTeX4jv9kQNVT2HOcY",
  authDomain: "harsh-trip-2026.firebaseapp.com",
  messagingSenderId: "378105846844",
};

const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const tripDb = initializeFirestore(firebaseApp, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager(),
  }),
});
