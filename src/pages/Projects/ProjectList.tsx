import React, { FC } from 'react'
import { useHistory } from 'react-router-dom'
import * as routes from '../../constants/routes'
import {
  createStyles,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Theme,
} from '@material-ui/core'
import { KeyboardArrowRight as KeyboardArrowRightIcon } from '@material-ui/icons'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      backgroundColor: theme.palette.background.paper,
    },
    project: {
      // width: '30%',
    },
  })
)

export const ProjectList: FC<{
  projects: string[]
}> = props => {
  const classes = useStyles()
  const history = useHistory()

  const openProject = (p: string) => {
    history.push(`${routes.PROJECTS}/${p}`)
  }

  return (
    <List className={classes.root}>
      {props.projects.map((p: string, i) => (
        <ListItem
          key={`${p}-${i}`}
          dense
          button
          onClick={() => {
            openProject(p)
          }}
        >
          <ListItemIcon>
            <KeyboardArrowRightIcon />
          </ListItemIcon>
          <ListItemText className={classes.project} primary={p} />
        </ListItem>
      ))}
      {props.projects.length === 0 && <EmptyListItem />}
    </List>
  )
}

export const EmptyListItem: FC = () => (
  <ListItem dense>
    <ListItemText primary="Empty..." />
  </ListItem>
)
