import React, { FC, useState } from 'react'
import * as routes from '../../constants/routes'
import { auth } from '../../firebase'
import { Link } from 'react-router-dom'
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Container,
  CssBaseline,
  FormControlLabel,
  Grid,
  Link as LinkUI,
  makeStyles,
  TextField,
  Typography,
} from '@material-ui/core'
import LockOutlinedIcon from '@material-ui/core/SvgIcon/SvgIcon'
import Copyright from '../../components/Copyright'

const useStyles = makeStyles(theme => ({
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
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}))

export const SignInForm: FC<{
  history?: any
}> = props => {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [error, setError] = useState<string>()

  const classes = useStyles()

  // private static propKey(propertyName: string, value: any): object {
  //   return { [propertyName]: value }
  // }

  const onSubmit = (event: any) => {
    // const { email, password } = this.state
    //
    // const { history } = this.props
    //
    // auth
    //   .doSignInWithEmailAndPassword(email, password)
    //   .then(() => {
    //     this.setState(() => ({ ...SignInForm.INITIAL_STATE }))
    //     history.push(routes.HOME)
    //   })
    //   .catch(error => {
    //     this.setState(SignInForm.propKey('error', error))
    //   })

    event.preventDefault()
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form className={classes.form} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onSubmit={event => onSubmit(event)}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <LinkUI
                href="#"
                variant="body2"
                component={Link}
                to={routes.PASSWORD_FORGET}
              >
                Forgot password?
              </LinkUI>
            </Grid>
            <Grid item>
              <LinkUI
                href="#"
                variant="body2"
                component={Link}
                to={routes.SIGN_UP}
              >
                {"Don't have an account? Sign Up"}
              </LinkUI>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  )
}
