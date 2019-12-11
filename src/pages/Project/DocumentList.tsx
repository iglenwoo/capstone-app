import { default as React, FC, SyntheticEvent, useState } from 'react'
import {
  createStyles,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles,
  Theme,
} from '@material-ui/core'
import {
  Description as DescriptionIcon,
  Delete as DeleteIcon,
} from '@material-ui/icons'

import { Document } from './DocumentsTab'
import { useAuth } from '../../components/FirebaseAuth/use-auth'
import { useSnackbar } from 'notistack'
import { ConfirmDialog } from '../../components/Dialog/ConflrmDIalog'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      backgroundColor: theme.palette.background.paper,
    },
    name: {
      width: '30%',
    },
  })
)

export const DocumentList: FC<{
  documents: Document[]
  setIsDocLoading: (value: ((prevState: boolean) => boolean) | boolean) => void
}> = prop => {
  const { storage } = useAuth()
  const { enqueueSnackbar } = useSnackbar()
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false)
  const [docToDelete, setDocToDelete] = useState<Document | null>(null)

  const handleDownload = (e: SyntheticEvent, doc: Document) => {
    const ref = storage.ref(doc.path)
    ref
      .getDownloadURL()
      .then(url => {
        // Insert url into an <img> tag to "download"
        window.open(url)
      })
      .catch(error => {
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
          case 'storage/object-not-found':
            // File doesn't exist
            break

          case 'storage/unauthorized':
            // User doesn't have permission to access the object
            break

          case 'storage/canceled':
            // User canceled the upload
            break

          case 'storage/unknown':
            // Unknown error occurred, inspect the server response
            break
        }
      })
  }

  const handleDelete = (doc: Document) => {
    setDocToDelete(doc)
    setOpenDeleteConfirm(true)
  }

  const confirmDelete = () => {
    if (!docToDelete) {
      console.log('doc is empty???')
      return
    }
    deleteDoc(docToDelete)
  }

  const deleteDoc = (doc: Document) => {
    const ref = storage.ref(doc.path)
    prop.setIsDocLoading(true)
    ref
      .delete()
      .then(() => {
        enqueueSnackbar(`${doc.name} deleted`, { variant: 'success' })
      })
      .catch(error => {
        enqueueSnackbar(`Failed to delete ${doc.name}`, { variant: 'error' })
        console.log(error)
      })
      .finally(() => {
        setDocToDelete(null)
        prop.setIsDocLoading(true)
      })
  }

  const classes = useStyles()
  return (
    <List className={classes.root}>
      <ListItem>
        <ListItemText className={classes.name}>Name</ListItemText>
        <ListItemText>Date</ListItemText>
        <ListItemSecondaryAction />
      </ListItem>
      <Divider />
      {prop.documents.map((doc: Document, i) => (
        <ListItem
          key={`${doc.name}-${i}`}
          dense
          button
          onClick={e => {
            handleDownload(e, doc)
          }}
        >
          <ListItemIcon>
            <DescriptionIcon />
          </ListItemIcon>
          <ListItemText className={classes.name} primary={doc.name} />
          <ListItemText
            primary={doc.updatedAt.toDate().toLocaleString('en-US')}
          />
          <ListItemSecondaryAction>
            <IconButton
              edge="end"
              aria-label="delete"
              onClick={e => handleDelete(doc)}
            >
              <DeleteIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      ))}
      <ConfirmDialog
        open={openDeleteConfirm}
        onConfirm={() => {
          confirmDelete()
        }}
        onCancel={() => {
          setOpenDeleteConfirm(false)
        }}
        title="Delete"
        message={
          docToDelete ? `Are you sure to delete ${docToDelete.name} ?` : ''
        }
      />
    </List>
  )
}
