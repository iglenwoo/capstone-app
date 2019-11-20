import * as React from 'react'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Box, CircularProgress } from '@material-ui/core'
import { Auth, useAuth } from '../../components/FirebaseAuth/use-auth'

interface Project {
  code: string
  owner: string
  members?: string[]
}

export const ProjectInfo = () => {
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

  return (
    <Box>
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
        <Box display="flex" alignItems="center">
          <CircularProgress color="secondary" />
        </Box>
      )}
    </Box>
  )
}
