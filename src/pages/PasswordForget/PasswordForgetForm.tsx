import * as React from 'react'
import { FC, useState } from 'react'

export const PasswordForgetForm: FC = () => {
  const [isInvalid, setIsInvalid] = useState(true)
  const [email, setEmail] = useState('')
  const [error, setError] = useState()

  const onSubmit = (event: any) => {
    event.preventDefault()
  }

  return (
    <form onSubmit={event => onSubmit(event)}>
      <input
        value={email}
        onChange={e => setEmail(e.currentTarget.value)}
        type="text"
        placeholder="Email Address"
      />
      <button disabled={isInvalid} type="submit">
        Reset My Password
      </button>

      {error && <p>{error.message}</p>}
    </form>
  )
}
