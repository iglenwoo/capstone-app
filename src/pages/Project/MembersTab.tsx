import { FC, default as React, useContext, useState, useEffect } from 'react'
import { ProjectContext } from './index'
import { IDS, SKILLS } from '../../constants/db.collections'
import { useAsyncEffect } from '../../utils/use-async-effect'
import { Auth, useAuth } from '../../components/FirebaseAuth/use-auth'
import * as firebase from 'firebase/app'
import { Id } from '../Profile/Ids'
import { Divider, Typography } from '@material-ui/core'
import { MembersList } from './MembersList'
import { SortedIdChips } from './SortedIdChips'
import { addIdHash, addSkillHash, parseToIds, parseToSkills } from './utils'
import { SortedSkillChips } from './SortedSkillChips'

// TODO: members SKILLS, INTERESTS
export interface CountableGroup {
  name?: string // todo: refactor to have this value
  count: number
  emails: string[]
}
export interface IdGroup extends Id, CountableGroup {}

export interface Skills {
  skills: string[]
  email: string
}
export interface SkillGroup extends CountableGroup {}

export const MembersTab: FC = () => {
  const { project } = useContext(ProjectContext)
  const { firestore }: Auth = useAuth()
  const [allMembers, setAllMembers] = useState<string[]>([])
  const [idGroups, setIdGroups] = useState<IdGroup[]>([])
  const [skillGroups, setSkillGroups] = useState<SkillGroup[]>([])

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

  const fetchMemberSkills = async () => {
    if (allMembers.length <= 0) return

    try {
      const skillHash: { [key: string]: SkillGroup } = {}
      const snapshot: firebase.firestore.QuerySnapshot = await firestore
        .collection(SKILLS)
        .where('email', 'in', allMembers)
        .get()

      const skillsList: Skills[] = parseToSkills(snapshot)
      console.log('skillsList', skillsList)
      addSkillHash(skillHash, skillsList)
      console.log('skillHash', skillHash)

      const groups = Object.values(skillHash)
      groups.sort((a, b) => {
        return b.count - a.count
      })
      setSkillGroups(groups)
    } catch (e) {
      console.log('Error getting document:', e)
    }
  }

  useAsyncEffect(fetchMemberIds, [allMembers])
  useAsyncEffect(fetchMemberSkills, [allMembers])

  return (
    <>
      <MembersList title="Members" members={allMembers} />
      <Divider />
      <Typography variant="h4">IDs</Typography>
      <SortedIdChips idGroups={idGroups} />
      <Divider />
      <h3>Skills</h3>
      <SortedSkillChips skillGroups={skillGroups} />
      <Divider />
      <h3>Interests</h3>
    </>
  )
}
