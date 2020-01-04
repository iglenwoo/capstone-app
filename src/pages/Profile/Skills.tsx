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
  IconButton,
  TextField,
} from '@material-ui/core'
import { AddCircle as AddCircleIcon } from '@material-ui/icons'
import { Auth, useAuth } from '../../components/FirebaseAuth/use-auth'
import { SKILLS } from '../../constants/db.collections'
import { EditableChips } from '../../components/EditableChips'
import { Loading } from '../../components/Loading'
import { HtmlTooltip } from './Ids'
import { InfoIcon } from './InfoIcon'
import { useSnackbar } from 'notistack'

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
    skill: {
      minWidth: 50,
      marginLeft: theme.spacing(2),
      marginRight: theme.spacing(2),
    },
    action: {
      marginLeft: theme.spacing(1),
    },
  })
)

export const Skills: FC = () => {
  const classes = useStyles()
  const { enqueueSnackbar } = useSnackbar()
  const { user, firestore }: Auth = useAuth()
  const [skills, setSkills] = useState<string[]>([])
  const [editingSkills, setEditingSkills] = useState<string[]>([])
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [newSkill, setNewSkill] = useState<string>('')

  useEffect(() => {
    if (!user || !user.email) return

    firestore
      .collection(SKILLS)
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
      .finally(() => {
        setLoading(false)
      })
  }, [user, firestore])

  useEffect(() => {
    if (!editing || skills === editingSkills || !user || !user.email) return
    setLoading(true)
    firestore
      .collection(SKILLS)
      .doc(user.email)
      .set({ skills: editingSkills, email: user.email })
      .then(() => {
        setSkills(editingSkills)
      })
      .catch(error => {
        console.error('Error updating skills:', error)
      })
      .finally(() => {
        setEditing(false)
        setLoading(false)
      })
  }, [editing, editingSkills, firestore, skills, user])

  const handleAddClick = () => {
    if (!newSkill) return

    const loweredEditingSkills = editingSkills.map(s => s.toLowerCase())
    if (loweredEditingSkills.includes(newSkill.toLowerCase())) {
      enqueueSnackbar(`Skill "${newSkill}" already exists.`, {
        variant: 'error',
      })
      return
    }

    const newEditingSkills = [...editingSkills, newSkill]
    setEditingSkills(newEditingSkills)
    setNewSkill('')
    setEditing(true)
  }

  const handleDeleteClick = (e: SyntheticEvent, skillToDelete: string) => {
    const newSkills = editingSkills.filter(s => s !== skillToDelete)
    setEditingSkills(newSkills)
    setEditing(true)
  }

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography variant="h6" display="inline" gutterBottom>
          Technical Skills
          <HtmlTooltip placement="right-start" title={renderTitle()}>
            <Typography display="inline">
              <InfoIcon />
            </Typography>
          </HtmlTooltip>
        </Typography>
        {loading ? (
          <Loading />
        ) : (
          <Box display="flex" flexWrap="wrap" alignItems="center">
            <EditableChips
              chips={skills}
              editingChips={editingSkills}
              onDelete={handleDeleteClick}
              editing={true}
            />
            <Box className={classes.skill}>
              <TextField
                variant="outlined"
                margin="dense"
                label="New skill"
                placeholder="JavaScript"
                value={newSkill}
                onChange={e => setNewSkill(e.currentTarget.value)}
              />
              <IconButton
                edge="end"
                aria-label="add"
                color="primary"
                className={classes.action}
                onClick={handleAddClick}
              >
                <AddCircleIcon />
              </IconButton>
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  )
}

const renderTitle = () => (
  <>
    <Typography color="inherit">Technical Skills:</Typography>
    <b>Add your technical skills here.</b>
    <br />
    <i>e.g. Java, TypeScript, Backend, PhotoShop, FinalCut, ...</i>
    <br />
    This will help you to share them with other team members in a project.
  </>
)
