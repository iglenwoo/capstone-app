import * as React from 'react'
import { FC } from 'react'

export const UserList: FC<{
  users?: any
}> = props => {
  const { users }: any = props

  return (
    <div>
      <h2>List of User name</h2>
      <p>(Saved on Sign Up in Firebase Database)</p>

      <ul>
        {Object.keys(users).map(key => {
          return <li key={key}>{users[key].username}</li>
        })}
      </ul>
    </div>
  )
}
