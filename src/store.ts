import { init } from "@rematch/core"
import persistPluginFactory from "./misc/persist"
import models from "./models"
const persistPlugin = persistPluginFactory({
  whitelist: ["auth", "dashboard"],
  debug: true,
  delay: 5000,
})
export type models = typeof models
export const store = init({
  name: "chlorogenic",
  plugins: [persistPlugin],
  models,
})
