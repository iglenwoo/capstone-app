import React, { FC } from 'react'
import {
  Box,
  createStyles,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core'
import { Person as PersonIcon } from '@material-ui/icons'
import { Member } from './model'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    row: {
      textAlign: 'center',
    },
    icon: {
      display: 'inline',
      position: 'relative',
      verticalAlign: 'center',
    },
    member: {
      verticalAlign: 'center',
    },
  })
)

export const MembersList: FC<{
  title?: string
  members: Member[]
}> = props => {
  const classes = useStyles()

  return props.members ? (
    <Box m={1} className={classes.root}>
      {props.title && (
        <Box mx={1}>
          <Typography variant="h4">{props.title}</Typography>
        </Box>
      )}
      {props.members.map((m, i) => (
        <Box key={`${m.email}-${i}`} ml={2} className={classes.row}>
          <PersonIcon className={classes.icon} />
          <Typography
            display="inline"
            variant="body1"
            className={classes.member}
          >
            {m.email}
          </Typography>
        </Box>
      ))}
    </Box>
  ) : (
    <div>No member...</div>
  )
}
