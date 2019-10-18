import * as React from 'react'
import { UserList } from './UserList'
import { Auth, useAuth } from '../../components/FirebaseAuth/use-auth'

interface User {
  email: string
  username: string
}

export const Home = () => {
  const { user }: Auth = useAuth()

  return (
    <div>
      <h2>Home Page</h2>
      <p>The Home Page is accessible by every signed in user.</p>

      {/*{!!users && <UserList users={users} />}*/}
    </div>
  )
}
