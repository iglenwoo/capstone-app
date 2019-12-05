import { FC, default as React, useContext, useState, useEffect } from 'react'
import { ProjectContext } from './index'
import { IDS } from '../../constants/db.collections'
import { useAsyncEffect } from '../../utils/use-async-effect'
import { Auth, useAuth } from '../../components/FirebaseAuth/use-auth'
import * as firebase from 'firebase/app'
import { Id } from '../Profile/Ids'
import { Divider, Typography } from '@material-ui/core'
import { MembersList } from './MembersList'
import { SortedIdChips } from './SortedIdChips'
import { addIdHash, parseToIds } from './utils'

// TODO: members SKILLS, INTERESTS
export interface IdGroup extends Id {
  count: number
  emails: string[]
}

export const MembersTab: FC = () => {
  const { project } = useContext(ProjectContext)
  const { firestore }: Auth = useAuth()
  const [allMembers, setAllMembers] = useState<string[]>([])
  const [idGroups, setIdGroups] = useState<IdGroup[]>([])

  useEffect(() => {
    if (project.owner && project.members.length > 0) {
      setAllMembers([...project.members, project.owner])
    }
  }, [project.owner, project.members])

  const fetchMemberIds = async () => {
    if (allMembers.length <= 0) return

    try {
      const idHash: { [key: string]: IdGroup } = {}
      const idDoc: firebase.firestore.QuerySnapshot = await firestore
        .collection(IDS)
        .where('email', 'in', allMembers)
        .get()

      const ids: Id[] = parseToIds(idDoc)
      addIdHash(idHash, ids)

      const groups = Object.values(idHash)
      groups.sort((a, b) => {
        return b.count - a.count
      })
      setIdGroups(groups)
    } catch (e) {
      console.log('Error getting document:', e)
    }
  }

  useAsyncEffect(fetchMemberIds, [allMembers])

  return (
    <>
      <MembersList title="Members" members={allMembers} />
      <Divider />
      <Typography variant="h4">IDs</Typography>
      <SortedIdChips idGroups={idGroups} />
      <Divider />
      <h3>Skills</h3>
      <Divider />
      <h3>Interests</h3>
    </>
  )
}
