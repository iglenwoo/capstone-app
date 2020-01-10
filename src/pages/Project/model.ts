export enum MemberRole {
  Owner = 'owner',
  Member = 'member',
}
export enum MemberStatus {
  Own = 'own',
  Invited = 'invited',
  Accepted = 'accepted',
}
export interface Members {
  [email: string]: Member
}
export interface Member {
  role: MemberRole
  status: MemberStatus
  firstName: string
  lastName: string
}

export interface Project {
  code: string
  members: Members
  title: string
  desc: string
  isOwned?: boolean
}
