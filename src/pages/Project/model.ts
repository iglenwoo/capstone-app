export enum MemberRole {
  Owner = 'owner',
  Member = 'member',
}
export enum MemberStatus {
  Own = 'own',
  Invited = 'invited',
  Accepted = 'accepted',
}
export interface Member {
  email: string
  role: MemberRole
  status: MemberStatus
}

export interface Project {
  code: string
  members: Member[]
  title: string
  desc: string
  isOwned?: boolean
}
