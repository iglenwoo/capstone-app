import { default as React, FC, useEffect, useState } from 'react'
import {
  createStyles,
  makeStyles,
  Card,
  Theme,
  Typography,
  CardContent,
  Box,
  Chip,
} from '@material-ui/core'
import { Auth, useAuth } from '../../components/FirebaseAuth/use-auth'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      padding: theme.spacing(1),
    },
  })
)

export const Skills: FC = props => {
  const { user, firestore }: Auth = useAuth()
  const [skills, setSkills] = useState<String[]>([])

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

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography variant="h5" component="h2" gutterBottom>
          Skills
        </Typography>
        <Box>
          {skills.length ? (
            skills.map((s, i) => <Chip label={s} key={`${s}-${i}`} />)
          ) : (
            <Typography>None</Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  )
}
