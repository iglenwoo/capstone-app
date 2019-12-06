import { FC, default as React, useContext, useState, useEffect } from 'react'
import { ProjectContext } from './index'
import { IDS, INTERESTS, SKILLS } from '../../constants/db.collections'
import { useAsyncEffect } from '../../utils/use-async-effect'
import { Auth, useAuth } from '../../components/FirebaseAuth/use-auth'
import * as firebase from 'firebase/app'
import { Id } from '../Profile/Ids'
import { Divider, Typography } from '@material-ui/core'
import { MembersList } from './MembersList'
import { SortedIdChips } from './SortedIdChips'
import {
  addIdHash,
  addInterestHash,
  addSkillHash,
  parseToIds,
  parseToInterests,
  parseToSkills,
} from './utils'
import { SortedSkillChips } from './SortedSkillChips'

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

export interface Interests {
  interests: string[]
  email: string
}
export interface InterestGroup extends CountableGroup {}

export const MembersTab: FC = () => {
  const { project } = useContext(ProjectContext)
  const { firestore }: Auth = useAuth()
  const [allMembers, setAllMembers] = useState<string[]>([])
  const [idGroups, setIdGroups] = useState<IdGroup[]>([])
  const [skillGroups, setSkillGroups] = useState<SkillGroup[]>([])
  const [interestGroups, setInterestGroups] = useState<InterestGroup[]>([])

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
      addSkillHash(skillHash, skillsList)

      const groups = Object.values(skillHash)
      groups.sort((a, b) => {
        return b.count - a.count
      })
      setSkillGroups(groups)
    } catch (e) {
      console.log('Error getting document:', e)
    }
  }

  const fetchMemberInterests = async () => {
    if (allMembers.length <= 0) return

    try {
      const interestHash: { [key: string]: InterestGroup } = {}
      const snapshot: firebase.firestore.QuerySnapshot = await firestore
        .collection(INTERESTS)
        .where('email', 'in', allMembers)
        .get()

      const interestsList: Interests[] = parseToInterests(snapshot)
      addInterestHash(interestHash, interestsList)

      const groups = Object.values(interestHash)
      groups.sort((a, b) => {
        return b.count - a.count
      })
      setInterestGroups(groups)
    } catch (e) {
      console.log('Error getting document:', e)
    }
  }

  useAsyncEffect(fetchMemberIds, [allMembers])
  useAsyncEffect(fetchMemberSkills, [allMembers])
  useAsyncEffect(fetchMemberInterests, [allMembers])

  return (
    <>
      <MembersList title="Members" members={allMembers} />
      <Divider />
      <Typography variant="h4">IDs</Typography>
      <SortedIdChips idGroups={idGroups} />
      <Divider />
      <h3>Skills</h3>
      <SortedSkillChips groups={skillGroups} />
      <Divider />
      <h3>Interests</h3>
      <SortedSkillChips groups={interestGroups} />
    </>
  )
}
