import {
  Box,
  Button,
  Card,
  CardContent,
  createStyles,
  makeStyles,
  TextField,
  Theme,
  Typography,
} from '@material-ui/core'
import * as React from 'react'
import { useState } from 'react'
import { Auth, useAuth } from '../../components/FirebaseAuth/use-auth'
import * as firebase from 'firebase/app'
import 'firebase/firestore'
import { useHistory } from 'react-router'
import * as routes from '../../constants/routes'
import { validateProjectCode } from '../../utils'
import { useSnackbar } from 'notistack'
import { useEffect } from 'react'
import { Loading } from '../../components/Loading'
import { Project } from '../Project/ProjectInfoTab'

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

const INIT_PROJECT: Project = {
  code: '',
  owner: '',
  members: [],
  title: '',
  desc: '',
}

export const Create = () => {
  const { user, firestore }: Auth = useAuth()
  const history = useHistory()
  const { enqueueSnackbar } = useSnackbar()
  const [project, setProject] = useState<Project>({ ...INIT_PROJECT })
  const [codeError, setCodeError] = useState<boolean>(false)
  const [disabledCreate, setDisabledCreate] = useState<boolean>(true)
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    if (project.code) {
      if (validateProjectCode(project.code)) {
        setCodeError(false)
        setDisabledCreate(false)
      } else {
        setCodeError(true)
        setDisabledCreate(true)
      }
    }
  }, [project.code])

  const handleCreateClick = () => {
    if (!user) return
    if (!validateProjectCode(project.code)) {
      enqueueSnackbar(`Please use alphabet, numbers, '-' or '_'.`, {
        variant: 'error',
      })
      setCodeError(true)
      return
    }
    setCodeError(false)
    setLoading(true)

    const projectRef = firestore.collection('projects').doc(project.code)
    const userRef = firestore.collection('users').doc(user.uid)
    firestore
      .runTransaction(transaction => {
        return transaction.get(userRef).then(() => {
          transaction.set(projectRef, {
            ...project,
            owner: user.email,
          })
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
      .finally(() => setLoading(false))
  }

  const classes = useStyles()

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography gutterBottom variant="h6">
          Create a project
        </Typography>
        {loading ? (
          <Loading />
        ) : (
          <Box className={classes.fieldContainer} mb={0}>
            <Box flexGrow={2} mx={1}>
              <TextField
                label="New Project Code"
                placeholder="Awesome-project-code"
                helperText="Project Unique code (alphabets, numbers, '-', and '_' are only allowed)"
                margin="dense"
                variant="outlined"
                fullWidth
                value={project.code}
                onChange={e =>
                  setProject({ ...project, code: e.currentTarget.value })
                }
                error={codeError}
              />
            </Box>
            <Box mx={1} pt={1}>
              <Button
                variant="contained"
                color="secondary"
                className={classes.button}
                onClick={handleCreateClick}
                disabled={disabledCreate}
              >
                Create
              </Button>
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  )
}
