import { createModel, ModelConfig } from "@rematch/core"
import {
  addItemAtIndexToArray,
  removeItemInArray,
  replaceItemInArray,
} from "../misc/prelude"
import { GithubProjectIdentifier } from "./github"

import uuid from "uuid/v4"

export interface PanelModel {
  uid: string
  name?: string
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
  token: string,
): SplitGitHubProjectPanelModel => {
  return {
    uid: uuid(),
    token,
  }
}

export interface DashboardModel<
  P extends PanelModel = SplitGitHubProjectPanelModel
> {
  canSave: boolean
  boardState: "viewer" | "editor" | "manipulater"
  activePanelIndex: number
  panels: P[]
}

const initialState: DashboardModel = {
  activePanelIndex: 0,
  boardState: "viewer",
  canSave: false,
  panels: [],
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
    changeState: (
      state,
      { boardState }: { boardState: DashboardModel["boardState"] },
    ) => {
      return { ...state, boardState }
    },
    setActive: (state, { uid }: { uid: string }) => {
      const activePanelIndex = state.panels.findIndex(p => p.uid === uid)
      return {
        ...state,
        activePanelIndex,
      }
    },
    addNew: (state, { token }: { token: string }) => {
      const panel = createEmptyGithubProjectPanel(token)
      const panels = addItemAtIndexToArray(
        state.panels,
        state.panels.length,
        panel,
      )
      return {
        ...state,
        activePanelIndex: state.panels.length,
        editing: true,
        panels,
      }
    },
    add: (
      state,
      {
        index,
        panel,
        active,
      }: {
        index: number
        panel: DashboardModel["panels"][0]
        active: boolean
      },
    ) => {
      if (!panel.uid) {
        throw new Error(`Invalid panel uid(${panel.uid}). uid is required.`)
      }
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

      const canSave = !!to.name && !!to.right && !!to.left
      return { ...state, panels, canSave }
    },
  },
  subscriptions: {},
  state: initialState,
})
