import { FC, default as React, useContext } from 'react'
import { ProjectContext } from './index'

// TODO: DocumentsTab
/*
  [ ] design /documents/ rules in firestore
  [ ] add a document in firestore to test
  [ ] fetch the doc
  [ ] find a lib for text editor
  [ ] npm add XXX
  [ ] view(render) the doc
  [ ] add new doc
  [ ] edit a doc -> save
  [ ] design side tabs and main doc body
*/
export const DocumentsTab: FC = () => {
  const { project } = useContext(ProjectContext)

  return (
    <>
      <h2>Documents</h2>
      <h5>{project.code}</h5>
    </>
  )
}
