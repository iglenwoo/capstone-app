import { FC, default as React, useContext } from 'react'
import { ProjectContext } from './index'

const MembersTab: FC = () => {
  const { project } = useContext(ProjectContext)

  return project.members ? (
    <>
      <h2>Member</h2>
      {project.members.map((p, i) => (
        <h5 key={`${p}-${i}`}>{p}</h5>
      ))}
    </>
  ) : (
    <div>No member...</div>
  )
}
