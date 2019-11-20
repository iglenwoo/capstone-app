import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  RouteProps,
  Redirect,
} from 'react-router-dom'
import * as routes from '../../constants/routes'
import { Auth, useAuth } from '../FirebaseAuth/use-auth'
import { TopBar } from './TopBar'
import { SignUp } from '../../pages/SignUp'
import { SignIn } from '../../pages/SignIn'
import { PasswordForget } from '../../pages/PasswordForget'
import { Landing } from '../../pages/Landing'
import { Profile } from '../../pages/Profile'
import { Projects } from '../../pages/Projects'
import { MyProjects } from '../../pages/MyProjects'
import { Account } from '../../pages/Account'
import { Project } from '../../pages/Projects/Project'

interface PrivateRouteProps extends RouteProps {
  component: any
}

export function App() {
  return (
    <Router>
      <div>
        <TopBar />
        <Switch>
          <Route exact path={routes.SIGN_UP} component={SignUp} />
          <Route exact path={routes.SIGN_IN} component={SignIn} />
          <Route
            exact
            path={routes.PASSWORD_FORGET}
            component={PasswordForget}
          />
          <PrivateRoute exact path={routes.LANDING} component={Landing} />
          <PrivateRoute exact path={routes.PROFILE} component={Profile} />
          <PrivateRoute exact path={routes.PROJECTS} component={Projects} />
          <PrivateRoute
            exact
            path={`${routes.PROJECTS}/:code`}
            component={Project}
          />
          <PrivateRoute
            exact
            path={routes.MY_PROJECTS}
            component={MyProjects}
          />
          <PrivateRoute exact path={routes.ACCOUNT} component={Account} />
        </Switch>
      </div>
    </Router>
  )
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
