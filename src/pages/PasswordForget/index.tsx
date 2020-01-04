import * as React from 'react'
import { FC } from 'react'
import { Auth, useAuth } from '../../components/FirebaseAuth/use-auth'
import { useState } from 'react'
import {
  Avatar,
  Box,
  Button,
  Container,
  CssBaseline,
  TextField,
  Typography,
} from '@material-ui/core'
import { LockOpenOutlined as LockOpenOutlinedIcon } from '@material-ui/icons'
import Copyright from '../../components/Copyright'
import { AlertDialog } from '../../components/Dialog/AlertDialog'
import { useStyles } from '../../theme'
import { useSnackbar } from 'notistack'
import { SyntheticEvent } from 'react'
import { useEffect } from 'react'
import { validateEmail } from '../../utils'
import { useHistory } from 'react-router'
import * as routes from '../../constants/routes'

export const PasswordForget: FC = () => {
  const classes = useStyles()
  const auth: Auth = useAuth()
  const { enqueueSnackbar } = useSnackbar()
  const history = useHistory()

  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState<boolean>(true)
  const [emailHelperText, setEmailHelperText] = useState<string>('')
  const [error, setError] = useState()
  const [showDialog, setShowDialog] = useState<boolean>(false)

  useEffect(() => {
    if (validateEmail(email)) {
      setEmailHelperText('')
      setEmailError(false)
    } else {
      setEmailHelperText('Please enter a valid email.')
      setEmailError(true)
    }
  }, [email])

  const onSubmit = (e: SyntheticEvent) => {
    e.preventDefault()
    if (emailError) return

    auth
      .sendPasswordResetEmail(email)
      .then(() => {
        enqueueSnackbar(
          "We've sent a password reset link!  You will be redirected to Sign In page in 5 seconds...",
          {
            variant: 'success',
          }
        )
        setEmail('')
        setTimeout(() => {
          history.push(routes.SIGN_IN)
        }, 5000)
      })
      .catch(error => {
        setError(error.message)
        setShowDialog(true)
      })
  }

  const onDialogClose = () => {
    setError('')
    setShowDialog(false)
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatarForgotPW}>
          <LockOpenOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Password Forget
        </Typography>

        <form
          className={classes.form}
          noValidate
          onSubmit={event => onSubmit(event)}
        >
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Email Address"
            autoFocus
            value={email}
            onChange={e => setEmail(e.currentTarget.value)}
            error={emailError}
            helperText={emailHelperText}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            disabled={emailError}
          >
            Reset My Password
          </Button>
        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>

      <AlertDialog open={showDialog} message={error} onClose={onDialogClose} />
    </Container>
  )
}
