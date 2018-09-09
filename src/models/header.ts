import { createModel, ModelConfig } from "@rematch/core"
import firebase from "firebase/app"

export interface HeaderModel {
  user?: firebase.UserInfo
}

export default createModel<HeaderModel, ModelConfig<HeaderModel>>({
  state: {},
})
