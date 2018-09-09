import { createModel, init, ModelConfig } from "@rematch/core"
import { createProjectSlug } from "../misc/project"
import github, { GitHubModel, GithubProjectIdentifier } from "./github"

export interface ProjectsModel {
  [slug: string]: GitHubModel | undefined
}

const createStore = () => {
  return init({ models: { github } })
}

const githubRegistory: {
  [slug: string]: ReturnType<typeof createStore> | undefined
} = {}

export default createModel<ProjectsModel, ModelConfig<ProjectsModel>>({
  effects: dispatch => ({
    async fetchProject(payload: {
      token: string
      identifier: GithubProjectIdentifier
    }) {
      const { identifier } = payload

      const slug = createProjectSlug(identifier)
      let store = githubRegistory[slug]
      if (!store) {
        store = createStore()
        githubRegistory[slug] = store
      }

      const condition = store.getState().github

      this.updateModel({
        slug,
        ...condition,
      })
      await store.dispatch.github.fetchProject(payload)
      const gh = store.getState().github || {}

      this.updateModel({ slug, ...gh })
    },
  }),
  reducers: {
    updateModel: (state, payload: GitHubModel & { slug: string }) => {
      const { slug } = payload
      if (typeof slug !== "string") {
        throw new Error("Invalid payload. slug is required.")
      }
      const model: GitHubModel = {
        loading: payload.loading,
        project: payload.project,
        error: payload.error,
        identifier: payload.identifier,
      }
      return { ...state, [slug]: model }
    },
  },
  state: {},
})
