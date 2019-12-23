import React, {
  useState,
  useEffect,
  useContext,
  createContext,
  FC,
} from 'react'
import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'
import 'firebase/functions'
import { config } from './config'

// Add your Firebase credentials
firebase.initializeApp(config)
const firestore: firebase.firestore.Firestore = firebase.firestore()
const storage: firebase.storage.Storage = firebase.storage()
const functions: firebase.functions.Functions = firebase.functions()

export interface Auth {
  firestore: firebase.firestore.Firestore
  storage: firebase.storage.Storage
  functions: firebase.functions.Functions
  isLoading: boolean
  user: firebase.User | null
  signin: (
    email: string,
    password: string,
    shouldPersist: boolean
  ) => Promise<firebase.User | null>
  signup: (email: string, password: string) => Promise<firebase.User | null>
  signout: () => void
  sendPasswordResetEmail: (email: string) => Promise<boolean>
  confirmPasswordReset: (code: string, password: string) => Promise<boolean>
}

const authContext = createContext<Auth>({
  firestore,
  storage,
  functions,
  isLoading: true,
  user: null,
  signin: (email: string, password: string, shouldPersist: boolean) =>
    Promise.resolve(null),
  signup: (email: string, password: string) => Promise.resolve(null),
  signout: () => undefined,
  sendPasswordResetEmail: (email: string) => Promise.resolve(false),
  confirmPasswordReset: (code: string, password: string) =>
    Promise.resolve(false),
})

// Provider component that wraps your app and makes auth object ...
// ... available to any child component that calls useAuth().
export const ProvideAuth: FC = ({ children }) => {
  const auth: Auth = useProvideAuth()
  return <authContext.Provider value={auth}>{children}</authContext.Provider>
}

// Hook for child components to get the auth object ...
// ... and re-render when it changes.
export const useAuth = () => {
  return useContext(authContext)
}

// Provider hook that creates auth object and handles state
function useProvideAuth(): Auth {
  const [user, setUser] = useState<firebase.User | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  // Wrap any Firebase methods we want to use making sure ...
  // ... to save the user to state.
  const signin = (
    email: string,
    password: string,
    shouldPersist: boolean
  ): Promise<firebase.User | null> => {
    const persistence = shouldPersist
      ? firebase.auth.Auth.Persistence.LOCAL
      : firebase.auth.Auth.Persistence.SESSION
    return firebase
      .auth()
      .setPersistence(persistence)
      .then(() => {
        return firebase.auth().signInWithEmailAndPassword(email, password)
      })
      .then(response => {
        setUser(response.user)
        return response.user
      })
  }

  const signup = (
    email: string,
    password: string
  ): Promise<firebase.User | null> => {
    return firebase
      .auth()
      .setPersistence(firebase.auth.Auth.Persistence.SESSION)
      .then(() => {
        return firebase.auth().createUserWithEmailAndPassword(email, password)
      })
      .then(response => {
        setUser(response.user)
        return response.user
      })
  }

  const signout = () => {
    return firebase
      .auth()
      .signOut()
      .then(() => {
        setUser(null)
      })
  }

  const sendPasswordResetEmail = (email: string) => {
    return firebase
      .auth()
      .sendPasswordResetEmail(email)
      .then(() => {
        return true
      })
  }

  const confirmPasswordReset = (code: string, password: string) => {
    return firebase
      .auth()
      .confirmPasswordReset(code, password)
      .then(() => {
        return true
      })
  }

  // Subscribe to user on mount
  // Because this sets state in the callback it will cause any ...
  // ... component that utilizes this hook to re-render with the ...
  // ... latest auth object.
  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(user => {
      setUser(user ? user : null)
      setIsLoading(false)
    })

    // Cleanup subscription on unmount
    return () => unsubscribe()
  }, [])

  // Return the user object and auth methods
  return {
    firestore,
    storage,
    functions,
    isLoading,
    user,
    signin,
    signup,
    signout,
    sendPasswordResetEmail,
    confirmPasswordReset,
  }
}
