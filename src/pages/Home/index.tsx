import * as React from 'react'
import { Auth, useAuth } from '../../components/FirebaseAuth/use-auth'

export const Home = () => {
  const { user }: Auth = useAuth()

  return (
    <div>
      <h2>Home Page</h2>
      {user && <p>user.email: {user.email}</p>}
    </div>
  )
}
