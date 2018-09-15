export interface GitHubRepository {
  owner: string
  name: string
}

export interface GitHubProjectCard {
  id: string
  note?: string
  issue?: {
    id: string
    title: string
    number: number
    auther: string
    url: string
  }
}

export interface GitHubProjectColumn {
  id: string
  name: string
  cards: GitHubProjectCard[]
}

export interface GitHubProject {
  identifier: GithubProjectIdentifier
  url: string
  slug: string
  name: string
  columns: GitHubProjectColumn[]
}

export interface GitHubRepoProjectIdentifier {
  repository: GitHubRepository
  number: number
}

export interface GitHubOrgProjectIdentifier {
  organization: string
  number: number
}

export type GithubProjectIdentifier =
  | GitHubRepoProjectIdentifier
  | GitHubOrgProjectIdentifier

export interface GitHubProjectColumnIdentifier {
  project: GithubProjectIdentifier
  id: string
}
