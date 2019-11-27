import {
  default as React,
  FC,
  SyntheticEvent,
  useEffect,
  useState,
} from 'react'
import {
  createStyles,
  makeStyles,
  Card,
  Theme,
  Typography,
  CardContent,
  Box,
  Button,
  IconButton,
  TextField,
} from '@material-ui/core'
import { AddCircle as AddCircleIcon } from '@material-ui/icons'
import { Auth, useAuth } from '../../components/FirebaseAuth/use-auth'
import { INTERESTS } from '../../constants/db.collections'
import { EditableChips } from '../../components/EditableChips'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(2),
    },
    button: {
      minWidth: 100,
      maxHeight: 36,
      marginLeft: theme.spacing(1),
    },
    interest: { flex: 1, minWidth: 100, marginRight: theme.spacing(1) },
    addIcon: {
      marginRight: theme.spacing(5),
    },
  })
)

export const Interests: FC = () => {
  const { user, firestore }: Auth = useAuth()
  const [interests, setInterests] = useState<string[]>([])
  const [editingInterests, setEditingInterests] = useState<string[]>([])
  const [editing, setEditing] = useState(false)
  const [newInterest, setNewInterest] = useState<string>('')

  useEffect(() => {
    if (!user || !user.email) return

    firestore
      .collection(INTERESTS)
      .doc(user.email)
      .get()
      .then(doc => {
        const data = doc.data()
        if (data && data.interests) {
          setInterests(data.interests)
          setEditingInterests(data.interests)
        }
      })
      .catch(error => {
        console.log('Error getting document:', error)
      })
  }, [user, firestore])

  useEffect(() => {
    if (editing) {
      setEditingInterests(interests)
    }
  }, [editing, interests])

  const classes = useStyles()

  const handleEditClick = (e: SyntheticEvent) => {
    e.preventDefault()
    setEditing(true)
  }
  const handleAddClick = (e: SyntheticEvent) => {
    e.preventDefault()
    if (!newInterest) return

    const newEditingInterests = [...editingInterests, newInterest]
    setEditingInterests(newEditingInterests)
    setNewInterest('')
  }
  const handleSaveClick = (e: SyntheticEvent) => {
    e.preventDefault()
    if (interests === editingInterests || !user || !user.email) return

    firestore
      .collection(INTERESTS)
      .doc(user.email)
      .set({ interests: editingInterests })
      .then(() => {
        setInterests(editingInterests)
        setEditing(false)
      })
      .catch(error => {
        console.error('Error updating interests:', error)
      })
  }
  const handleCancelClick = (e: SyntheticEvent) => {
    e.preventDefault()
    setEditing(false)
  }

  const handleDeleteClick = (e: SyntheticEvent, interestToDelete: string) => {
    e.preventDefault()
    const newInterests = editingInterests.filter(i => i !== interestToDelete)
    setEditingInterests(newInterests)
  }

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography variant="h5" component="h2" gutterBottom>
          Interests
        </Typography>
        <EditableChips
          chips={interests}
          editingChips={editingInterests}
          onDelete={handleDeleteClick}
          editing={editing}
        />
        <Box
          display="flex"
          justifyContent="flex-end"
          flexWrap="wrap"
          alignItems="center"
          minHeight={49}
          mt={1}
          mx={1}
        >
          {editing ? (
            <>
              <TextField
                label="New interest"
                placeholder="JavaScript"
                className={classes.interest}
                value={newInterest}
                onChange={e => setNewInterest(e.currentTarget.value)}
              />
              <IconButton
                edge="end"
                aria-label="add"
                color="primary"
                className={classes.addIcon}
                onClick={handleAddClick}
              >
                <AddCircleIcon />
              </IconButton>
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
      </CardContent>
    </Card>
  )
}
