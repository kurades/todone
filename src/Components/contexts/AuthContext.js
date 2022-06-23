import React, { createContext, useContext, useEffect, useState } from 'react'
import { auth } from '../../firebase'
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth'

const AuthContext = createContext()

export function useAuth() {
    return useContext(AuthContext)
}

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState()
    const [loading, setLoading] = useState(true)
    const signup = (name, email, password) =>{
        // updateProfile()
        createUserWithEmailAndPassword(auth, email, password)
        .then(userCredential =>{
            const user = userCredential.user
            updateProfile(user,{
                displayName : name,
            })
            return user
        })
    }
    const login = (email,password) =>{
        return signInWithEmailAndPassword(auth,email,password)
    }

    const logout = () =>{
        return signOut(auth)
    }

    useEffect(() => {
        const unSubscribe = onAuthStateChanged(auth, user => {
            setCurrentUser(user)
            setLoading(false)
        })

        return unSubscribe
    },[])

    const value = {
        currentUser,
        signup,
        login,
        logout,
    }
    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}
