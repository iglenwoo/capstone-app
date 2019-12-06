import * as firebase from 'firebase'
import { Id } from '../Profile/Ids'
import {
  IdGroup,
  InterestGroup,
  Interests,
  SkillGroup,
  Skills,
} from './MembersTab'

export const parseToIds = (idDoc: firebase.firestore.QuerySnapshot) => {
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

export const addIdHash = (idHash: { [key: string]: IdGroup }, ids: Id[]) => {
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

export const parseToSkills = (snapshot: firebase.firestore.QuerySnapshot) => {
  let skillsList: Skills[] = []
  if (!snapshot.empty) {
    snapshot.forEach(result => {
      const data = result.data()
      if (!data) throw new Error('Data in skills snapshot is empty')
      console.log('data', data)
      if (!data.email) throw new Error('Data.email in skills snapshot is empty')
      if (!data.skills)
        throw new Error('Data.skills in skills snapshot is empty')
      const skills: Skills = data as Skills
      skills.skills = skills.skills.map(s => s.toLowerCase())
      skillsList.push(skills)
    })
  }

  return skillsList
}

export const addSkillHash = (
  skillHash: { [key: string]: SkillGroup },
  skillsList: Skills[]
) => {
  for (const skills of skillsList) {
    skills.skills.forEach(skill => {
      if (skillHash[skill]) {
        skillHash[skill].count += 1
        skillHash[skill].emails = skillHash[skill].emails.concat(skills.email)
      } else {
        skillHash[skill] = {
          name: skill,
          count: 1,
          emails: [skills.email],
        }
      }
    })
  }
}

export const parseToInterests = (
  snapshot: firebase.firestore.QuerySnapshot
) => {
  let interestsList: Interests[] = []
  if (!snapshot.empty) {
    snapshot.forEach(result => {
      const data = result.data()
      if (!data) throw new Error('Data in skills snapshot is empty')
      console.log('data', data)
      if (!data.email) throw new Error('Data.email in skills snapshot is empty')
      if (!data.interests)
        throw new Error('Data.interests in skills snapshot is empty')
      const interests: Interests = data as Interests
      interests.interests = interests.interests.map(i => i.toLowerCase())
      interestsList.push(interests)
    })
  }

  return interestsList
}

export const addInterestHash = (
  interestHash: { [key: string]: InterestGroup },
  interestsList: Interests[]
) => {
  for (const interests of interestsList) {
    interests.interests.forEach(interest => {
      if (interestHash[interest]) {
        interestHash[interest].count += 1
        interestHash[interest].emails = interestHash[interest].emails.concat(
          interests.email
        )
      } else {
        interestHash[interest] = {
          name: interest,
          count: 1,
          emails: [interests.email],
        }
      }
    })
  }
}
