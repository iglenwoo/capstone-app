import React, { useContext } from 'react'
import { Box } from '@material-ui/core'
import { ProjectContext } from './index'
import { Auth, useAuth } from '../../components/FirebaseAuth/use-auth'
import { Invite } from './Invite'
import { MembersList } from './MembersList'
import { Loading } from '../../components/Loading'

export const SettingsTab = () => {
  const { user }: Auth = useAuth()
  const { loading, project } = useContext(ProjectContext)

  return (
    <>
      {loading ? (
        <Loading />
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
