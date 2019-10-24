import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  RouteProps,
  Redirect,
} from 'react-router-dom'
import * as routes from '../../constants/routes'
import { Landing } from '../../pages/Landing'
import { SignUp } from '../../pages/SignUp'
import { SignIn } from '../../pages/SignIn'
import { PasswordForget } from '../../pages/PasswordForget'
import { Home } from '../../pages/Home'
import { Account } from '../../pages/Account'
import { Auth, useAuth } from '../FirebaseAuth/use-auth'
import { TopBar } from './TopBar'

interface PrivateRouteProps extends RouteProps {
  component: any
}

const PrivateRoute = (props: PrivateRouteProps) => {
  const { component: Component, ...rest } = props
  const auth: Auth = useAuth()

  return (
    <Route
      {...rest}
      render={routeProps =>
        auth.user ? (
          <Component {...routeProps} />
        ) : (
          <Redirect
            to={{
              pathname: routes.SIGN_IN,
              state: { from: routeProps.location },
            }}
          />
        )
      }
    />
  )
}

export function App() {
  return (
    <Router>
      <div>
        <TopBar />
        <Switch>
          <Route exact={true} path={routes.LANDING} component={Landing} />
          <Route exact={true} path={routes.SIGN_UP} component={SignUp} />
          <Route exact={true} path={routes.SIGN_IN} component={SignIn} />
          <Route
            exact={true}
            path={routes.PASSWORD_FORGET}
            component={PasswordForget}
          />
          <PrivateRoute exact={true} path={routes.HOME} component={Home} />
          <PrivateRoute
            exact={true}
            path={routes.ACCOUNT}
            component={Account}
          />
        </Switch>
      </div>
    </Router>
  )
}
