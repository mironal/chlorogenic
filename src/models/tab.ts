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
    selectTab: (state, index: number) => {
      return { ...state, activeTabIndex: index }
    },
    addProjectTab: (
      state,
      payload: { project: GitHubProject; pos: "first" | "last" | undefined },
    ) => {
      const { project, pos } = payload

      if (pos === "first") {
        return { ...state, tabs: [project, ...state.tabs] }
      }
      return { ...state, tabs: [...state.tabs, project] }
    },
    addMetaTab: (
      state,
      payload: { type: MetaTab; pos: "first" | "last" | undefined },
    ) => {
      const { type, pos } = payload
      if (state.tabs.some(t => t === type)) {
        throw new Error(`Invalid argument. ${type} tab already added.`)
      }
      if (pos === "first") {
        return { ...state, tabs: [type, ...state.tabs] }
      }
      return { ...state, tabs: [...state.tabs, type] }
    },
  },
  state: {
    activeTabIndex: 0,
    tabs: [],
  },
})
