import React, { useEffect, useState } from 'react'
import { Auth, useAuth } from '../../components/FirebaseAuth/use-auth'
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Container,
  createStyles,
  Link as LinkUI,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core'
import { Link } from 'react-router-dom'
import * as routes from '../../constants/routes'
import { PROJECTS } from '../../constants/db.collections'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      marginTop: theme.spacing(1),
    },
  })
)

export const Invited = () => {
  const { user, firestore }: Auth = useAuth()
  const [projects, setProjects] = useState<string[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    if (user === null) return

    firestore
      .collection(PROJECTS)
      .where('members', 'array-contains', user.email)
      .get()
      .then(querySnapshot => {
        const newProjects: string[] = []
        querySnapshot.forEach(doc => {
          console.log(doc.id)
          newProjects.push(doc.id)
        })
        setProjects(newProjects)
        setLoading(false)
      })
      .catch(error => {
        console.log('Error getting document:', error)
        setLoading(false)
      })
  }, [user, firestore])

  const projectsLinks = projects.length ? (
    projects.map((p, i) => {
      return (
        <Box p={1} key={`${p}-${i}`}>
          <LinkUI
            href="#"
            variant="body2"
            component={Link}
            to={`${routes.PROJECTS}/${p}`}
          >
            {p}
          </LinkUI>
        </Box>
      )
    })
  ) : (
    <Box>No projects...</Box>
  )

  const classes = useStyles()

  return (
    <Card className={classes.card}>
      <CardContent>
        {loading ? (
          <Box display="flex" alignItems="center">
            <CircularProgress color="secondary" />
          </Box>
        ) : (
          <Box py={1}>
            <Typography gutterBottom variant="h6">
              Invited
            </Typography>
            <Box ml={1}>{projectsLinks}</Box>
          </Box>
        )}
      </CardContent>
    </Card>
  )
}
