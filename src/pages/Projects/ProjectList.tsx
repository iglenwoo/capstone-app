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
  Typography,
} from '@material-ui/core'
import { DoubleArrowSharp as DoubleArrowIcon } from '@material-ui/icons'

export const ProjectList: FC<{
  projects: string[]
}> = props => {
  const history = useHistory()

  const openProject = (p: string) => {
    history.push(`${routes.PROJECTS}/${p}`)
  }

  return (
    <List dense>
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
            <DoubleArrowIcon />
          </ListItemIcon>
          <ListItemText>
            <Typography>{p}</Typography>
          </ListItemText>
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
