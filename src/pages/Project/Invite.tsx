import React, { useContext, useEffect, useState } from 'react'
import {
  Box,
  Button,
  createStyles,
  makeStyles,
  TextField,
  Theme,
  Typography,
} from '@material-ui/core'
import { Auth, useAuth } from '../../components/FirebaseAuth/use-auth'
import 'firebase/firestore'
import { ProjectContext } from './index'
import { useSnackbar } from 'notistack'
import { Loading } from '../../components/Loading'
import { validateEmail } from '../../utils'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    fieldContainer: {
      display: 'flex',
      justifyContext: 'center',
      alignItems: 'top',
      flexWrap: 'wrap',
    },
    title: {
      marginLeft: theme.spacing(2),
      marginBottom: theme.spacing(0),
    },
    label: {
      backgroundColor: 'white',
    },
    button: {
      minWidth: 150,
      marginLeft: theme.spacing(1),
    },
  })
)

export const Invite = () => {
  const { user, functions }: Auth = useAuth()
  const { project, loading, reloadProject } = useContext(ProjectContext)
  const { enqueueSnackbar } = useSnackbar()
  const [email, setEmail] = useState('')
  const [inviting, setInviting] = useState(false)
  const [emailError, setEmailError] = useState<boolean>(false)
  const [disabledInvite, setDisabledInvite] = useState<boolean>(true)

  useEffect(() => {
    if (email) {
      if (validateEmail(email)) {
        setEmailError(false)
        setDisabledInvite(false)
      } else {
        setEmailError(true)
        setDisabledInvite(true)
      }
    }
  }, [email])

  const handleInviteClick = () => {
    if (user === null) return
    if (!validateEmail(email)) {
      setEmailError(true)
      setDisabledInvite(true)
      return
    }
    setInviting(true)

    functions
      .httpsCallable('inviteMember')({
        newMemberEmail: email,
        code: project.code,
      })
      .then(result => {
        enqueueSnackbar(`${email} is invited`, { variant: 'success' })
        setEmail('')
        reloadProject()
      })
      .catch(e => {
        alert(e.message)
      })
      .finally(() => setInviting(false))
  }

  const classes = useStyles()

  // polish: differentiate if members are joined
  return (
    <>
      <Typography gutterBottom variant="h6" className={classes.title}>
        Invite Members
      </Typography>
      {loading || inviting ? (
        <Loading />
      ) : (
        <Box className={classes.fieldContainer} mb={1}>
          <Box flexGrow={2} mx={1}>
            <TextField
              label="New member email"
              placeholder="example@exmaple.com"
              helperText="Please enter a user email"
              margin="dense"
              variant="outlined"
              fullWidth
              InputLabelProps={{
                classes: {
                  root: classes.label,
                },
              }}
              value={email}
              onChange={e => setEmail(e.currentTarget.value)}
              error={emailError}
            />
          </Box>
          <Box mx={1} pt={1}>
            <Button
              variant="contained"
              color="secondary"
              className={classes.button}
              onClick={handleInviteClick}
              disabled={disabledInvite}
            >
              Invite
            </Button>
          </Box>
        </Box>
      )}
    </>
  )
}
