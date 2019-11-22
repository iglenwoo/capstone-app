import * as React from 'react'
import { useParams } from 'react-router-dom'
import { Box, Typography } from '@material-ui/core'

export const Settings = () => {
  const { code } = useParams()

  return (
    <Box>
      <Typography component="h2">{code}</Typography>
    </Box>
  )
}
