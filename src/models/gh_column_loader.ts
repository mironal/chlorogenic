import { createModel, ModelConfig } from "@rematch/core"
import {
  fetchOrganizationProject,
  fetchRepositoryProject,
} from "../github/runner"
import CHLOError from "../misc/CHLOError"
import {
  isGithubOrgProjectIdentifier,
  isGitHubProjectColumnIdentifier,
  isGithubRepoProjectIdentifier,
} from "../misc/github"
import {
  GitHubProjectColumn,
  GitHubProjectColumnIdentifier,
} from "./github.types"

export interface ColumnLoadingState {
  identifier: GitHubProjectColumnIdentifier
  loading: boolean
  error: Error | null
  column: GitHubProjectColumn | null
}

export interface ColumnLoaderModel {
  [columnId: string]: ColumnLoadingState
}

export interface FetchColumnPayload {
  token: string
  identifier: GitHubProjectColumnIdentifier
}

export default createModel<ColumnLoaderModel, ModelConfig<ColumnLoaderModel>>({
  effects: dispatcher => ({
    fetchColumn(payload: FetchColumnPayload) {
      const { identifier, token } = payload

      const run = async () => {
        if (isGithubOrgProjectIdentifier(identifier.project)) {
          return fetchOrganizationProject(token, identifier.project)
        } else if (isGithubRepoProjectIdentifier(identifier.project)) {
          return fetchRepositoryProject(token, identifier.project)
        } else {
          throw new CHLOError("Invalid payload")
        }
      }

      this.prepareLoading(identifier)
      run()
        .then(project =>
          project.columns.forEach(col => this.successLoading(col)),
        )
        .catch(error => {
          dispatcher.notification.setError(error)
          this.failLoading({ identifier, error })
        })
    },
  }),
  reducers: {
    failLoading: (
      state,
      {
        identifier,
        error,
      }: { identifier: GitHubProjectColumnIdentifier; error: Error },
    ) => {
      const current = state[identifier.id]
      return {
        ...state,
        [identifier.id]: {
          ...current,
          loading: false,
          error,
        },
      }
    },
    successLoading: (state, column: GitHubProjectColumn) => {
      const current = state[column.id]
      return {
        ...state,
        [column.id]: {
          ...current,
          loading: false,
          column,
        },
      }
    },
    prepareLoading: (state, identifier: GitHubProjectColumnIdentifier) => {
      if (!isGitHubProjectColumnIdentifier(identifier)) {
        throw new CHLOError("Invalid payload")
      }

      return {
        ...state,
        [identifier.id]: {
          identifier,
          loading: true,
          error: null,
          column: null,
        },
      }
    },
  },
  state: {},
})
