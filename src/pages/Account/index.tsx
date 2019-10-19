import * as React from 'react'
import { PasswordChangeForm } from './PasswordChangeForm'
import { useAuth } from '../../components/FirebaseAuth/use-auth'
import { SignOut } from './SingOut'

export const Account = () => {
  const auth = useAuth()

  return (
    <div>
      {auth.user && <h1>email: {auth.user.email}</h1>}
      <PasswordChangeForm />
      <SignOut />
    </div>
  )
}
