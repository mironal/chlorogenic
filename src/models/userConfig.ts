import {
  createModel,
  ExtractRematchDispatchersFromModel,
  ModelConfig,
} from "@rematch/core"
import firebase from "firebase/app"
import "firebase/auth"
import "firebase/firestore"
import produce from "immer"
import { firestoreCollectionReference } from "../firebase/firestore"
import CHLOError from "../misc/CHLOError"
import { isGitHubProjectColumnIdentifier } from "../misc/github"
import { removeItemAtIndexInArray } from "../misc/prelude"
import { GitHubProjectColumnIdentifier } from "./github.types"

export interface PanelModel {
  name: string
  columns: GitHubProjectColumnIdentifier[]
}

export interface UserConfig {
  user: firebase.UserInfo | null
  githubToken: string | null
  panelIndex: number
  panels: PanelModel[]
}

export interface UserConfigModel extends UserConfig {
  loading: boolean
}

const isPanelModel = (obj: any): obj is PanelModel => {
  return (
    typeof obj === "object" &&
    typeof obj.name === "string" &&
    Array.isArray(obj.columns) &&
    obj.columns.evey(isGitHubProjectColumnIdentifier)
  )
}

let lastUserState: firebase.User | null = null
let unsubscribe: firebase.Unsubscribe | null = null

