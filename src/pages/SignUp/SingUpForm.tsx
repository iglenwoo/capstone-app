import * as React from 'react'
import { FC, SyntheticEvent, useState } from 'react'

export const SignUpForm: FC = () => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [passwordOne, setPasswordOne] = useState('')
  const [passwordTwo, setPasswordTwo] = useState('')
  const [isInvalid, setIsInvalid] = useState(true)
  const [error, setError] = useState()

  const onSubmit = (event: SyntheticEvent) => {
    event.preventDefault()
  }

  return (
    <form onSubmit={event => onSubmit(event)}>
      <input
        value={username}
        onChange={event => setUsername(event.currentTarget.value)}
        type="text"
        placeholder="Full Name"
      />
      <input
        value={email}
        onChange={event => setEmail(event.currentTarget.value)}
        type="text"
        placeholder="Email Address"
      />
      <input
        value={passwordOne}
        onChange={event => setPasswordTwo(event.currentTarget.value)}
        type="password"
        placeholder="Password"
      />
      <input
        value={passwordTwo}
        onChange={event => setPasswordTwo(event.currentTarget.value)}
        type="password"
        placeholder="Confirm Password"
      />
      <button disabled={isInvalid} type="submit">
        Sign Up
      </button>

      {error && <p>{error.message}</p>}
    </form>
  )
}
