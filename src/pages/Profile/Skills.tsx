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
  Chip,
  Button,
} from '@material-ui/core'
import { Auth, useAuth } from '../../components/FirebaseAuth/use-auth'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      padding: theme.spacing(1),
    },
    button: {
      minWidth: 100,
    },
  })
)

export const Skills: FC = props => {
  const { user, firestore }: Auth = useAuth()
  const [skills, setSkills] = useState<string[]>([])
  const [editingSkills, setEditingSkills] = useState<string[]>([])
  const [onEdit, setOnEdit] = useState(false)

  useEffect(() => {
    if (user === null) return

    firestore
      .collection('skills')
      .doc(user.uid)
      .get()
      .then(doc => {
        const data = doc.data()
        if (data && data.skills) {
          setSkills(data.skills)
          setEditingSkills(data.skills)
        }
      })
      .catch(error => {
        console.log('Error getting document:', error)
      })
  }, [user, firestore])

  useEffect(() => {
    if (onEdit) {
      setEditingSkills(skills)
    }
  }, [onEdit])

  const classes = useStyles()

  const handleSaveClick = (e: SyntheticEvent) => {
    e.preventDefault()
    //TODO: update skills
    setSkills(editingSkills)
    setOnEdit(false)
  }
  const handleCancelClick = (e: SyntheticEvent) => {
    e.preventDefault()
    setOnEdit(false)
  }
  const handleEditClick = (e: SyntheticEvent) => {
    e.preventDefault()
    setOnEdit(true)
  }

  const handleDeleteClick = (e: SyntheticEvent, skillToDelete: string) => {
    e.preventDefault()
    const newSkills = editingSkills.filter(s => s !== skillToDelete)
    setEditingSkills(newSkills)
  }

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography variant="h5" component="h2" gutterBottom>
          Skills
        </Typography>
        <Box display="flex" flexWrap="wrap">
          {onEdit
            ? editingSkills.map((s, i) => (
                <Box display="inline" mt={1} ml={1} key={`${s}-${i}`}>
                  <Chip
                    label={s}
                    onDelete={e => {
                      handleDeleteClick(e, s)
                    }}
                  />
                </Box>
              ))
            : skills.map((s, i) => (
                <Box display="inline" mt={1} ml={1} key={`${s}-${i}`}>
                  {onEdit ? (
                    <Chip
                      label={s}
                      onDelete={e => {
                        handleDeleteClick(e, s)
                      }}
                    />
                  ) : (
                    <Chip key={`${s}-${i}`} label={s} />
                  )}
                </Box>
              ))}
        </Box>
        <Box mt={1} mx={1} textAlign="right">
          {onEdit ? (
            <>
              <Button
                variant="contained"
                color="secondary"
                className={classes.button}
                onClick={handleSaveClick}
              >
                Save
              </Button>
              <Box display="inline" ml={1}>
                <Button
                  variant="contained"
                  color="default"
                  className={classes.button}
                  onClick={handleCancelClick}
                >
                  Cancel
                </Button>
              </Box>
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
