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
import { Account } from '../../pages/Account'
import { ProjectPage } from '../../pages/Project'
import { LinearProgress, ThemeProvider, withStyles } from '@material-ui/core'
import { innerTheme } from '../../theme'

export function App() {
  return (
    <Router>
      <div>
        <TopBar />
        <ThemeProvider theme={innerTheme}>
          <Switch>
            <GuestRoute exact path={routes.SIGN_UP} component={SignUp} />
            <GuestRoute exact path={routes.SIGN_IN} component={SignIn} />
            <GuestRoute
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
              component={ProjectPage}
            />
            <PrivateRoute exact path={routes.ACCOUNT} component={Account} />
          </Switch>
        </ThemeProvider>
      </div>
    </Router>
  )
}

const ColorLinearProgress = withStyles({
  colorPrimary: {
    backgroundColor: '#FFC107',
  },
  barColorPrimary: {
    backgroundColor: '#689F38',
  },
})(LinearProgress)

interface GuestRouteProps extends RouteProps {
  component: any
}

const GuestRoute = (props: GuestRouteProps) => {
  const { isLoading, user } = useAuth()
  const { component: Component, ...rest } = props

  return (
    <Route
      {...rest}
      render={routeProps => {
        if (isLoading) return <ColorLinearProgress variant="buffer" />
        return user ? (
          <Redirect to={routes.PROJECTS} />
        ) : (
          <Component {...routeProps} />
        )
      }}
    />
  )
}

interface PrivateRouteProps extends RouteProps {
  component: any
}

const PrivateRoute = (props: PrivateRouteProps) => {
  const { component: Component, path, ...rest } = props
  const { isLoading, user }: Auth = useAuth()

  return (
    <Route
      {...rest}
      render={routeProps => {
        if (isLoading) return <ColorLinearProgress />
        return user ? (
          path &&
          [routes.SIGN_IN, routes.SIGN_UP, routes.LANDING].includes(
            path as string
          ) ? (
            <Redirect
              to={{
                pathname: routes.PROJECTS,
                state: { from: routeProps.location },
              }}
            />
          ) : (
            <Component {...routeProps} />
          )
        ) : (
          <Redirect
            to={{
              pathname: routes.SIGN_IN,
              state: { from: routeProps.location },
            }}
          />
        )
      }}
    />
  )
}
