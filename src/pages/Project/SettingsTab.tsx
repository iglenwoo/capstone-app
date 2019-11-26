import React, { useContext } from 'react'
import { Box, CircularProgress } from '@material-ui/core'
import { ProjectContext } from './index'
import { Auth, useAuth } from '../../components/FirebaseAuth/use-auth'
import { Invite } from './Invite'
import { MembersList } from './MembersList'

export const SettingsTab = () => {
  const { user }: Auth = useAuth()
  const { loading, project } = useContext(ProjectContext)

  return (
    <>
      {loading ? (
        <Box display="flex" alignItems="center">
          <CircularProgress color="secondary" />
        </Box>
      ) : (
        <>
          <h2>{project.code}</h2>
          {user && user.email === project.owner ? <Invite /> : <h5>Member</h5>}
          <Box>
            <MembersList title="Invited Members" members={project.members} />
          </Box>
        </>
      )}
    </>
  )
}
