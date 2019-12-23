import React, { FC } from 'react'
import {
  Box,
  createStyles,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core'
import { Person as PersonIcon } from '@material-ui/icons'
import { Members } from './model'

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
  members: Members
}> = props => {
  const classes = useStyles()

  return Object.keys(props.members).length ? (
    <Box m={1} className={classes.root}>
      {props.title && (
        <Box mx={1}>
          <Typography variant="h4">{props.title}</Typography>
        </Box>
      )}
      {Object.keys(props.members).map((email, i) => (
        <Box key={`${email}-${i}`} ml={2} className={classes.row}>
          <PersonIcon className={classes.icon} />
          <Typography
            display="inline"
            variant="body1"
            className={classes.member}
          >
            {email}
          </Typography>
        </Box>
      ))}
    </Box>
  ) : (
    <div>No member...</div>
  )
}
