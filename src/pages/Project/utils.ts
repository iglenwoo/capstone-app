import { Id } from '../Profile/Ids'
import {
  IdGroup,
  IDs,
  InterestGroup,
  Interests,
  SkillGroup,
  Skills,
} from './MembersTab'
import { Members } from './model'

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

export const addIdHash = (
  idHash: { [key: string]: IdGroup },
  ids: Id[],
  members: Members
) => {
  for (const id of ids) {
    if (idHash[id.service]) {
      idHash[id.service].count += 1
      idHash[id.service].emails = idHash[id.service].emails.concat(id.email)
      idHash[id.service].values = idHash[id.service].values.concat(id.value)
      idHash[id.service].firstNames = idHash[id.service].firstNames.concat(
        members[id.email].firstName
      )
      idHash[id.service].lastNames = idHash[id.service].lastNames.concat(
        members[id.email].lastName
      )
    } else {
      idHash[id.service] = {
        ...id,
        count: 1,
        emails: [id.email],
        values: [id.value],
        firstNames: [members[id.email].firstName],
        lastNames: [members[id.email].lastName],
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
  skillsList: Skills[],
  members: Members
) => {
  for (const skills of skillsList) {
    skills.skills.forEach(skill => {
      if (skillHash[skill]) {
        skillHash[skill].count += 1
        skillHash[skill].emails = skillHash[skill].emails.concat(skills.email)
        skillHash[skill].firstNames = skillHash[skill].firstNames.concat(
          members[skills.email].firstName
        )
        skillHash[skill].lastNames = skillHash[skill].lastNames.concat(
          members[skills.email].lastName
        )
      } else {
        skillHash[skill] = {
          name: skill,
          count: 1,
          emails: [skills.email],
          firstNames: [members[skills.email].firstName],
          lastNames: [members[skills.email].lastName],
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
  interestsList: Interests[],
  members: Members
) => {
  for (const interests of interestsList) {
    interests.interests.forEach(interest => {
      if (interestHash[interest]) {
        interestHash[interest].count += 1
        interestHash[interest].emails = interestHash[interest].emails.concat(
          interests.email
        )
        interestHash[interest].firstNames = interestHash[
          interest
        ].firstNames.concat(members[interests.email].firstName)
        interestHash[interest].lastNames = interestHash[
          interest
        ].lastNames.concat(members[interests.email].lastName)
      } else {
        interestHash[interest] = {
          name: interest,
          count: 1,
          emails: [interests.email],
          firstNames: [members[interests.email].firstName],
          lastNames: [members[interests.email].lastName],
        }
      }
    })
  }
}
