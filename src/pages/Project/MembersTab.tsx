import { FC, default as React, useContext } from 'react'
import { ProjectContext } from './index'
import { IDS } from '../../constants/db.collections'
import { useAsyncEffect } from '../../utils/use-async-effect'
import { Auth, useAuth } from '../../components/FirebaseAuth/use-auth'

// TODO: members IDS, SKILLS, INTERESTS
export const MembersTab: FC = () => {
  const { project } = useContext(ProjectContext)
  const { firestore }: Auth = useAuth()

  const fetchMemberIds = async () => {
    try {
      //todo: move this to MembersTab
      for (const member of project.members) {
        console.log('member', member)
        const idDoc = await firestore
          .collection(IDS)
          .doc(member)
          .get()
        console.log('isDoc', idDoc)
      }
    } catch (e) {
      console.log('Error getting document:', e)
    }
  }

  useAsyncEffect(fetchMemberIds, [])

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
