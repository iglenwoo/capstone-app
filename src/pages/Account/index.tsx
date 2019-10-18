import * as React from 'react'
import { PasswordForgetForm } from '../PasswordForget/PasswordForgetForm'
import { PasswordChangeForm } from './PasswordChangeForm'
import { useAuth } from '../../components/FirebaseAuth/use-auth'

export const AccountComponent = () => {
  const auth = useAuth()

  return (
    <div>
      <h1>Account: {auth.user}</h1>
      {/*<PasswordForgetForm />*/}
      {/*<PasswordChangeForm />*/}
    </div>
  )
}
