import { FC, default as React, useContext } from 'react'
import { ProjectContext } from './index'
import { useAuth } from '../../components/FirebaseAuth/use-auth'
import { useAsyncEffect } from '../../utils/use-async-effect'
import * as firebase from 'firebase'
import { DOCUMENTS, PROJECTS } from '../../constants/routes'
import {
  Box,
  Button,
  createStyles,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core'
import { CloudUpload as CloudUploadIcon } from '@material-ui/icons'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    project: {
      marginBottom: theme.spacing(2),
    },
    input: {
      display: 'none',
    },
  })
)

// TODO: DocumentsTab
/*
  [ ] fetch the doc
  [ ] find a lib for text editor
  [ ] npm add XXX
  [ ] view(render) the doc
  [ ] add new doc
  [ ] edit a doc -> save
  [ ] design side tabs and main doc body
*/
export const DocumentsTab: FC = () => {
  const { project } = useContext(ProjectContext)
  const { firestore } = useAuth()

  const fetchDocs = async () => {
    if (!project.code) return

    try {
      const snapshot: firebase.firestore.QuerySnapshot = await firestore
        .collection(PROJECTS)
        .doc(project.code)
        .collection(DOCUMENTS)
        .get()

      snapshot.forEach(result => {
        console.log('result', result)
      })
    } catch (e) {
      console.log('Error getting document:', e)
    }
  }

  useAsyncEffect(fetchDocs, [project.code])

  const classes = useStyles()
  return (
    <>
      <Typography variant="h5" className={classes.project}>
        Project Code: {project.code}
      </Typography>
      <Box>
        <input
          accept="image/*"
          className={classes.input}
          id="contained-button-file"
          multiple
          type="file"
        />
        <label htmlFor="contained-button-file">
          <Button
            variant="contained"
            component="span"
            color="secondary"
            startIcon={<CloudUploadIcon />}
          >
            Upload
          </Button>
        </label>
      </Box>
    </>
  )
}
