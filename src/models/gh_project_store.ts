import { createModel, init, ModelConfig } from "@rematch/core"
import { Unsubscribe } from "redux"
import { createProjectSlug } from "../misc/github"
import github, { ProjectLoadingConditionModel } from "./gh_project_loader"
import { GithubProjectIdentifier } from "./github.types"

export interface ProjectStoreModel {
  [slug: string]: ProjectLoadingConditionModel | undefined
}

const createStore = () => {
  return init({ models: { github } })
}

const githubRegistry: {
  [slug: string]: ReturnType<typeof createStore> | undefined
} = {}

const loadingRegistry: {
  [slug: string]: Unsubscribe | null
} = {}

export default createModel<ProjectStoreModel, ModelConfig<ProjectStoreModel>>({
  effects: dispatch => ({
    async fetchProject(payload: {
      token: string
      identifier: GithubProjectIdentifier
      purge?: boolean
    }) {
      const { identifier, purge } = payload

      const slug = createProjectSlug(identifier)

      if (purge === true) {
        delete githubRegistry[slug]
        const o = loadingRegistry[slug]
        if (o) {
          o()
          delete loadingRegistry[slug]
        }
      }

      let store = githubRegistry[slug]

      if (!store) {
        const s = createStore()
        store = s
        githubRegistry[slug] = store
        loadingRegistry[slug] = s.subscribe(() => {
          this.updateModel({
            slug,
            ...s.getState().github,
          })
        })
      } else {
        this.updateModel({
          slug,
          ...store.getState().github,
          loading: false,
        })
      }

      await Promise.resolve(store.dispatch.github.fetchProject(payload)).catch()
      this.updateModel({
        slug,
        ...store.getState().github,
      })
      const off = loadingRegistry[slug]
      if (off) {
        off()
        loadingRegistry[slug] = null
      }
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

const emptyCondition: ProjectLoadingConditionModel = Object.freeze({
  loading: false,
  identifier: null,
  project: null,
  error: null,
})

export const getLoadingConditionForIdentifer = (
  store: ProjectStoreModel,
  identifier: GithubProjectIdentifier | null,
): ProjectLoadingConditionModel => {
  if (!identifier) {
    return emptyCondition
  }
  const slug = createProjectSlug(identifier)

  const condition = store[slug] || emptyCondition
  return condition
}