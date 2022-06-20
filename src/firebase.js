import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth";

export const apiKey = "AIzaSyAowvXZHWJl3QEj75YWvvkVIs6UYSE1IOI"
export const authDomain= "todone-7f022.firebaseapp.com"
export const projectId= "todone-7f022"
export const storageBucket= "todone-7f022.appspot.com"
export const messagingSenderId= "770116022655"
export const appId= "1:770116022655:web:874adaae79858b6a19aa4a"
export const measurementId= "G-B1LWMSYTG4"
export const databaseURL = 'https://todone-7f022-default-rtdb.asia-southeast1.firebasedatabase.app'

export const App = initializeApp({
    apiKey,
    authDomain,
    projectId,
    storageBucket,
    messagingSenderId,
    appId,
    measurementId,
    databaseURL
})

export const auth = getAuth(App)