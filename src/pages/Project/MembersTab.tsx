import { FC, default as React, useContext, useState, useEffect } from 'react'
import { ProjectContext } from './index'
import { IDS } from '../../constants/db.collections'
import { useAsyncEffect } from '../../utils/use-async-effect'
import { Auth, useAuth } from '../../components/FirebaseAuth/use-auth'
import * as firebase from 'firebase/app'
import { Id } from '../Profile/Ids'
import { Box, Divider, Typography } from '@material-ui/core'
import { MembersList } from './MembersList'

// TODO: members IDS, SKILLS, INTERESTS
export interface IdGroup extends Id {
  count: number
  email: string[]
}

const parseToIds = (idDoc: firebase.firestore.DocumentSnapshot) => {
  let ids: Id[] = []
  if (idDoc.exists) {
    const data = idDoc.data()
    if (data && data.ids) {
      const idsProp: Id[] = data.ids
      ids = idsProp.map((id: Id) => {
        return { ...id, service: id.service.toLowerCase() }
      })
    }
  }

  return ids
}

const addIdHash = (
  idHash: { [key: string]: IdGroup },
  ids: Id[],
  member: string
) => {
  for (const id of ids) {
    if (idHash[id.service]) {
      idHash[id.service].count += 1
      idHash[id.service].email = idHash[id.service].email.concat(member)
    } else {
      idHash[id.service] = {
        ...id,
        count: 1,
        email: [member],
      }
    }
  }
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
      for (const member of allMembers) {
        const idDoc: firebase.firestore.DocumentSnapshot = await firestore
          .collection(IDS)
          .doc(member)
          .get()

        const ids: Id[] = parseToIds(idDoc)
        addIdHash(idHash, ids, member)
      }

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
      <h3>IDs</h3>
      {idGroups.map((g, i) => (
        <Box key={`${g.service}-${i}`}>
          <Typography>Service: {g.service}</Typography>
          <Typography>Count: {g.count}</Typography>
        </Box>
      ))}
      <Divider />
      <h3>Skills</h3>
      <Divider />
      <h3>Interests</h3>
    </>
  )
}
