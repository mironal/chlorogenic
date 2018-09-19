import { createModel, ModelConfig } from "@rematch/core"
import CHLOError from "../misc/CHLOError"
import { isGitHubProjectColumnIdentifier } from "../misc/github"
import { GitHubProjectColumnIdentifier } from "./github.types"

export interface ColumnPanel {
  name?: string
  columns: GitHubProjectColumnIdentifier[]
}

export type ColumnPanelModel = ColumnPanel[]

export interface ColumnPayload {
  index: number
  column: GitHubProjectColumnIdentifier
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
    moveColumn: (
      state,
      { index, column, add }: ColumnPayload & { add: number },
    ) => {
      const from = state[index].columns.findIndex(c => c.id === column.id)

      if (from === -1) {
        throw new CHLOError("Invalid payload")
      }

      const columns = state[index].columns.slice()
      let to = from + add
      if (to < 0) {
        to = columns.length + to
      } else if (to >= columns.length) {
        to = to % columns.length
      }

      const temp = columns[from]
      if (!temp) {
        throw new CHLOError("Invalid payload")
      }
      if (!columns[to]) {
        throw new CHLOError("Invalid payload")
      }
      columns[from] = columns[to]
      columns[to] = temp

      const next = state.slice()
      next[index] = { name: next[index].name, columns }

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
