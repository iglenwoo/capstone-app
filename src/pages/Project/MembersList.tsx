import React, { FC } from 'react'

export const MembersList: FC<{
  title: string
  members: string[]
}> = props => {
  return props.members ? (
    <>
      <h2>{props.title}</h2>
      {props.members.map((m, i) => (
        <h5 key={`${m}-${i}`}>{m}</h5>
      ))}
    </>
  ) : (
    <div>No member...</div>
  )
}
