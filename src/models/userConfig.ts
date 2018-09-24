import {
  createModel,
  ExtractRematchDispatchersFromModel,
  ModelConfig,
} from "@rematch/core"
import * as firebase from "firebase/app"
import "firebase/auth"
import "firebase/firestore"
import produce from "immer"
import { firestoreCollectionReference } from "../firebase/firestore"
import { Bug } from "../misc/errors"
import { isGitHubProjectColumnIdentifier } from "../misc/github"
import { pick } from "../misc/prelude"
import { GitHubProjectColumnIdentifier } from "./github.types"

export interface PanelModel {
  name: string
  columns: GitHubProjectColumnIdentifier[]
}

export interface UserConfigModel {
  user: firebase.UserInfo | null
  githubToken: string | null
  panelIndex: number
  panels: PanelModel[]
}

const isPanelModel = (obj: any): obj is PanelModel => {
  return (
    typeof obj === "object" &&
    typeof obj.name === "string" &&
    Array.isArray(obj.columns) &&
    obj.columns.every(isGitHubProjectColumnIdentifier)
  )
}

const initialState = {
  user: null,
  githubToken: null,
  panelIndex: 0,
  panels: [{ name: "No name", columns: [] }],
}

let lastUserState: firebase.User | null = null
let unsubscribe: firebase.Unsubscribe | null = null

const firestoreConfigReference = ({
  userConfig: {
    user: { uid },
  },
}: any) => firestoreCollectionReference("configs").doc(uid)

