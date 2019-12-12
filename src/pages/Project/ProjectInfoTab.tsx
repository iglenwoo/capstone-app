import * as React from 'react'
import { FC, useContext, useEffect } from 'react'
import {
  Box,
  Button,
  createStyles,
  makeStyles,
  TextField,
  Theme,
  Typography,
} from '@material-ui/core'
import { ProjectContext } from './index'
import { Loading } from '../../components/Loading'
import { useState } from 'react'
import { Auth, useAuth } from '../../components/FirebaseAuth/use-auth'
import { PROJECTS } from '../../constants/db.collections'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    inputTitle: {
      marginBottom: theme.spacing(2),
    },
    inputValue: {
      marginLeft: theme.spacing(2),
      marginBottom: theme.spacing(2),
      color: 'gray',
    },
    fieldContainer: {
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'top',
      flexWrap: 'wrap',
    },
    button: {
      minWidth: 100,
      maxHeight: 36,
      marginLeft: theme.spacing(1),
    },
  })
)

export interface Project {
  code: string
  owner: string
  members: string[]
  title: string
  desc: string
}

export const ProjectInfoTab: FC = () => {
  const { user, firestore }: Auth = useAuth()
  const { loading, project, reloadProject } = useContext(ProjectContext)
  const [editing, setEditing] = useState<boolean>(false)
  const [title, setTitle] = useState<string>('')
  const [desc, setDesc] = useState<string>('')

  const setTitleAndDesc = () => {
    if (project) {
      if (project.title) setTitle(project.title)
      if (project.desc) setDesc(project.desc)
    }
  }
  useEffect(() => {
    setTitleAndDesc()
  }, [project])

  const handleEditClick = () => {
    setEditing(true)
  }
  const handleCancelClick = () => {
    setTitleAndDesc()
    setEditing(false)
  }
  const handleSaveClick = () => {
    if (!editing || !user || !project || !project.code) return

    const obj = Object.assign({}, project)
    firestore
      .collection(PROJECTS)
      .doc(project.code)
      .set({ ...obj, title, desc })
      .then(() => {
        reloadProject()
        setEditing(false)
      })
      .catch(error => {
        console.error('Error updating project:', error)
      })
  }

  const classes = useStyles()

  return (
    <Box>
      {loading ? (
        <Loading />
      ) : (
        <Box className={classes.root}>
          <Typography variant="h5" className={classes.inputTitle}>
            Project Code: {project.code}
          </Typography>
          <Typography variant="subtitle1" className={classes.inputTitle}>
            Owner: {project.owner}
          </Typography>
          <Typography variant="h6">Title:</Typography>
          {editing ? (
            <TextField
              fullWidth
              margin="dense"
              variant="outlined"
              placeholder="Awesome project"
              className={classes.inputValue}
              value={title}
              onChange={e => setTitle(e.currentTarget.value)}
            />
          ) : (
            <Typography variant="body1" className={classes.inputValue}>
              {project.title}
            </Typography>
          )}
          <Typography variant="h6">Description:</Typography>
          {editing ? (
            <TextField
              fullWidth
              margin="dense"
              variant="outlined"
              placeholder="This is an awesome project"
              className={classes.inputValue}
              value={desc}
              onChange={e => setDesc(e.currentTarget.value)}
            />
          ) : (
            <Typography variant="h6" className={classes.inputValue}>
              {project.desc}
            </Typography>
          )}
          <Box className={classes.fieldContainer}>
            {editing ? (
              <>
                <Button
                  variant="contained"
                  color="default"
                  className={classes.button}
                  onClick={handleCancelClick}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  className={classes.button}
                  onClick={handleSaveClick}
                >
                  Save
                </Button>
              </>
            ) : (
              <Button
                variant="contained"
                color="primary"
                className={classes.button}
                onClick={handleEditClick}
              >
                Edit
              </Button>
            )}
          </Box>
        </Box>
      )}
    </Box>
  )
}
