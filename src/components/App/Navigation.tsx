import * as React from 'react'
import { Link } from 'react-router-dom'
import * as routes from '../../constants/routes'
import { useAuth } from '../FirebaseAuth/use-auth'

export const Navigation = () => {
  const auth = useAuth()

  return <>{auth.user ? <NavigationAuth /> : <NavigationNonAuth />}</>
}

const NavigationAuth = () => (
  <ul>
    <li>
      <Link to={routes.HOME}>Home</Link>
    </li>
    <li>
      <Link to={routes.ACCOUNT}>Account</Link>
    </li>
  </ul>
)

const NavigationNonAuth = () => (
  <ul>
    <li>
      <Link to={routes.LANDING}>Landing</Link>
    </li>
    <li>
      <Link to={routes.SIGN_IN}>Sign In</Link>
    </li>
    <li>
      <Link to={routes.PASSWORD_FORGET}>Password Forget</Link>
    </li>
    <li>
      <Link to={routes.SIGN_UP}>Sign Up</Link>
    </li>
  </ul>
)
