import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { Container, Typography, Box } from '@material-ui/core'
import ProTip from './components/ProTip'
import Copyright from './components/Copyright'
import Dashboard from './pages/Dashboard'
import SignIn from './pages/SignIn'

export default function App() {
  return (
    <Router>
      <Container maxWidth="sm">
        <Box my={4}>
          <Typography variant="h4" component="h1" gutterBottom>
            Create React App v4-beta example with TypeScript
          </Typography>
          <ProTip />
          <Copyright />
        </Box>

        <Switch>
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/sign-in" component={SignIn} />
        </Switch>
      </Container>
    </Router>
  )
}
