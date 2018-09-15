import { createModel, init, ModelConfig } from "@rematch/core"
import { createProjectSlug } from "../misc/github"
import github, { ProjectLoadingConditionModel } from "./gh_project_loader"
import { GithubProjectIdentifier } from "./github.types"

export interface ProjectStoreModel {
  [slug: string]: ProjectLoadingConditionModel | undefined
}

const createStore = () => {
  return init({ models: { github } })
}

const githubRegistory: {
  [slug: string]: ReturnType<typeof createStore> | undefined
} = {}

export default createModel<ProjectStoreModel, ModelConfig<ProjectStoreModel>>({
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
    updateModel: (
      state,
      payload: ProjectLoadingConditionModel & { slug: string },
    ) => {
      const { slug } = payload
      if (typeof slug !== "string") {
        throw new Error("Invalid payload. slug is required.")
      }
      const model: ProjectLoadingConditionModel = {
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
