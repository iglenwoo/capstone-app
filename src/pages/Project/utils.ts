import { Id } from '../Profile/Ids'
import {
  IdGroup,
  IDs,
  InterestGroup,
  Interests,
  SkillGroup,
  Skills,
} from './MembersTab'

export const parseToIds = (idsOfMembers: IDs[]) => {
  let ids: Id[] = []
  idsOfMembers.forEach((idsOfMember: IDs) => {
    const idsProp: Id[] = idsOfMember.ids
    idsProp.forEach((id: Id) => {
      ids.push({
        ...id,
        email: idsOfMember.email,
        service: id.service.toLowerCase(),
      })
    })
  })

  return ids
}

export const addIdHash = (idHash: { [key: string]: IdGroup }, ids: Id[]) => {
  for (const id of ids) {
    if (idHash[id.service]) {
      idHash[id.service].count += 1
      idHash[id.service].emails = idHash[id.service].emails.concat(id.email)
      idHash[id.service].values = idHash[id.service].values.concat(id.value)
    } else {
      idHash[id.service] = {
        ...id,
        count: 1,
        emails: [id.email],
        values: [id.value],
      }
    }
  }
}

export const parseToSkills = (skillsList: Skills[]) => {
  skillsList.forEach((skills: Skills) => {
    skills.skills = skills.skills.map(s => s.toLowerCase())
  })
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

export const parseToInterests = (interestsList: Interests[]) => {
  interestsList.forEach((interests: Interests) => {
    interests.interests = interests.interests.map(i => i.toLowerCase())
  })
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
