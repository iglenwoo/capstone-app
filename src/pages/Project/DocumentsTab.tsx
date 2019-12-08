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
import { useSnackbar } from 'notistack'

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
  [ ] listen on /documents/
  [ ] view(render) the doc list
  [ ] download a doc
  [ ] delete a doc
*/
export const DocumentsTab: FC = () => {
  const { project } = useContext(ProjectContext)
  const { firestore, storage, user } = useAuth()
  const { enqueueSnackbar } = useSnackbar()

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

  const handleUpload = (files: FileList | null) => {
    if (!files || !files.length) return

    const storageRef = storage.ref()
    for (let i = 0; i < files.length; i++) {
      // get item
      const file = files.item(i)
      if (!file) {
        console.log('file is empty.')
        continue
      }
      const fileRef = storageRef.child(`${project.code}/${file.name}`)
      const metadata: firebase.storage.UploadMetadata = {
        customMetadata: {
          project: project.code,
          fileName: file.name,
          updatedBy: user && user.email ? user.email : '',
        },
      }

      enqueueSnackbar(`${file.name} uploading...`, { variant: 'default' })
      fileRef.put(file, metadata).then(() => {
        enqueueSnackbar(`${file.name} uploading succeeded!`, {
          variant: 'success',
        })
      })
    }
  }

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
          onChange={e => handleUpload(e.currentTarget.files)}
          onClick={e => {
            e.currentTarget.value = ''
          }}
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
