import * as React from 'react'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import {
  Card,
  CardContent,
  Container,
  createStyles,
  makeStyles,
  Theme,
} from '@material-ui/core'
import { Auth, useAuth } from '../../components/FirebaseAuth/use-auth'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      marginTop: theme.spacing(1),
    },
  })
)

interface Project {
  code: string
  owner: string
  members?: string[]
}

export const Project = () => {
  const { user, firestore }: Auth = useAuth()
  const { code } = useParams()
  const [project, setProject] = useState<Project | null>(null)

  useEffect(() => {
    if (user === null) return

    firestore
      .collection('projects')
      .doc(code)
      .get()
      .then(doc => {
        const data = doc.data()
        setProject(data as Project)
      })
      .catch(error => {
        console.log('Error getting document:', error)
      })
  }, [code, user, firestore])

  const classes = useStyles()

  return (
    <Container component="main" maxWidth="lg">
      <Card className={classes.card}>
        <CardContent>
          {project ? (
            <div>
              <h2>Project: {project.code}</h2>
              <h2>Owner: {project.owner}</h2>
              {project.members ? (
                <>
                  <h2>Member</h2>
                  {project.members.map((p, i) => (
                    <h2 key={`${p}-${i}`}>{p}</h2>
                  ))}
                </>
              ) : (
                <div>No member...</div>
              )}
            </div>
          ) : (
            <div>Empty project</div>
          )}
        </CardContent>
      </Card>
    </Container>
  )
}
