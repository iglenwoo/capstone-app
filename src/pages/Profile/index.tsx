import * as React from 'react'
import { FC } from 'react'
import { Auth, useAuth } from '../../components/FirebaseAuth/use-auth'
import {
  Container,
  createStyles,
  makeStyles,
  Paper,
  Theme,
  Typography,
} from '@material-ui/core'

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

  return (
    <Container component="main" maxWidth="lg">
      <Paper className={classes.root}>
        <Typography gutterBottom variant="h5" component="h3">
          Profile
        </Typography>
        <Typography gutterBottom variant="h5" component="h5">
          Profile
        </Typography>
        <Typography gutterBottom component="p">
          Paper can be used to build surface or other elements for your
          application.
        </Typography>
      </Paper>
    </Container>
  )
}
