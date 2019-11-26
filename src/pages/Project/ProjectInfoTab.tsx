import * as React from 'react'
import { FC, useContext } from 'react'
import { Box, CircularProgress } from '@material-ui/core'
import { ProjectContext } from './index'

export interface Project {
  code: string
  owner: string
  members: string[]
}

export const ProjectInfoTab: FC = () => {
  const { loading, project } = useContext(ProjectContext)

  // todo: Show project details
  // todo: Edit project details

  return (
    <Box>
      {loading ? (
        <Box display="flex" alignItems="center">
          <CircularProgress color="secondary" />
        </Box>
      ) : (
        <div>
          <h2>Project Code: {project.code}</h2>
          <h5>Owner: {project.owner}</h5>
          <h3>Title</h3>
          <h3>Description</h3>
          <h3>Source Code Repositories</h3>
        </div>
      )}
    </Box>
  )
}
