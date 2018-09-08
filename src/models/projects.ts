import { createModel, init, ModelConfig } from "@rematch/core"
import { createProjectSlug } from "../misc/project"
import github, { GitHubProject, GithubProjectIdentifier } from "./github"

export interface ProjectConditionModel {
  project?: GitHubProject
  loading: boolean
  error?: Error
}

export interface ProjectsModel {
  [slug: string]: ProjectConditionModel | undefined
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

      this.setProject({
        slug,
        project: undefined,
        loading: true,
        error: undefined,
      })
      await store.dispatch.github.fetchProject(payload)
      const gh = store.getState().github || {}

      this.setProject({ slug, ...gh })
    },
  }),
  reducers: {
    setProject: (state, payload: ProjectConditionModel & { slug: string }) => {
      const { slug } = payload
      if (typeof slug !== "string") {
        throw new Error("Invalid payload. slug is required.")
      }
      const condition: ProjectConditionModel = {
        loading: payload.loading,
        project: payload.project,
        error: payload.error,
      }
      return { ...state, [slug]: condition }
    },
  },
  state: {},
})
