import React, { createContext, useCallback, useEffect, useState } from 'react'
import { Auth, useAuth } from '../../components/FirebaseAuth/use-auth'
import {
  Box,
  Card,
  CardContent,
  Container,
  createStyles,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core'
import { USERS } from '../../constants/db.collections'
import { Loading } from '../../components/Loading'
import { Invitations } from './Invitations'
import { Create } from './Create'
import { ProjectList } from './ProjectList'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      marginTop: theme.spacing(2),
    },
  })
)

export const ProjectsContext = createContext<{
  joinedProjects: string[]
  fetchProjects: () => void
}>({
  joinedProjects: [],
  fetchProjects: () => {},
})

export const Projects = () => {
  const { user, firestore }: Auth = useAuth()
  const [projects, setProjects] = useState<string[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  const fetchProjects = useCallback(() => {
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
  }, [firestore, user])

  useEffect(() => {
    if (user === null) return

    fetchProjects()
  }, [user, firestore, fetchProjects])

  const classes = useStyles()

  return (
    <ProjectsContext.Provider
      value={{ joinedProjects: projects, fetchProjects }}
    >
      <Container component="main" maxWidth="lg">
        <Create />
        <Card className={classes.card}>
          <CardContent>
            {loading ? (
              <Loading />
            ) : (
              <Box py={1}>
                <Typography gutterBottom variant="h6">
                  My Projects
                </Typography>
                <ProjectList projects={projects} />
              </Box>
            )}
          </CardContent>
        </Card>
        <Invitations />
      </Container>
    </ProjectsContext.Provider>
  )
}
