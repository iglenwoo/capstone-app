import { useEffect, useState } from 'react'
import firebase from 'firebase'

interface AuthState {
  isLoading: boolean
  user: firebase.User | null
}

export const useAuth = (auth: firebase.auth.Auth) => {
  const [authState, setState] = useState<AuthState>({
    isLoading: true,
    user: null,
  })

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(authState =>
      setState({ isLoading: false, user: authState })
    )
    return unsubscribe
  }, [auth])
  return authState
}
