import { init } from "@rematch/core"
import models from "./models"

export type models = typeof models
export const store = init({
  models,
})
