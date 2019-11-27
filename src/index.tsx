import React from 'react'
import ReactDOM from 'react-dom'
import CssBaseline from '@material-ui/core/CssBaseline'
import { ThemeProvider } from '@material-ui/styles'
import { App } from './components/App'
import theme from './theme'
import * as serviceWorker from './serviceWorker'
import { ProvideAuth } from './components/FirebaseAuth/use-auth'
import { SnackbarProvider } from 'notistack'

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <ProvideAuth>
      <SnackbarProvider
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        maxSnack={5}
      >
        <App />
      </SnackbarProvider>
    </ProvideAuth>
  </ThemeProvider>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
