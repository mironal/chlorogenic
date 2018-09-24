import { createModel, ModelConfig } from "@rematch/core"
import { produce } from "immer"
import { createProjectSlug } from "../misc/github"

interface LoadingModel {
  userConfigLoading: boolean
  projectLoadings: { [slug: string]: boolean }
  projectErrors: { [slug: string]: Error | undefined }
}

export default createModel<LoadingModel, ModelConfig<LoadingModel>>({
  reducers: {
    "userConfig/onSnapshot": state => {
      return produce(state, draft => {
        draft.userConfigLoading = false
      })
    },
    "projectLoader/fetchRequest": (state, { identifier }) => {
      const slug = createProjectSlug(identifier)
      return produce(state, draft => {
        draft.projectLoadings[slug] = true
        delete draft.projectErrors[slug]
      })
    },
    "projectLoader/fetchFailed": (state, { identifier, error }) => {
      const slug = createProjectSlug(identifier)
      return produce(state, draft => {
        draft.projectLoadings[slug] = false
        draft.projectErrors[slug] = error
      })
    },
    "projectLoader/fetchSucceeded": (state, { identifier }) => {
      const slug = createProjectSlug(identifier)
      return produce(state, draft => {
        draft.projectLoadings[slug] = false
        delete draft.projectErrors[slug]
      })
    },
  },
  state: { projectLoadings: {}, projectErrors: {}, userConfigLoading: true },
})
