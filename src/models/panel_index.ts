import { createModel, ModelConfig } from "@rematch/core"
import CHLOError from "../misc/CHLOError"

export type PanelIndexModel = number

export default createModel<PanelIndexModel, ModelConfig<PanelIndexModel>>({
  reducers: {
    update: (state, index: number) => {
      if (typeof index !== "number") {
        throw new CHLOError("Invalid payload")
      }
      return index
    },
  },
  state: 0,
})
