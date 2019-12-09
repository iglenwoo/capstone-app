import { default as React, FC, SyntheticEvent } from 'react'
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
}> = prop => {
  const { storage } = useAuth()

  const handleDownload = (e: SyntheticEvent, doc: Document) => {
    const ref = storage.ref(doc.path)
    ref
      .getDownloadURL()
      .then(url => {
        // Insert url into an <img> tag to "download"
        console.log('url', url)
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
            <IconButton edge="end" aria-label="delete">
              <DeleteIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      ))}
    </List>
  )
}
