import { createModel, ModelConfig } from "@rematch/core"
import CHLOError from "../misc/CHLOError"
import { isGitHubProjectColumnIdentifier } from "../misc/github"
import {
  GitHubProjectColumnIdentifier,
  GithubProjectIdentifier,
} from "./github.types"

export interface ColumnPanel {
  name?: string
  columns: GitHubProjectColumnIdentifier[]
}

export type ColumnPanelModel = ColumnPanel[]

export interface ColumnPayload {
  index: number
  column: GithubProjectIdentifier
}

const initialState: ColumnPanelModel = [{ columns: [] }]

export default createModel<ColumnPanelModel, ModelConfig<ColumnPanelModel>>({
  reducers: {
    addColumn: (state, { index, column }: ColumnPayload) => {
      if (!isGitHubProjectColumnIdentifier(column)) {
        throw new CHLOError("Invalid payload", "column is required.")
      }
      if (typeof index !== "number") {
        throw new CHLOError("Invalid payload", "index is required.")
      }

      if (state[index].columns.some(c => c.id === column.id)) {
        throw new CHLOError(
          "Invalid payload",
          "That column has already been added.",
        )
      }

      const next = state.slice()
      next[index].columns.push(column)

      return next
    },
    removeColumn: (state, { index, column }: ColumnPayload) => {
      if (!isGitHubProjectColumnIdentifier(column)) {
        throw new Error("Invalid payload")
      }
      if (typeof index !== "number") {
        throw new Error("Invalid payload")
      }

      const next = state.slice()
      const columns = state[index]
      const i = columns.columns.indexOf(column)
      if (i >= 0) {
        next[index].columns.splice(i, 1)
      }

      return next
    },
    createPanel: (state, {}) => [...state, { columns: [] }],
    renamePanel: (state, { index, name }: { index: number; name?: string }) => {
      if (typeof index !== "number") {
        throw new Error("Invalid payload")
      }
      const next = state.slice()
      next[index].name = name

      return next
    },
    removePanel: (state, panel: ColumnPanel) => {
      if (!Array.isArray(panel.columns)) {
        throw new Error("Invalid payload")
      }

      const index = state.indexOf(panel)
      const next = state.slice()
      if (index >= 0) {
        next.splice(index, 1)
      }

      return next
    },
  },
  state: initialState,
})
