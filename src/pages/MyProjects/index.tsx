import React, { createContext, useEffect, useState } from 'react'
import { Auth, useAuth } from '../../components/FirebaseAuth/use-auth'
import {
  Box,
  Card,
  CardContent,
  Container,
  createStyles,
  Link as LinkUI,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core'
import { Link } from 'react-router-dom'
import * as routes from '../../constants/routes'
import { USERS } from '../../constants/db.collections'
import { Invited } from './Invited'
import { Loading } from '../../components/Loading'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      marginTop: theme.spacing(2),
    },
  })
)

export const MyProjectContext = createContext<{
  joinedProjects: string[]
  fetchProjects: () => void
}>({
  joinedProjects: [],
  fetchProjects: () => {},
})

export const MyProjects = () => {
  const { user, firestore }: Auth = useAuth()
  const [projects, setProjects] = useState<string[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  const fetchProjects = () => {
    if (user === null) return

    setLoading(true)
    firestore
      .collection(USERS)
      .doc(user.uid)
      .get()
      .then(doc => {
        const data = doc.data()
        if (data && data.projects) {
          setProjects(data.projects)
        }
        setLoading(false)
      })
      .catch(error => {
        console.log('Error getting document:', error)
        setLoading(false)
      })
  }

  useEffect(() => {
    if (user === null) return

    fetchProjects()
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
    <MyProjectContext.Provider
      value={{ joinedProjects: projects, fetchProjects }}
    >
      <Container component="main" maxWidth="lg">
        <Card className={classes.card}>
          <CardContent>
            {loading ? (
              <Loading />
            ) : (
              <Box py={1}>
                <Typography gutterBottom variant="h6">
                  Joined
                </Typography>
                <Box ml={1}>{projectsLinks}</Box>
              </Box>
            )}
          </CardContent>
        </Card>
        <Invited />
      </Container>
    </MyProjectContext.Provider>
  )
}
