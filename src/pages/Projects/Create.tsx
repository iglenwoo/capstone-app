import {
  Box,
  Button,
  Card,
  CardContent,
  createStyles,
  makeStyles,
  TextField,
  Theme,
} from '@material-ui/core'
import * as React from 'react'
import { useState } from 'react'
import { SyntheticEvent } from 'react'
import { Auth, useAuth } from '../../components/FirebaseAuth/use-auth'
import * as firebase from 'firebase/app'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      marginTop: theme.spacing(2),
    },
    fieldContainer: {
      display: 'flex',
      justifyContext: 'center',
      alignItems: 'top',
      flexWrap: 'wrap',
    },
    button: {
      minWidth: 150,
      marginLeft: theme.spacing(1),
    },
  })
)

interface Project {
  code: string
  password: string
  title: string
  owner: string
}

const INIT_PROJECT: Project = {
  code: '',
  password: '',
  title: '',
  owner: '',
}

export const Create = () => {
  const { user, firestore }: Auth = useAuth()
  const [project, setProject] = useState<Project>({ ...INIT_PROJECT })

  const handleCreateClick = (e: SyntheticEvent) => {
    e.preventDefault()

    if (user === null) return

    const projectRef = firestore.collection('projects').doc()
    const userRef = firestore.collection('users').doc(user.uid)
    firestore
      .runTransaction(transaction => {
        return transaction.get(userRef).then(doc => {
          console.log(doc)
          transaction.update(userRef, {
            projects: firebase.firestore.FieldValue.arrayUnion(projectRef.id),
          })
          transaction.set(projectRef, { ...project, owner: user.uid })
        })
      })
      .then(() => {
        console.log('What? ')
        setProject({ ...INIT_PROJECT })
      })
      .catch(error => {
        console.log('Error adding document:', error)
      })
  }

  const classes = useStyles()

  return (
    <Card className={classes.card}>
      <CardContent>
        <Box className={classes.fieldContainer} mb={2}>
          <Box flexGrow={2} mx={1}>
            <TextField
              label="Project Code"
              placeholder="Capstone-Project"
              helperText="Project Unique code (no white spaces)"
              margin="dense"
              variant="outlined"
              fullWidth
              value={project.code}
              onChange={e =>
                setProject({ ...project, code: e.currentTarget.value })
              }
            />
          </Box>
          <Box flexGrow={2} mx={1}>
            <TextField
              label="Password"
              type="password"
              helperText="Password (no white spaces, at least 8 characters)"
              margin="dense"
              variant="outlined"
              fullWidth
              value={project.password}
              onChange={e =>
                setProject({ ...project, password: e.currentTarget.value })
              }
            />
          </Box>
          <Box mx={1} pt={1}>
            <Button
              variant="contained"
              color="secondary"
              className={classes.button}
              onClick={handleCreateClick}
            >
              Create
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}
