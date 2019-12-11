import red from '@material-ui/core/colors/red'
import {
  createMuiTheme,
  createStyles,
  makeStyles,
  Theme,
} from '@material-ui/core/styles'

export const outerTheme = createMuiTheme({
  palette: {
    primary: {
      main: '#d73f09',
    },
    secondary: {
      main: '#546e7a',
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#fff',
    },
  },
})
export const innerTheme = createMuiTheme({
  palette: {
    primary: {
      main: '#689F38',
    },
    secondary: {
      main: '#FFC107',
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#fff',
    },
  },
})

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    '@global': {
      body: {
        backgroundColor: theme.palette.common.white,
      },
    },
    paper: {
      marginTop: theme.spacing(8),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    avatarSignUp: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.secondary.main,
    },
    avatarSignIn: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.primary.main,
    },
    avatarForgotPW: {
      margin: theme.spacing(1),
      backgroundColor: 'red',
    },
    form: {
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing(3),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
  })
)
