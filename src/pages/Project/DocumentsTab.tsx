import { FC, default as React, useContext } from 'react'
import { ProjectContext } from './index'

// TODO: DocumentsTab
export const DocumentsTab: FC = () => {
  const { project } = useContext(ProjectContext)

  return (
    <>
      <h2>Documents</h2>
      <h5>{project.code}</h5>
    </>
  )
}
