import * as React from 'react'
import { Auth, useAuth } from '../../components/FirebaseAuth/use-auth'
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  createStyles,
  makeStyles,
  TextField,
  Theme,
} from '@material-ui/core'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      marginTop: theme.spacing(5),
      padding: theme.spacing(3, 2),
    },
    fieldContainer: {
      display: 'flex',
      justifyContext: 'center',
      alignItems: 'center',
    },
  })
)

export const Projects = () => {
  const { user }: Auth = useAuth()

  const classes = useStyles()

  return (
    <Container component="main" maxWidth="lg">
      <Card className={classes.card}>
        <CardContent>
          <Box className={classes.fieldContainer}>
            <Box flexGrow={2} mx={1}>
              <TextField
                id="project-title"
                label="Project Title"
                margin="dense"
                variant="outlined"
                fullWidth
              />
            </Box>
            <Box flexGrow={1} mx={1}>
              <Button variant="contained" color="primary" fullWidth>
                Create Project
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Container>
  )
}
