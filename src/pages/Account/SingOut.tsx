import { useAuth } from '../../components/FirebaseAuth/use-auth'
import * as React from 'react'
import { Button } from '@material-ui/core'

export const SignOut = () => {
  const { signout } = useAuth()

  const onClick = () => {
    signout()
  }

  return (
    <div>
      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="secondary"
        onClick={onClick}
      >
        Sign Out
      </Button>
    </div>
  )
}
