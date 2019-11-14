import * as React from 'react'
import { FC } from 'react'
import { Redirect } from 'react-router-dom'
import { Auth, useAuth } from '../../components/FirebaseAuth/use-auth'
import {
  Container,
  createStyles,
  makeStyles,
  Paper,
  Theme,
  Typography,
} from '@material-ui/core'
import { Ids } from './Ids'
import { Skills } from './Skills'
import { SIGN_IN } from '../../constants/routes'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginTop: theme.spacing(5),
      padding: theme.spacing(3, 2),
    },
  })
)

export const Profile: FC = () => {
  const { user }: Auth = useAuth()

  const classes = useStyles()

  if (user === null) {
    return <Redirect to={SIGN_IN} />
  }

  return (
    <Container component="main" maxWidth="lg">
      <Paper className={classes.root}>
        <Typography gutterBottom variant="h5" component="h3">
          Profile
        </Typography>
        <Typography gutterBottom variant="h5" component="h5">
          Email: {user.email}
        </Typography>
      </Paper>
      <Ids />
      <Skills />
    </Container>
  )
}
