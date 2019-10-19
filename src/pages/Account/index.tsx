import * as React from 'react'
import { PasswordForgetForm } from '../PasswordForget/PasswordForgetForm'
import { PasswordChangeForm } from './PasswordChangeForm'
import { useAuth } from '../../components/FirebaseAuth/use-auth'

export const Account = () => {
  const auth = useAuth()

  return (
    <div>
      {auth.user && <h1>email: {auth.user.email}</h1>}
      <PasswordForgetForm />
      <PasswordChangeForm />
    </div>
  )
}
