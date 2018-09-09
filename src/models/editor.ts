import { createModel, ModelConfig } from "@rematch/core"
import { parseProjectIdentiferString } from "../misc/parser"
import { GithubProjectIdentifier } from "./github"

export interface EditorModel {
  identifier?: GithubProjectIdentifier
  input?: string
  error?: Error

  name?: string
}

export default createModel<EditorModel, ModelConfig<EditorModel>>({
  reducers: {
    reset: () => {
      return {}
    },
    changeName: (state, name: string) => {
      return { ...state, name }
    },
    changeInput: (state, input: string) => {
      const result = parseProjectIdentiferString(input)
      const newState: EditorModel = {
        input,
        error: undefined,
        identifier: undefined,
      }
      if (result instanceof Error) {
        newState.error = result
      } else {
        newState.identifier = result
      }

      return newState
    },
  },
  state: {},
})
