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
} from '@material-ui/core'
import { Link } from 'react-router-dom'
import * as routes from '../../constants/routes'
import { USERS } from '../../constants/db.collections'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      marginTop: theme.spacing(2),
    },
  })
)

export const MyProjects = () => {
  const { user, firestore }: Auth = useAuth()
  const [projects, setProjects] = useState<string[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    if (user === null) return

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
  }, [user, firestore])

  const projectLinks = projects.map((p, i) => {
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

  const classes = useStyles()

  return (
    <Container component="main" maxWidth="lg">
      <Card className={classes.card}>
        <CardContent>
          {loading ? (
            <Box display="flex" alignItems="center">
              <CircularProgress color="secondary" />
            </Box>
          ) : (
            <>{projectLinks}</>
          )}
        </CardContent>
      </Card>
    </Container>
  )
}
