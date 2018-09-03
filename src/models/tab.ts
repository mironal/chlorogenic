import { createModel, ModelConfig } from "@rematch/core"

import { GithubProjectIdentifier } from "./github"

export type MetaTab = "AddPane" | "AuthPane"
export interface TabModel {
  activeTabIndex: number
  tabs: Array<GithubProjectIdentifier | MetaTab>
}

export default createModel<TabModel, ModelConfig<TabModel>>({
  effects: dispatch => ({}),
  reducers: {
    select: (state, index: number) => {
      return { ...state, activeTabIndex: index }
    },
    add: (
      state,
      payload: {
        tab: GithubProjectIdentifier | MetaTab
        pos: number | undefined
        select: boolean | undefined
      },
    ) => {
      const { tab, pos, select } = payload
      if (!tab) {
        throw new Error("Invalid payload. tab is required.")
      }
      const insertIndex = typeof pos === "number" ? pos : state.tabs.length
      const tabs = [...state.tabs]
      tabs.splice(insertIndex, 0, tab)
      return {
        ...state,
        tabs,
        activeTabIndex: select ? insertIndex : state.activeTabIndex,
      }
    },
  },
  state: {
    activeTabIndex: 0,
    tabs: [],
  },
})
