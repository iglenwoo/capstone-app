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
import { useEffect, useState } from 'react'
import { Auth, useAuth } from '../../components/FirebaseAuth/use-auth'
import 'firebase/firestore'
import { useHistory } from 'react-router'
import * as routes from '../../constants/routes'
import { validateProjectCode } from '../../utils'
import { useSnackbar } from 'notistack'
import { Loading } from '../../components/Loading'
import { Member, MemberRole, MemberStatus, Project } from '../Project/model'
import { useContext } from 'react'
import { ProjectsContext } from './index'

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
  members: {},
  title: '',
  desc: '',
}

export const Create = () => {
  const { user, functions }: Auth = useAuth()
  const history = useHistory()
  const { firstName, lastName } = useContext(ProjectsContext)
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
    if (!user || !user.email) return
    if (!validateProjectCode(project.code)) {
      enqueueSnackbar(`Please use alphabet, numbers, '-' or '_'.`, {
        variant: 'error',
      })
      setCodeError(true)
      return
    }
    setCodeError(false)
    setLoading(true)

    const owner: Member = {
      role: MemberRole.Owner,
      status: MemberStatus.Own,
      firstName,
      lastName,
    }

    const addProject = functions.httpsCallable('addProject')
    addProject({ ...project, members: { [user.email]: owner } })
      .then(result => {
        setProject({ ...INIT_PROJECT })
        history.push(`${routes.PROJECTS}/${result.data.id}`)
      })
      .catch(error => {
        console.error(error)
        alert(error.message)
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
