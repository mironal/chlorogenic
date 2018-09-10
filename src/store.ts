import { init } from "@rematch/core"
import persistPluginFactory, { persistor } from "./misc/persist"
import models from "./models"
const persistPlugin = persistPluginFactory({
  whitelist: ["auth", "dashboard"],
  debug: true,
  delay: 2000,
})

export type models = typeof models
export const store = init({
  redux: {
    rootReducers: {
      "@@SIGNOUT": (state, action) => {
        persistor.purge()
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
