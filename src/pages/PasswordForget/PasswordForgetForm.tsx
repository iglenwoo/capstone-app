import * as React from 'react'
import { FC, useState } from 'react'
import {
  Avatar,
  Box,
  Button,
  Container,
  CssBaseline,
  makeStyles,
  TextField,
  Typography,
} from '@material-ui/core'
import { LockOutlined as LockOutlinedIcon } from '@material-ui/icons'
import Copyright from '../../components/Copyright'
import { AlertDialog } from '../../components/Dialog/AlertDialog'
import { Auth, useAuth } from '../../components/FirebaseAuth/use-auth'

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

export const PasswordForgetForm: FC = () => {
  const auth: Auth = useAuth()

  const [email, setEmail] = useState('')
  const [error, setError] = useState()
  const [showDialog, setShowDialog] = useState<boolean>(false)

  const classes = useStyles()

  const onSubmit = (event: any) => {
    event.preventDefault()

    auth
      .sendPasswordResetEmail(email)
      .then(() => {
        console.log('reset succeeded')
        //TODO: Notice to reset password
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
