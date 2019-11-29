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
import { LockOutlined as LockOutlinedIcon } from '@material-ui/icons'
import Copyright from '../../components/Copyright'
import { AlertDialog } from '../../components/Dialog/AlertDialog'
import { useStyles } from '../../theme'
import { useSnackbar } from 'notistack'

export const PasswordForget: FC = () => {
  const auth: Auth = useAuth()
  const { enqueueSnackbar } = useSnackbar()

  const [email, setEmail] = useState('')
  const [error, setError] = useState()
  const [showDialog, setShowDialog] = useState<boolean>(false)

  const classes = useStyles()

  const onSubmit = (event: any) => {
    auth
      .sendPasswordResetEmail(email)
      .then(() => {
        enqueueSnackbar('Password reset succeeded', { variant: 'success' })
      })
      .catch(error => {
        setError(error.message)
        setShowDialog(true)
      })

    event.preventDefault()
  }

  const onDialogClose = () => {
    setError('')
    setShowDialog(false)
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
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
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={e => setEmail(e.currentTarget.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
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
