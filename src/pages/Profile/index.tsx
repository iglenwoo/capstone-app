import * as React from 'react'
import { Auth, useAuth } from '../../components/FirebaseAuth/use-auth'

export const Profile = () => {
  const { user }: Auth = useAuth()

  return (
    <div>
      <h2>Profile Page</h2>
      {user && <p>user.email: {user.email}</p>}
    </div>
  )
}
