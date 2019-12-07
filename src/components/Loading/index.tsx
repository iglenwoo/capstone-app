import React, { FC } from 'react'
import { Box, CircularProgress } from '@material-ui/core'

export const Loading: FC = () => {
  return (
    <Box display="flex" alignItems="center" justifyContent="center" p={1}>
      <CircularProgress color="secondary" />
    </Box>
  )
}
