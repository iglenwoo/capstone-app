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
  const [skills, setSkills] = useState<String[]>([])
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
        }
      })
      .catch(error => {
        console.log('Error getting document:', error)
      })
  }, [user, firestore])

  const classes = useStyles()

  const handleCancelClick = (e: SyntheticEvent) => {
    e.preventDefault()
    setOnEdit(false)
  }
  const handleEditClick = (e: SyntheticEvent) => {
    e.preventDefault()
    setOnEdit(true)
  }

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography variant="h5" component="h2" gutterBottom>
          Skills
        </Typography>
        <Box display="flex" flexWrap="wrap">
          {skills.length ? (
            skills.map((s, i) => (
              <Box display="inline" mt={1} ml={1}>
                <Chip label={s} key={`${s}-${i}`} />
              </Box>
            ))
          ) : (
            <Typography>None</Typography>
          )}
        </Box>
        <Box mt={1} mx={1} textAlign="right">
          {onEdit ? (
            <>
              <Button
                variant="contained"
                color="secondary"
                className={classes.button}
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
