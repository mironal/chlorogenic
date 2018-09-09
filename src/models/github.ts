import { createModel, ModelConfig } from "@rematch/core"
import {
  fetchOrganizationProject,
  fetchRepositoryProject,
} from "../github/runner"
import {
  isGithubOrgProjectIdentifier,
  isGithubRepoProjectIdentifier,
} from "../misc/project"

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

export interface GitHubModel {
  loading: boolean
  identifier?: GithubProjectIdentifier
  project?: GitHubProject
  error?: Error
}

export default createModel<GitHubModel, ModelConfig<GitHubModel>>({
  effects: dispatch => ({
    async fetchProject({
      token,
      identifier,
    }: {
      token: string
      identifier: GithubProjectIdentifier
    }) {
      this.setError(undefined)
      try {
        if (!token || !identifier) {
          throw new Error("Invalid payload. token and identifier are required.")
        }

        this.setLoading(true)
        if (isGithubRepoProjectIdentifier(identifier)) {
          const project = await fetchRepositoryProject(token, identifier)
          this.setProject(project)
        } else if (isGithubOrgProjectIdentifier(identifier)) {
          const project = await fetchOrganizationProject(token, identifier)
          this.setProject(project)
        }

        this.setLoading(false)
      } catch (error) {
        this.setLoading(false)
        this.setError(error)
      }
    },
  }),
  reducers: {
    clear: state => {
      return {
        loading: false,
      }
    },
    setError: (state, error) => {
      return { ...state, error }
    },
    setLoading: (state, loading) => {
      return { ...state, loading }
    },
    setProject: (state, project) => {
      return {
        ...state,
        project,
      }
    },
  },
  state: {
    loading: false,
  },
})
