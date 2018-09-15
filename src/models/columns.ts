import { createModel, ModelConfig } from "@rematch/core"
import {
  GitHubProjectColumnIdentifier,
  isGitHubProjectColumnIdentifier,
} from "./github"

export type ColumnsModel = GitHubProjectColumnIdentifier[]

const initialState: ColumnsModel = [
  {
    project: {
      repository: { owner: "covelline", name: "facilio" },
      number: 4,
    },
    id: "MDEzOlByb2plY3RDb2x1bW4zMTMxMTE2",
  },
]

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
