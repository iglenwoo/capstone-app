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
import 'firebase/firestore'
import { useHistory } from 'react-router'
import * as routes from '../../constants/routes'

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
  owner: string
}

const INIT_PROJECT: Project = {
  code: '',
  owner: '',
}

export const Create = () => {
  const { user, firestore }: Auth = useAuth()
  const history = useHistory()
  const [project, setProject] = useState<Project>({ ...INIT_PROJECT })

  const handleCreateClick = (e: SyntheticEvent) => {
    if (!user) return

    const projectRef = firestore.collection('projects').doc(project.code)
    const userRef = firestore.collection('users').doc(user.uid)
    firestore
      .runTransaction(transaction => {
        return transaction.get(projectRef).then(doc => {
          if (doc.exists) {
            throw Error(`Project code ${project.code} already exists`)
          }

          transaction.set(projectRef, { ...project, owner: user.email })
          transaction.update(userRef, {
            projects: firebase.firestore.FieldValue.arrayUnion(projectRef.id),
          })
        })
      })
      .then(() => {
        setProject({ ...INIT_PROJECT })
        history.push(`${routes.PROJECTS}/${projectRef.id}`)
      })
      .catch(error => {
        console.info('Error adding document:', error)
        alert(error)
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
