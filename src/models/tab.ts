import { createModel, ModelConfig } from "@rematch/core"

import { GitHubProject } from "./github"

export type MetaTab = "AddPane" | "AuthPane"
export interface TabModel {
  activeTabIndex: number
  tabs: Array<GitHubProject | MetaTab>
}

export default createModel<TabModel, ModelConfig<TabModel>>({
  effects: dispatch => ({}),
  reducers: {
    addProjectTab: (state, payload: { project: GitHubProject }) => {
      const { project } = payload
      state.tabs.push(project)
      return { ...state }
    },
    addMetaTab: (state, type: MetaTab) => {
      if (state.tabs.some(t => t === type)) {
        throw new Error(`Invalid argument. ${type} tab already added.`)
      }
      state.tabs.push(type)
      return state
    },
  },
  state: {
    activeTabIndex: 0,
    tabs: [],
  },
})
