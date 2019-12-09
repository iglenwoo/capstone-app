import React, { FC } from 'react'
import { Box, Typography } from '@material-ui/core'

export const MembersList: FC<{
  title?: string
  members: string[]
}> = props => {
  return props.members ? (
    <Box m={1}>
      {props.title && (
        <Box mx={1}>
          <Typography variant="h4">{props.title}</Typography>
        </Box>
      )}
      {props.members.map((m, i) => (
        <Box key={`${m}-${i}`} ml={2}>
          <Typography variant="body1">{m}</Typography>
        </Box>
      ))}
    </Box>
  ) : (
    <div>No member...</div>
  )
}
