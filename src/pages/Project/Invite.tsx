import React, { SyntheticEvent, useContext, useEffect, useState } from 'react'
import {
  Box,
  Button,
  CircularProgress,
  createStyles,
  makeStyles,
  TextField,
  Theme,
} from '@material-ui/core'
import { Auth, useAuth } from '../../components/FirebaseAuth/use-auth'
import * as firebase from 'firebase'
import { ProjectContext } from './index'
import { PROJECTS, USERS } from '../../constants/db.collections'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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
export const Invite = () => {
  const { user, firestore }: Auth = useAuth()
  const { project } = useContext(ProjectContext)
  const [email, setEmail] = useState('')
  const [newUserId, setNewUserId] = useState('')
  const [loading, setLoading] = useState(false)

  const handleInviteClick = (e: SyntheticEvent) => {
    e.preventDefault()

    if (user === null) return

    setLoading(true)
    firestore
      .collection(USERS)
      .where('email', '==', email)
      .get()
      .then(querySnapshot => {
        if (querySnapshot.size === 0) {
          throw Error(`Email ${email} not found`)
        }
        querySnapshot.forEach(function(doc) {
          console.log(doc.id, ' => ', doc.data())
          setNewUserId(doc.id)
        })
      })
      .catch(error => {
        alert(error)
        setLoading(false)
      })
  }

  useEffect(() => {
    if (newUserId) {
      const projectRef = firestore.collection(PROJECTS).doc(project.code)
      firestore
        .runTransaction(transaction => {
          return transaction.get(projectRef).then(doc => {
            if (!doc.exists) {
              throw Error(`Project code ${project.code} doesn't exist`)
            }
            transaction.update(projectRef, {
              members: firebase.firestore.FieldValue.arrayUnion(email),
            })
          })
        })
        .then(() => {
          setLoading(false)
          setEmail('')
          //TODO: notify the result by a toast?
        })
        .catch(error => {
          console.info('Error adding document:', error)
          alert(error)
          setLoading(false)
        })
    }
  }, [newUserId])

  const classes = useStyles()

  // todo: render current members
  // polish: differentiate if members are joined
  return (
    <>
      {loading ? (
        <Box display="flex" alignItems="center">
          <CircularProgress color="secondary" />
        </Box>
      ) : (
        <Box className={classes.fieldContainer} mb={2}>
          <Box flexGrow={2} mx={1}>
            <TextField
              label="New member"
              placeholder="email"
              helperText="Please enter an email"
              margin="dense"
              variant="outlined"
              fullWidth
              value={email}
              onChange={e => setEmail(e.currentTarget.value)}
            />
          </Box>
          <Box mx={1} pt={1}>
            <Button
              variant="contained"
              color="secondary"
              className={classes.button}
              onClick={handleInviteClick}
            >
              Invite
            </Button>
          </Box>
        </Box>
      )}
    </>
  )
}
