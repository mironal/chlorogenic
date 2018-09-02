import { createModel, ModelConfig } from "@rematch/core"
import {
  fetchProjectColumnsAndCards,
  fetchProjects,
  fetchRepositories,
} from "../github/runner"

export interface GitHubRepository {
  owner: string
  name: string
}

export interface GitHubProjectCard {
  id: string
  note?: string
  issue?: { title: string; number: number; auther: string; url: string }
}

export interface GitHubProjectColumn {
  id: string
  name: string
  cards: GitHubProjectCard[]
}

export interface GitHubProject {
  repo: GitHubRepository
  name: string
  number: number
  columns?: GitHubProjectColumn[]
}

export interface GitHubModel {
  loading: boolean
  repositories: { [slug: /* owner/name */ string]: GitHubRepository }
  projects: {
    [slug: string]: GitHubProject[]
  }
  displayProject?: GitHubProject
  error?: Error
}

export default createModel<GitHubModel, ModelConfig<GitHubModel>>({
  effects: dispatch => ({
    async displayProject({
      token,
      project,
    }: {
      token: string
      project: GitHubProject
    }) {
      this.setDisplayProject(undefined)
      await this.fetchColumnsAndCards({ token, project })
      this.setDisplayProject(project)
    },
    async fetchProjects({
      token,
      repo,
    }: {
      token: string
      repo: GitHubRepository
    }) {
      this.setLoading(true)
      try {
        const projects = await fetchProjects(token, repo)
        this.setProjects({ repo, projects })
      } catch (error) {
        this.setError(error)
      } finally {
        this.setLoading(false)
      }
    },
    async fetchRepos(token: string) {
      this.setLoading(true)
      try {
        const repositories = await fetchRepositories(token)
        this.setRepos(repositories)
      } catch (error) {
        this.setError(error)
      } finally {
        this.setLoading(false)
      }
    },
    async fetchColumnsAndCards({
      token,
      project,
    }: {
      token: string
      project: GitHubProject
    }) {
      this.setLoading(true)
      try {
        const columns = await fetchProjectColumnsAndCards(token, project)
        this.setColumns({ project, columns })
      } catch (error) {
        this.setError(error)
      } finally {
        this.setLoading(false)
      }
    },
  }),
  reducers: {
    setError: (state, error: Error | undefined) => {
      if (error) {
        // tslint:disable-next-line:no-console
        console.error(error)
      }
      return {
        ...state,
        error,
      }
    },
    setRepos: (state, repositories) => {
      return {
        ...state,
        repositories,
      }
    },
    setDisplayProject: (state, project: GitHubProject | undefined) => {
      if (!project) {
        return {
          ...state,
          displayProject: undefined,
        }
      }
      const displayProject = state.projects[
        `${project.repo.owner}/${project.repo.name}`
      ].find(p => p.number === project.number)

      return {
        ...state,
        displayProject,
      }
    },
    setColumns: (
      state,
      {
        project,
        columns,
      }: { project: GitHubProject; columns: GitHubProjectColumn[] },
    ) => {
      const { projects } = state
      const pr = projects[`${project.repo.owner}/${project.repo.name}`].find(
        p => p.number === project.number,
      )
      if (pr) {
        pr.columns = columns
      }

      return { ...state }
    },
    setProjects: (
      state,
      { repo, projects }: { repo: GitHubRepository; projects: GitHubProject[] },
    ) => {
      const p = state.projects

      return {
        ...state,
        projects: { ...p, ...{ [`${repo.owner}/${repo.name}`]: projects } },
      }
    },
    setLoading: (state, loading) => {
      return {
        ...state,
        loading,
      }
    },
  },
  state: {
    loading: false,
    repositories: {},
    projects: {},
  },
})
