import React, { SyntheticEvent, useContext, useEffect, useState } from 'react'
import {
  Box,
  Button,
  createStyles,
  makeStyles,
  TextField,
  Theme,
} from '@material-ui/core'
import { Auth, useAuth } from '../../components/FirebaseAuth/use-auth'
import * as firebase from 'firebase/app'
import 'firebase/firestore'
import { ProjectContext } from './index'
import { PROJECTS, USERS } from '../../constants/db.collections'
import { useSnackbar } from 'notistack'
import { Loading } from '../../components/Loading'

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
  const { project, loading, reloadProject } = useContext(ProjectContext)
  const { enqueueSnackbar } = useSnackbar()
  const [email, setEmail] = useState('')
  const [newUserId, setNewUserId] = useState('')
  const [inviting, setInviting] = useState(false)

  const handleInviteClick = (e: SyntheticEvent) => {
    if (user === null) return

    setInviting(true)
    firestore
      .collection(USERS)
      .where('email', '==', email)
      .get()
      .then(querySnapshot => {
        if (querySnapshot.size === 0) {
          throw Error(`Email ${email} not found`)
        }
        querySnapshot.forEach(function(doc) {
          setNewUserId(doc.id)
        })
      })
      .catch(error => {
        alert(error)
        setInviting(false)
      })
  }

  useEffect(() => {
    if (newUserId && email) {
      setInviting(true)
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
          setInviting(false)
          enqueueSnackbar(`${email} is invited`, { variant: 'success' })
          setEmail('')
          setNewUserId('')
          reloadProject()
        })
        .catch(error => {
          console.info('Error adding document:', error)
          alert(error)
          setInviting(false)
        })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newUserId, firestore, email, project.code])

  const classes = useStyles()

  // todo: render current members
  // polish: differentiate if members are joined
  return (
    <>
      {loading || inviting ? (
        <Loading />
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
