import { init } from "@rematch/core"
import initialize from "./firebase/initialize"
import persistPluginFactory, { persister } from "./misc/persist"
import models from "./models"

initialize()

const persistPlugin = persistPluginFactory({
  whitelist: [],
  debug: process.env.NODE_ENV !== "production",
  delay: 2000,
  version: 2,
})

export type models = typeof models
export const store = init({
  redux: {
    rootReducers: {
      "@@SIGNOUT": (state, action) => {
        persister.purge()
        return undefined
      },
      "@@RESTORE": (state, action) => {
        return { ...state, ...action.payload }
      },
    },
  },
  name: "chlorogenic",
  plugins: [persistPlugin],
  models,
})

export const resetOnSignout = () => store.dispatch({ type: "@@SIGNOUT" })
