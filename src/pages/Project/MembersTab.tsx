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
  emails: string[]
}

const parseToIds = (idDoc: firebase.firestore.QuerySnapshot) => {
  let ids: Id[] = []
  if (!idDoc.empty) {
    idDoc.forEach(result => {
      const data = result.data()
      if (data && data.ids) {
        const idsProp: Id[] = data.ids
        idsProp.forEach((id: Id) => {
          ids.push({ ...id, service: id.service.toLowerCase() })
        })
      }
    })
  }

  return ids
}

const addIdHash = (idHash: { [key: string]: IdGroup }, ids: Id[]) => {
  for (const id of ids) {
    if (idHash[id.service]) {
      idHash[id.service].count += 1
      idHash[id.service].emails = idHash[id.service].emails.concat(id.email)
    } else {
      idHash[id.service] = {
        ...id,
        count: 1,
        emails: [id.email],
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
      {idGroups.map((g, i) => (
        <Box key={`${g.service}-${i}`} ml={1}>
          <Typography variant="body1">Service: {g.service}</Typography>
          <Typography variant="body1">Count: {g.count}</Typography>
        </Box>
      ))}
      <Divider />
      <h3>Skills</h3>
      <Divider />
      <h3>Interests</h3>
    </>
  )
}
