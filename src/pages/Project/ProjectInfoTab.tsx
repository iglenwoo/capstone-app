import * as React from 'react'
import { FC, useContext } from 'react'
import {
  Box,
  createStyles,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core'
import { ProjectContext } from './index'
import { Loading } from '../../components/Loading'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    project: {
      marginBottom: theme.spacing(2),
    },
  })
)

export interface Project {
  code: string
  owner: string
  members: string[]
}

export const ProjectInfoTab: FC = () => {
  const { loading, project } = useContext(ProjectContext)

  // todo: Show project details
  // todo: Edit project details

  const classes = useStyles()

  return (
    <Box>
      {loading ? (
        <Loading />
      ) : (
        <div>
          <Typography variant="h5" className={classes.project}>
            Project Code: {project.code}
          </Typography>
          <Typography variant="h6" className={classes.project}>
            Owner: {project.owner}
          </Typography>
          {/*<Typography variant="h6" className={classes.project}>*/}
          {/*  Title*/}
          {/*</Typography>*/}
          {/*<Typography variant="h6" className={classes.project}>*/}
          {/*  Description*/}
          {/*</Typography>*/}
          {/*<Typography variant="h6" className={classes.project}>*/}
          {/*  Source Code Repositories*/}
          {/*</Typography>*/}
        </div>
      )}
    </Box>
  )
}
