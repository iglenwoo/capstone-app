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
            <Box flexGrow={1} mx={1}>
              <TextField
                id="project-title"
                label="Project Title"
                placeholder="Capstone Project"
                helperText="Project full name"
                margin="dense"
                variant="outlined"
                fullWidth
              />
            </Box>
            <Box flexGrow={1} mx={1}>
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
          </Box>
          <Button variant="contained" color="primary" fullWidth>
            Create Project
          </Button>
        </CardContent>
      </Card>
    </Container>
  )
}
