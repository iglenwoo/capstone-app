import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import * as routes from '../../constants/routes'
import { firebase } from '../../firebase'
// import SignIn from '../../pages/SignIn'
import { Navigation } from './Navigation'
import { Landing } from '../../pages/Landing'
import { SignUp } from '../../pages/SignUp'
import { SignIn } from '../../pages/SignIn'
import { PasswordForget } from '../../pages/PasswordForget'
import { Home } from '../../pages/Home'
import { Account } from '../../pages/Account'
import { withAuthentication } from '../../firebase/withAuthentication'

class AppComponent extends React.Component {
  constructor(props: any) {
    super(props)

    this.state = {
      authUser: null,
    }
  }

  public componentDidMount() {
    firebase.auth.onAuthStateChanged(authUser => {
      authUser
        ? this.setState(() => ({ authUser }))
        : this.setState(() => ({ authUser: null }))
    })
  }

  public render() {
    return (
      <Router>
        <div>
          <Navigation />
          <hr />
          <Switch>
            <Route exact={true} path={routes.LANDING} component={Landing} />
            <Route exact={true} path={routes.SIGN_UP} component={SignUp} />
            <Route exact={true} path={routes.SIGN_IN} component={SignIn} />
            <Route
              exact={true}
              path={routes.PASSWORD_FORGET}
              component={PasswordForget}
            />
            <Route exact={true} path={routes.HOME} component={Home} />
            <Route exact={true} path={routes.ACCOUNT} component={Account} />
          </Switch>
        </div>
      </Router>
    )
  }
}

export const App = withAuthentication(AppComponent)
