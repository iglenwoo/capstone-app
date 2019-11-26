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
  IconButton,
  TextField,
} from '@material-ui/core'
import { AddCircle as AddCircleIcon } from '@material-ui/icons'
import { Auth, useAuth } from '../../components/FirebaseAuth/use-auth'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      marginTop: theme.spacing(1),
    },
    button: {
      minWidth: 100,
      maxHeight: 36,
      marginLeft: theme.spacing(1),
    },
    skill: { flex: 1, minWidth: 100, marginRight: theme.spacing(1) },
    addIcon: {
      marginRight: theme.spacing(5),
    },
  })
)

export const Skills: FC = props => {
  const { user, firestore }: Auth = useAuth()
  const [skills, setSkills] = useState<string[]>([])
  const [editingSkills, setEditingSkills] = useState<string[]>([])
  const [onEdit, setOnEdit] = useState(false)
  const [newSkill, setNewSkill] = useState<string>('')

  useEffect(() => {
    if (!user || !user.email) return

    firestore
      .collection('skills')
      .doc(user.email)
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
  }, [onEdit, skills])

  const classes = useStyles()

  const handleEditClick = (e: SyntheticEvent) => {
    e.preventDefault()
    setOnEdit(true)
  }
  const handleAddClick = (e: SyntheticEvent) => {
    e.preventDefault()
    if (!newSkill) return

    const newEditingSkills = [...editingSkills, newSkill]
    setEditingSkills(newEditingSkills)
    setNewSkill('')
  }
  const handleSaveClick = (e: SyntheticEvent) => {
    e.preventDefault()
    if (skills === editingSkills || !user || !user.email) return

    firestore
      .collection('skills')
      .doc(user.email)
      .set({ skills: editingSkills })
      .then(() => {
        setSkills(editingSkills)
        setOnEdit(false)
      })
      .catch(error => {
        console.error('Error updating skills:', error)
      })
  }
  const handleCancelClick = (e: SyntheticEvent) => {
    e.preventDefault()
    setOnEdit(false)
  }

  const handleDeleteClick = (e: SyntheticEvent, skillToDelete: string) => {
    e.preventDefault()
    const newSkills = editingSkills.filter(s => s !== skillToDelete)
    setEditingSkills(newSkills)
  }

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
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
        <Box
          display="flex"
          justifyContent="flex-end"
          flexWrap="wrap"
          alignItems="center"
          minHeight={49}
          mt={1}
          mx={1}
        >
          {onEdit ? (
            <>
              <TextField
                label="New skill"
                placeholder="JavaScript"
                className={classes.skill}
                value={newSkill}
                onChange={e => setNewSkill(e.currentTarget.value)}
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
