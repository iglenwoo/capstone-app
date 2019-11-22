import * as React from 'react'
import { useContext } from 'react'
import { Box, CircularProgress } from '@material-ui/core'
import { Auth, useAuth } from '../../components/FirebaseAuth/use-auth'
import { ProjectContext } from './index'

export interface Project {
  code: string
  owner: string
  members?: string[]
}

export const ProjectInfo = () => {
  const { loading, project } = useContext(ProjectContext)

  return (
    <Box>
      {loading ? (
        <Box display="flex" alignItems="center">
          <CircularProgress color="secondary" />
        </Box>
      ) : (
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
      )}
    </Box>
  )
}
