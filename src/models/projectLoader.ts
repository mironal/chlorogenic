import {
  Action,
  createModel,
  ExtractRematchDispatchersFromModel,
  ModelConfig,
} from "@rematch/core"
import { produce } from "immer"
import {
  fetchOrganizationProject,
  fetchRepositoryProject,
} from "../github/runner"
import { Bug } from "../misc/errors"
import {
  createProjectSlug,
  isGithubOrgProjectIdentifier,
  isGithubRepoProjectIdentifier,
} from "../misc/github"
import { GitHubProject, GithubProjectIdentifier } from "./github.types"

export interface ProjectLoaderModel {
  [slug: string]: GitHubProject | undefined
}

export default createModel<ProjectLoaderModel, ModelConfig<ProjectLoaderModel>>(
  {
    effects: dispatcher => ({
      async fetchRequest(payload) {
        const { identifier, token } = payload

        const run = async () => {
          if (isGithubOrgProjectIdentifier(identifier)) {
            return fetchOrganizationProject(token, identifier)
          } else if (isGithubRepoProjectIdentifier(identifier)) {
            return fetchRepositoryProject(token, identifier)
          } else {
            throw new Bug("Invalid payload", JSON.stringify(identifier))
          }
        }

        return run()
          .then(project => this.fetchSucceeded({ identifier, project }))
          .catch(error => {
            this.fetchFailed({ identifier, error })
            throw error
          })
      },
    }),
    reducers: {
      fetchFailed: (state, payload) => {
        const { identifier } = payload
        const slug = createProjectSlug(identifier)
        return produce(state, draft => {
          delete draft[slug]
        })
      },
      fetchSucceeded: (state, payload) => {
        const { identifier, project } = payload
        const slug = createProjectSlug(identifier)
        return produce(state, draft => {
          draft[slug] = project
        })
      },
    },
    state: {},
  },
)

// action creators

type M = ExtractRematchDispatchersFromModel<ModelConfig<ProjectLoaderModel>>

export const createFetchRequest = (m: M) => (
  token: string,
  identifier: GithubProjectIdentifier,
): Promise<Action> =>
  Promise.resolve(
    // rematch hack
    m.fetchRequest({
      token,
      identifier,
    }),
  )
