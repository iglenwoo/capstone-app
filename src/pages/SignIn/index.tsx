import * as React from 'react'
import { PasswordForgetLink } from '../PasswordForget'
import { SignUpLink } from '../SignUp'
import { SignInForm } from './SignInForm'

export const SignIn = ({ history }: { [key: string]: any }) => (
  <div>
    <h1>SignIn</h1>
    <SignInForm history={history} />
    <SignUpLink />
    <PasswordForgetLink />
  </div>
)
