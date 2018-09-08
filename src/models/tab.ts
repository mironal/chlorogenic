import { createModel, ModelConfig } from "@rematch/core"

import { GithubProjectIdentifier } from "./github"

export type MetaTab = "AddPane" | "AuthPane"

export interface TabModel {
  activeTabIndex: number
  tabs: Array<GithubProjectIdentifier | MetaTab>
}

export interface SplitedTabModel {
  left: TabModel
  right: TabModel
}

export default createModel<SplitedTabModel, ModelConfig<SplitedTabModel>>({
  effects: dispatch => ({}),
  reducers: {
    select: (state, payload: { index: number; which: "left" | "right" }) => {
      const { index, which } = payload
      if (typeof index === "number" && typeof which === "string") {
        return {
          ...state,
          [which]: { tabs: state[which].tabs, activeTabIndex: index },
        }
      }
      throw new Error("Invalid payload. index and which are required.")
    },
    remove: (state, payload: { pos: number; which: "left" | "right" }) => {
      const { pos, which } = payload
      const tabs = [...state[which].tabs]
      tabs.splice(pos, 1)

      return {
        ...state,
        [which]: {
          tabs,
          activeTabIndex: Math.min(
            state[which].activeTabIndex,
            tabs.length - 1,
          ),
        },
      }
    },
    replace: state => {
      return { ...state }
    },
    add: (
      state,
      payload: {
        tab: GithubProjectIdentifier | MetaTab
        which: "left" | "right"
        pos: number | undefined
        select: boolean | undefined
      },
    ) => {
      const { tab, pos, select, which } = payload
      if (!tab || !which) {
        throw new Error("Invalid payload. tab and which are required.")
      }
      const insertIndex =
        typeof pos === "number" ? pos : state[which].tabs.length
      const tabs = [...state[which].tabs]
      tabs.splice(insertIndex, 0, tab)
      return {
        ...state,
        [which]: {
          tabs,
          activeTabIndex: select ? insertIndex : state[which].activeTabIndex,
        },
      }
    },
  },
  state: {
    left: { activeTabIndex: 0, tabs: [] },
    right: { activeTabIndex: 0, tabs: [] },
  },
})
