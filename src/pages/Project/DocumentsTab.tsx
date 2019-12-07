import { FC, default as React, useContext } from 'react'
import { ProjectContext } from './index'
import { useAuth } from '../../components/FirebaseAuth/use-auth'
import { useAsyncEffect } from '../../utils/use-async-effect'
import * as firebase from 'firebase'
import { DOCUMENTS, PROJECTS } from '../../constants/routes'

// TODO: DocumentsTab
/*
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
  const { firestore } = useAuth()

  const fetchDocs = async () => {
    if (!project.code) return

    try {
      const snapshot: firebase.firestore.QuerySnapshot = await firestore
        .collection(PROJECTS)
        .doc(project.code)
        .collection(DOCUMENTS)
        .get()

      snapshot.forEach(result => {
        console.log('result', result)
      })
    } catch (e) {
      console.log('Error getting document:', e)
    }
  }

  useAsyncEffect(fetchDocs, [project.code])

  return (
    <>
      <h2>Documents</h2>
      <h5>{project.code}</h5>
    </>
  )
}
