import React, { SyntheticEvent, useContext, useEffect, useState } from 'react'
import { Auth, useAuth } from '../../components/FirebaseAuth/use-auth'
import * as firebase from 'firebase/app'
import 'firebase/firestore'
import {
  Box,
  Button,
  Card,
  CardContent,
  createStyles,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core'
import { PROJECTS, USERS } from '../../constants/db.collections'
import { ProjectsContext } from './index'
import { Loading } from '../../components/Loading'
import { EmptyListItem } from './ProjectList'
import { NotificationImportant as NotificationImportantIcon } from '@material-ui/icons'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(2),
    },
    listItem: {
      '&:hover': {
        backgroundColor: theme.palette.grey['200'],
      },
    },
  })
)

export const Invitations = () => {
  const classes = useStyles()
  const { joinedProjects, fetchProjects } = useContext(ProjectsContext)
  const { user, firestore }: Auth = useAuth()
  const [projects, setProjects] = useState<string[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    setLoading(true)
    if (user === null) return

    firestore
      .collection(PROJECTS)
      .where('members', 'array-contains', user.email)
      .get()
      .then(querySnapshot => {
        const newProjects: string[] = []
        querySnapshot.forEach(doc => {
          if (!joinedProjects.includes(doc.id)) {
            newProjects.push(doc.id)
          }
        })

        setProjects(newProjects)
        setLoading(false)
      })
      .catch(error => {
        console.log('Error getting document:', error)
        setLoading(false)
      })
  }, [user, firestore, joinedProjects])

  const handleAcceptClick = (e: SyntheticEvent, code: string) => {
    if (user === null) return

    firestore
      .collection(USERS)
      .doc(user.uid)
      .update({ projects: firebase.firestore.FieldValue.arrayUnion(code) })
      .then(() => {
        fetchProjects()
      })
      .catch(error => {
        console.log(`Error accepting a project ${code}`, error)
      })
  }

  const projectsLinks = projects.length ? (
    projects.map((p, i) => {
      return (
        <ListItem key={`${p}-${i}`} className={classes.listItem} dense>
          <ListItemIcon>
            <NotificationImportantIcon />
          </ListItemIcon>
          <ListItemText>
            <Typography>{p}</Typography>
          </ListItemText>
          <ListItemSecondaryAction>
            <Button
              variant="contained"
              color="secondary"
              onClick={e => {
                handleAcceptClick(e, p)
              }}
            >
              Accept
            </Button>
          </ListItemSecondaryAction>
        </ListItem>
      )
    })
  ) : (
    <EmptyListItem />
  )

  return (
    <Card className={classes.card}>
      <CardContent>
        {loading ? (
          <Loading />
        ) : (
          <Box py={1}>
            <Typography gutterBottom variant="h6">
              Invitations
            </Typography>
            <List>{projectsLinks}</List>
          </Box>
        )}
      </CardContent>
    </Card>
  )
}