export default createModel<UserConfigModel, ModelConfig<UserConfigModel>>({
  effects: dispatch => ({
    async subscribe() {
      if (unsubscribe) {
        throw new CHLOError("Invalid state")
      }

      unsubscribe = firebase.auth().onAuthStateChanged(user => {
        lastUserState = user
        this.setUser(user)
        if (user) {
          const ref = firestoreCollectionReference("configs").doc(user.uid)
          const off = ref.onSnapshot(
            snapshot => this.onSnapshot(snapshot),
            error => {
              if (lastUserState) {
                dispatch.notification.setError(
                  new CHLOError(
                    "Firestore error",
                    `${ref.path}/onSnapshot`,
                    error,
                  ),
                )
              }
              this.onSnapshot(null)
              off()
            },
          )
        } else {
          this.onSnapshot(null)
        }
      })
    },
    async unsubscribe() {
      if (unsubscribe) {
        unsubscribe()
        unsubscribe = null
        this.onSnapshot(null)
      }
    },
  }),

  reducers: {
    addPanelColumn: (state, payload) => {
      const { panelIndex, column } = payload
      if (
        typeof panelIndex !== "number" ||
        !isGitHubProjectColumnIdentifier(column)
      ) {
        throw new CHLOError("Invalid payload")
      }
      if (state.panels[panelIndex].columns.some(c => c.id === column.id)) {
        throw new CHLOError(
          "Invalid payload",
          "That column has already been added.",
        )
      }

      return produce(state, draft => {
        draft.panels[panelIndex].columns.push(column)
      })
    },
    removePanelColumn: (state, payload) => {
      const { panelIndex, column } = payload
      if (
        typeof panelIndex !== "number" ||
        !isGitHubProjectColumnIdentifier(column)
      ) {
        throw new CHLOError("Invalid payload")
      }
      return produce(state, draft => {
        const index = draft.panels[panelIndex].columns.findIndex(
          c => c.id === column.id,
        )
        if (index !== -1) {
          draft.panels[panelIndex].columns.splice(index, 1)
        }
      })
    },
    movePanelColumn: (state, payload) => {
      const { panelIndex, column, add } = payload
      if (
        typeof panelIndex !== "number" ||
        typeof add !== "number" ||
        !isGitHubProjectColumnIdentifier(column)
      ) {
        throw new CHLOError("Invalid payload")
      }
      const from = state.panels[panelIndex].columns.findIndex(
        c => c.id === column.id,
      )
      if (from === -1) {
        throw new CHLOError("Invalid payload")
      }
      const columnLength = state.panels[panelIndex].columns.length
      let to = from + add
      if (to < 0) {
        to = columnLength + to
      } else if (to >= columnLength) {
        to = to % columnLength
      }
      if (!state.panels[panelIndex].columns[to]) {
        throw new CHLOError("Invalid payload")
      }

      return produce(state, draft => {
        const temp = draft.panels[panelIndex].columns[from]
        draft.panels[panelIndex].columns[from] =
          draft.panels[panelIndex].columns[to]
        draft.panels[panelIndex].columns[to] = temp
      })
    },
    createPanel: state => {
      return produce(state, draft => {
        draft.panels.push({
          name: "No name",
          columns: [],
        })
      })
    },
    removePanel: (state, panelIndex) => {
      if (typeof panelIndex !== "number") {
        throw new CHLOError("Invalid payload")
      }

      const panels = removeItemAtIndexInArray(state.panels, panelIndex)
      let nextPanelIndex = state.panelIndex
      if (nextPanelIndex >= panels.length) {
        nextPanelIndex -= 1
      }
      return {
        ...state,
        panels,
        panelIndex: nextPanelIndex,
      }
    },
    renamePanel: (state, payload) => {
      if (
        !payload ||
        typeof payload.panelIndex !== "number" ||
        typeof payload.name !== "string"
      ) {
        throw new CHLOError("Invalid payload")
      }
      const { panelIndex, name } = payload as {
        panelIndex: number
        name: string
      }

      return produce(state, draftState => {
        draftState.panels[panelIndex].name = name
      })
    },
    setPanelIndex: (state, panelIndex) => {
      if (typeof panelIndex !== "number") {
        throw new CHLOError("Invalid payload")
      }

      return produce(state, draftState => {
        draftState.panelIndex = panelIndex
      })
    },
    setUser: (state, user) => {
      return {
        ...state,
        user,
      }
    },
    onSnapshot: (
      state,
      payload: firebase.firestore.DocumentSnapshot | null,
    ) => {
      if (payload === null || !payload.exists) {
        return {
          ...state,
          loading: false,
          panelIndex: 0,
          panels: [],
        }
      }
      const data = payload.data()!
      const { githubToken } = data
      let { panelIndex, panels } = data
      if (typeof githubToken !== "string") {
        throw new CHLOError("Invalid payload")
      }
      if (typeof panelIndex !== "number") {
        panelIndex = 0
      }
      if (!Array.isArray(panels) || !panels.every(isPanelModel)) {
        panels = []
      }

      return {
        ...state,
        loading: false,
        panelIndex,
        githubToken,
        panels,
      }
    },
  },
  state: {
    loading: true,
    user: null,
    githubToken: null,
    panelIndex: 0,
    panels: [],
  },
})

type M = ExtractRematchDispatchersFromModel<ModelConfig<UserConfigModel>>

export const createCreatePanel = (m: M) => () => m.createPanel()
export const createRemovePanel = (m: M) => (panelIndex: number) =>
  m.removePanel(panelIndex)

export const createRenamePanel = (m: M) => (panelIndex: number, name: string) =>
  m.renamePanel({
    panelIndex,
    name,
  })

export const createSetPanelIndex = (m: M) => (panelIndex: number) =>
  m.setPanelIndex(panelIndex)

export const createAddPanelColumn = (m: M) => (
  panelIndex: number,
  column: GitHubProjectColumnIdentifier,
) =>
  m.addPanelColumn({
    panelIndex,
    column,
  })

export const createRemovePanelColumn = (m: M) => (
  panelIndex: number,
  column: GitHubProjectColumnIdentifier,
) => m.removePanelColumn({ panelIndex, column })

export const createMovePanelColumn = (m: M) => (
  panelIndex: number,
  column: GitHubProjectColumnIdentifier,
  add: number,
) =>
  m.movePanelColumn({
    panelIndex,
    column,
    add,
  })
