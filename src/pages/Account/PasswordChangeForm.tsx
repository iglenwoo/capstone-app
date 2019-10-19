import * as React from 'react'
import { FC } from 'react'
import { useState } from 'react'

export const PasswordChangeForm: FC = () => {
  const [passwordOne, setPasswordOne] = useState('')
  const [passwordTwo, setPasswordTwo] = useState('')
  const [isInvalid, setIsInvalid] = useState(true)
  const [error, setError] = useState()

  const onSubmit = (event: any) => {
    event.preventDefault()
  }

  return (
    <form onSubmit={event => onSubmit(event)}>
      <input
        value={passwordOne}
        onChange={event => setPasswordOne(event.currentTarget.value)}
        type="password"
        placeholder="New Password"
      />
      <input
        value={passwordTwo}
        onChange={event => setPasswordTwo(event.currentTarget.value)}
        type="password"
        placeholder="Confirm New Password"
      />
      <button disabled={isInvalid} type="submit">
        Reset My Password
      </button>

      {error && <p>{error.message}</p>}
    </form>
  )
}
