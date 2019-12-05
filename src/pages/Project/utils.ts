import * as firebase from 'firebase'
import { Id } from '../Profile/Ids'
import { IdGroup } from './MembersTab'

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