export default createModel<UserConfigModel, ModelConfig<UserConfigModel>>({
  effects: dispatch => ({
    async subscribe() {
      if (unsubscribe) {
        throw new Bug("Invalid state")
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
                // tslint:disable-next-line:no-console
                console.error(error)
              }
              this.onSnapshot(null)
              off()
            },
          )
        } else {
          // fake event for signout or not signin
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
    async addPanelColumn(payload, rootState) {
      const { panelIndex, column } = payload
      if (
        typeof panelIndex !== "number" ||
        !isGitHubProjectColumnIdentifier(column)
      ) {
        throw new Bug("Invalid payload")
      }

      const state = rootState.userConfig as UserConfigModel
      if (state.panels[panelIndex].columns.some(c => c.id === column.id)) {
        throw new Bug("Invalid payload", "That column has already been added.")
      }

      const panels = produce(state.panels, draft => {
        draft[panelIndex].columns.push(column)
      })
      await firestoreConfigReference(rootState).update({ panels })
    },
    async removePanelColumn(payload, rootState) {
      const { panelIndex, column } = payload
      if (
        typeof panelIndex !== "number" ||
        !isGitHubProjectColumnIdentifier(column)
      ) {
        throw new Bug("Invalid payload")
      }
      const panels: UserConfigModel["panels"] = produce(
        rootState.userConfig.panels as UserConfigModel["panels"],
        draft => {
          const index = draft[panelIndex].columns.findIndex(
            c => c.id === column.id,
          )
          if (index !== -1) {
            draft[panelIndex].columns.splice(index, 1)
          }
        },
      )
      await firestoreConfigReference(rootState).update({ panels })
    },
    async movePanelColumn(payload, rootState) {
      const { panelIndex, column, add } = payload
      if (
        typeof panelIndex !== "number" ||
        typeof add !== "number" ||
        !isGitHubProjectColumnIdentifier(column)
      ) {
        throw new Bug("Invalid payload")
      }
      const state = rootState.userConfig as UserConfigModel
      const from = state.panels[panelIndex].columns.findIndex(
        c => c.id === column.id,
      )
      if (from === -1) {
        throw new Bug("Invalid payload")
      }
      const columnLength = state.panels[panelIndex].columns.length
      let to = from + add
      if (to < 0) {
        to = columnLength + to
      } else if (to >= columnLength) {
        to = to % columnLength
      }
      if (!state.panels[panelIndex].columns[to]) {
        throw new Bug("Invalid payload")
      }

      const panels = produce(state.panels, draft => {
        const temp = draft[panelIndex].columns[from]
        draft[panelIndex].columns[from] = draft[panelIndex].columns[to]
        draft[panelIndex].columns[to] = temp
      })

      await firestoreConfigReference(rootState).update({ panels })
    },
    async createPanel(payload, rootState) {
      const state = rootState.userConfig as UserConfigModel
      const panels = produce(state.panels, draft => {
        draft.push({
          name: "No name",
          columns: [],
        })
      })
      await firestoreConfigReference(rootState).update({ panels })
    },
    async removePanel(panelIndex, rootState) {
      if (typeof panelIndex !== "number") {
        throw new Bug("Invalid payload")
      }

      const config: Pick<UserConfigModel, "panelIndex" | "panels"> = produce(
        pick(rootState.userConfig, ["panelIndex", "panels"]),
        draft => {
          draft.panels.splice(panelIndex, 1)
          if (draft.panelIndex >= draft.panels.length) {
            draft.panelIndex -= 1
          }
        },
      )

      await firestoreConfigReference(rootState).update(config)
    },
    async renamePanel(payload, rootState) {
      if (
        !payload ||
        typeof payload.panelIndex !== "number" ||
        typeof payload.name !== "string"
      ) {
        throw new Bug("Invalid payload")
      }
      const { panelIndex, name } = payload as {
        panelIndex: number
        name: string
      }

      const panels = produce<UserConfigModel["panels"]>(
        rootState.userConfig.panels,
        draft => {
          draft[panelIndex].name = name
        },
      )

      await firestoreConfigReference(rootState).update({
        panels,
      })
    },
    async setPanelIndex(panelIndex, rootState) {
      if (typeof panelIndex !== "number") {
        throw new Bug("Invalid payload")
      }

      return firestoreConfigReference(rootState).update({
        panelIndex,
      })
    },
  }),
  reducers: {
    setUser: (state, user) => {
      return produce(state, draft => {
        draft.user = user
      })
    },
    onSnapshot: (
      state,
      payload: firebase.firestore.DocumentSnapshot | null,
    ) => {
      if (payload === null || !payload.exists) {
        return {
          ...initialState,
        }
      }
      const data = payload.data()!
      const { githubToken, panelIndex, panels } = data
      if (typeof githubToken !== "string") {
        throw new Bug("Invalid payload")
      }
      return produce(state, draft => {
        draft.githubToken = githubToken
        if (typeof panelIndex === "number") {
          draft.panelIndex = panelIndex
        }
        if (Array.isArray(panels) && panels.every(isPanelModel)) {
          draft.panels = panels
        }
      })
    },
  },
  state: initialState,
})

// action creators

type M = ExtractRematchDispatchersFromModel<ModelConfig<UserConfigModel>>

export const createCreatePanel = (m: M) => () =>
  Promise.resolve(m.createPanel())

export const createRemovePanel = (m: M) => (panelIndex: number) =>
  Promise.resolve(m.removePanel(panelIndex))

export const createRenamePanel = (m: M) => (panelIndex: number, name: string) =>
  Promise.resolve(
    m.renamePanel({
      panelIndex,
      name,
    }),
  )

export const createSetPanelIndex = (m: M) => (panelIndex: number) =>
  Promise.resolve(m.setPanelIndex(panelIndex))

export const createAddPanelColumn = (m: M) => (
  panelIndex: number,
  column: GitHubProjectColumnIdentifier,
) =>
  Promise.resolve(
    m.addPanelColumn({
      panelIndex,
      column,
    }),
  )

export const createRemovePanelColumn = (m: M) => (
  panelIndex: number,
  column: GitHubProjectColumnIdentifier,
) => Promise.resolve(m.removePanelColumn({ panelIndex, column }))

export const createMovePanelColumn = (m: M) => (
  panelIndex: number,
  column: GitHubProjectColumnIdentifier,
  add: number,
) =>
  Promise.resolve(
    m.movePanelColumn({
      panelIndex,
      column,
      add,
    }),
  )
