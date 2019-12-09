import React, { useContext } from 'react'
import {
  Box,
  createStyles,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core'
import { ProjectContext } from './index'
import { Auth, useAuth } from '../../components/FirebaseAuth/use-auth'
import { Invite } from './Invite'
import { MembersList } from './MembersList'
import { Loading } from '../../components/Loading'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    project: {
      marginBottom: theme.spacing(2),
    },
  })
)

export const SettingsTab = () => {
  const { user }: Auth = useAuth()
  const { loading, project } = useContext(ProjectContext)

  const classes = useStyles()

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          <Typography variant="h5" className={classes.project}>
            Project Code: {project.code}
          </Typography>
          {user && user.email === project.owner ? <Invite /> : <h5>Member</h5>}
          <Box>
            <MembersList title="Invited Members" members={project.members} />
          </Box>
        </>
      )}
    </>
  )
}
