import { createModel, ModelConfig } from "@rematch/core"
import { isGitHubProjectColumnIdentifier } from "../misc/github"
import { GitHubProjectColumnIdentifier } from "./github.types"

export type ColumnsModel = GitHubProjectColumnIdentifier[]

const initialState: ColumnsModel = []

export default createModel<ColumnsModel, ModelConfig<ColumnsModel>>({
  reducers: {
    addColumn: (state, payload: GitHubProjectColumnIdentifier) => {
      if (!isGitHubProjectColumnIdentifier(payload)) {
        throw new Error("Invalid payload")
      }
      return [...state, payload]
    },
  },
  state: initialState,
})
