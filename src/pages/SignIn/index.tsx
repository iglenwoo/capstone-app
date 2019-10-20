import * as React from 'react'
import { PasswordForgetLink } from '../PasswordForget'
import { SignUpLink } from '../SignUp'
import { SignInForm } from './SignInForm'

export const SignIn = () => (
  <div>
    <SignInForm />
    <SignUpLink />
    <PasswordForgetLink />
  </div>
)
