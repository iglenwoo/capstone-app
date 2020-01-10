import {
  Box,
  Card,
  CardContent,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  TextField,
  Typography,
} from '@material-ui/core'
import { Loading } from '../../components/Loading'
import { default as React, FC, useCallback, useEffect, useState } from 'react'
import { Auth, useAuth } from '../../components/FirebaseAuth/use-auth'
import { USERS } from '../../constants/db.collections'
import {
  Cancel as CancelIcon,
  Edit as EditIcon,
  Save as SaveIcon,
} from '@material-ui/icons'
import { useStyles } from './Ids'

export const Account: FC = () => {
  const classes = useStyles()
  const { user, firestore }: Auth = useAuth()
  const [firstName, setFirstName] = useState<string>('')
  const [newFirstName, setNewFirstName] = useState<string>('')
  const [lastName, setLastName] = useState<string>('')
  const [newLastName, setNewLastName] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true)
  const [onEdit, setOnEdit] = useState(false)

  const fetchProjects = useCallback(() => {
    if (user === null) return

    setLoading(true)
    firestore
      .collection(USERS)
      .doc(user.uid)
      .get()
      .then(doc => {
        const data = doc.data()
        if (data) {
          const { firstName, lastName } = data
          if (firstName) setFirstName(firstName)
          if (lastName) setLastName(lastName)
        }
        setLoading(false)
      })
      .catch(error => {
        console.log('Error getting document:', error)
        setLoading(false)
      })
  }, [firestore, user])

  useEffect(() => {
    if (user === null) return

    fetchProjects()
  }, [user, firestore, fetchProjects])

  const handleEditClick = () => {
    setNewFirstName(firstName)
    setNewLastName(lastName)
    setOnEdit(true)
  }
  const handleCancelClick = () => {
    setOnEdit(false)
  }
  const handleSaveClick = () => {
    if (user === null) return

    setLoading(true)
    firestore
      .collection(USERS)
      .doc(user.uid)
      .update({ firstName: newFirstName, lastName: newLastName })
      .then(doc => {
        setFirstName(newFirstName)
        setLastName(newLastName)
      })
      .catch(error => {
        console.log('Error getting document:', error)
      })
      .finally(() => {
        setOnEdit(false)
        setLoading(false)
      })
  }

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography variant="h6" display="inline" gutterBottom>
          Profile
        </Typography>
        {loading ? (
          <Loading />
        ) : (
          <>
            <Box ml={1}>
              <Typography gutterBottom variant="body1">
                Account: {user && user.email}
              </Typography>
              <List dense>
                <ListItem className={classes.title} divider>
                  <ListItemText primary="First name" />
                  <ListItemText primary="Last name" />
                  <ListItemSecondaryAction />
                </ListItem>
                <ListItem>
                  {onEdit ? (
                    <>
                      <ListItemText className={classes.value}>
                        <TextField
                          variant="outlined"
                          margin="dense"
                          fullWidth
                          value={newFirstName}
                          onChange={e => setNewFirstName(e.currentTarget.value)}
                        />
                      </ListItemText>
                      <ListItemText className={classes.value}>
                        <TextField
                          variant="outlined"
                          margin="dense"
                          fullWidth
                          value={newLastName}
                          onChange={e => setNewLastName(e.currentTarget.value)}
                        />
                      </ListItemText>
                    </>
                  ) : (
                    <>
                      <ListItemText primary={firstName} />
                      <ListItemText primary={lastName} />
                    </>
                  )}

                  <ListItemSecondaryAction>
                    {onEdit ? (
                      <>
                        <IconButton
                          aria-label="cancel"
                          onClick={handleCancelClick}
                        >
                          <CancelIcon color="action" />
                        </IconButton>
                        <IconButton aria-label="save" onClick={handleSaveClick}>
                          <SaveIcon color="secondary" />
                        </IconButton>
                      </>
                    ) : (
                      <>
                        {/* currently not allowed to edit name */}
                        {/*<IconButton aria-label="edit" onClick={handleEditClick}>*/}
                        {/*  <EditIcon color="primary" />*/}
                        {/*</IconButton>*/}
                      </>
                    )}
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  )
}
