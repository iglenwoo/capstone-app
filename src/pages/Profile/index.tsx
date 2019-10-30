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
import { Ids } from './Ids'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginTop: theme.spacing(5),
      padding: theme.spacing(3, 2),
    },
  })
)

export interface Id {
  service: string
  value: string
}

const mockIds: Id[] = [
  { service: 'Github', value: 'github-id' },
  { service: 'Trello', value: 'trello-id' },
  { service: 'WhatsApp', value: 'whatsapp-id' },
]

export const Profile: FC = () => {
  const { user }: Auth = useAuth()

  const classes = useStyles()

  if (!user) {
    return <>Please sign in</>
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
      <Ids ids={mockIds} />
    </Container>
  )
}
