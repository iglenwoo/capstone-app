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
      alignItems: 'top',
      flexWrap: 'wrap',
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
          <Box className={classes.fieldContainer} mb={2}>
            <Box flexGrow={7} mx={1}>
              <TextField
                id="project-code"
                label="Project Code"
                placeholder="Capstone-Project"
                helperText="Project Unique code (no white spaces)"
                margin="dense"
                variant="outlined"
                fullWidth
              />
            </Box>
            <Box flexGrow={1} mx={1} pt={1}>
              <Button variant="contained" color="secondary" fullWidth>
                Create
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
      <Card className={classes.card}>
        <CardContent>
          <Box className={classes.fieldContainer} mb={2}>
            <Box flexGrow={2} mx={1}>
              <TextField
                id="project-code"
                label="Project Code"
                placeholder="Capstone-Project"
                helperText="Project Unique code (no white spaces)"
                margin="dense"
                variant="outlined"
                fullWidth
              />
            </Box>
            <Box flexGrow={2} mx={1}>
              <TextField
                id="project-password"
                label="Password"
                type="password"
                helperText="Password (no white spaces, at least 8 characters)"
                margin="dense"
                variant="outlined"
                fullWidth
              />
            </Box>
            <Box flexGrow={1} mx={1} pt={1}>
              <Button variant="contained" color="primary" fullWidth>
                Join
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Container>
  )
}
