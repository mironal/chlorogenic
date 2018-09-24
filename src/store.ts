import { init } from "@rematch/core"
import initialize from "./firebase/initialize"
import models from "./models"

initialize()

export type models = typeof models
export const store = init({
  redux: {
    rootReducers: {
      "@@SIGNOUT": (state, action) => {
        return undefined
      },
    },
  },
  name: "chlorogenic",
  plugins: [],
  models,
})

export const resetOnSignout = () => store.dispatch({ type: "@@SIGNOUT" })
