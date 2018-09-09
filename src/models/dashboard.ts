import { createModel, ModelConfig } from "@rematch/core"
import {
  addItemAtIndexToArray,
  removeItemInArray,
  replaceItemInArray,
} from "../misc/prelude"
import { GithubProjectIdentifier } from "./github"

export interface PanelModel {
  name: string
}

export interface GitHubAccessible {
  token: string
}

export interface SplitGitHubProjectPanelModel
  extends PanelModel,
    GitHubAccessible {
  left?: GithubProjectIdentifier
  right?: GithubProjectIdentifier
}

export const createEmptyGithubProjectPanel = (
  name: string,
  token: string,
): SplitGitHubProjectPanelModel => {
  return {
    name,
    token,
  }
}

export interface DashboardModel<
  P extends PanelModel = SplitGitHubProjectPanelModel
> {
  activePanelIndex: number
  panels: P[]
}

/**
 * ## structire
 *
 * /Dashboard
 *    |- Panel
 *        |- Right
 *        |- Left
 *    |- Panel
 *    |- ...
 *
 * ## state
 *
 *
 *
 *
 */
export default createModel<DashboardModel, ModelConfig<DashboardModel>>({
  reducers: {
    setActive: (state, { index }: { index: number }) => {
      const active = state.panels[index]

      return {
        ...state,
        active,
      }
    },
    add: (
      state,
      {
        index,
        panel,
        active,
      }: { index: number; panel: DashboardModel["panels"][0]; active: boolean },
    ) => {
      const panels = addItemAtIndexToArray(state.panels, index, panel)
      return {
        ...state,
        panels,
        activePanelIndex: active ? index : state.activePanelIndex,
      }
    },
    remove: (state, { panel }: { panel: DashboardModel["panels"][0] }) => {
      const panels = removeItemInArray(state.panels, panel)
      return { ...state, panels }
    },
    replace: (
      state,
      {
        from,
        to,
      }: { from: DashboardModel["panels"][0]; to: DashboardModel["panels"][0] },
    ) => {
      const panels = replaceItemInArray(state.panels, from, to)
      return { ...state, panels }
    },
  },
  state: { panels: [], activePanelIndex: -1 },
})
