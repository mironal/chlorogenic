import { createModel, ModelConfig } from "@rematch/core"
import {
  fetchOrganizationProject,
  fetchRepositoryProject,
} from "../github/runner"
import CHLOError from "../misc/CHLOError"
import {
  isGithubOrgProjectIdentifier,
  isGithubRepoProjectIdentifier,
} from "../misc/github"
import { GitHubProject, GithubProjectIdentifier } from "./github.types"

export interface ProjectLoadingConditionModel {
  loading: boolean
  identifier: GithubProjectIdentifier | null
  project: GitHubProject | null
  error: Error | null
}

export default createModel<
  ProjectLoadingConditionModel,
  ModelConfig<ProjectLoadingConditionModel>
>({
  effects: dispatch => ({
    async fetchProject({
      token,
      identifier,
    }: {
      token: string
      identifier: GithubProjectIdentifier
    }) {
      try {
        if (!token || !identifier) {
          throw new CHLOError(
            "Invalid payload",
            "token and identifier are required.",
          )
        }

        this.update({ error: undefined, loading: true, identifier })
        if (isGithubRepoProjectIdentifier(identifier)) {
          const project = await fetchRepositoryProject(token, identifier)
          this.update({ ...this.state, project, loading: false })
        } else if (isGithubOrgProjectIdentifier(identifier)) {
          const project = await fetchOrganizationProject(token, identifier)
          this.update({ ...this.state, project, loading: false })
        }
      } catch (error) {
        this.update({
          loading: false,
          error,
          identifier,
        })
        throw error
      }
    },
  }),
  reducers: {
    update: (state, payload: ProjectLoadingConditionModel) => {
      return { ...payload }
    },
  },
  state: {
    loading: false,
    error: null,
    project: null,
    identifier: null,
  },
})
