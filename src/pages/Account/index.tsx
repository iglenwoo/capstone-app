import * as React from 'react'
import { FC, SyntheticEvent, useState } from 'react'
import { useAuth } from '../../components/FirebaseAuth/use-auth'
import { SignOut } from './SingOut'
import {
  Box,
  Button,
  Container,
  CssBaseline,
  Grid,
  TextField,
  Typography,
} from '@material-ui/core'
import Copyright from '../../components/Copyright'
import { useStyles } from '../../theme'

export const Account: FC = () => {
  const auth = useAuth()

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState()

  const onSubmit = (event: SyntheticEvent) => {
    event.preventDefault()
  }

  const classes = useStyles()

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        {auth.user && (
          <Typography component="h3" variant="h4">
            email: {auth.user.email}
          </Typography>
        )}
        <form className={classes.form} noValidate onSubmit={e => onSubmit(e)}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="New Password"
                name="New Password"
                autoComplete="new-password"
                autoFocus
                value={newPassword}
                onChange={e => setNewPassword(e.currentTarget.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Confirm Password"
                type="Confirm Password"
                id="Confirm Password"
                autoComplete="confirm-password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.currentTarget.value)}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Reset My Password
          </Button>
          <SignOut />
        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>

      {error && <p>{error.message}</p>}
    </Container>
  )
}
