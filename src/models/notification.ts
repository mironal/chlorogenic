import {
  createModel,
  ExtractRematchDispatchersFromModel,
  ModelConfig,
} from "@rematch/core"
import { produce } from "immer"
import logger from "../logger"
import { Bug, RecoverableError } from "../misc/errors"

export interface NotificationContent {
  message?: string
  description?: string
}

export interface NotificationModel extends NotificationContent {
  type?: "error" | "success"
  notifyingError?: Error
}

export type SetSuccessPayload =
  | Pick<NotificationModel, "message" | "description">
  | string

const DEFAULT_DISMISS_AFTER = 2000
let timeoutHandle: number | undefined
export default createModel<NotificationModel, ModelConfig<NotificationModel>>({
  effects: dispatch => ({
    showSuccess(payload) {
      if (timeoutHandle) {
        clearTimeout(timeoutHandle)
      }
      this._setSuccess(payload)
      if (
        (typeof payload.dismissAfter === "number" &&
          payload.dismissAfter > 0) ||
        payload.dismissAfter === undefined
      ) {
        timeoutHandle = window.setTimeout(
          this.clear,
          payload.dismissAfter || DEFAULT_DISMISS_AFTER,
        )
      }
    },
    showError(payload) {
      if (timeoutHandle) {
        clearTimeout(timeoutHandle)
      }
      this._setError(payload)

      if (
        typeof payload.dismissAfter === "number" &&
        payload.dismissAfter > 0
      ) {
        timeoutHandle = window.setTimeout(this.clear, payload.dismissAfter)
      }
    },
  }),
  reducers: {
    clear: () => {
      if (timeoutHandle) {
        clearTimeout(timeoutHandle)
        timeoutHandle = undefined
      }
      return {}
    },
    _setSuccess: (state, payload: SetSuccessPayload) => {
      if (typeof payload === "string") {
        return { type: "success", message: payload }
      }
      const { message, description } = payload

      if (!message) {
        // tslint:disable-next-line:no-console
        console.warn(
          "To clear the notification, 'clear' method is recommended.",
        )
        return {}
      }

      return { type: "success", message, description }
    },
    _setError: (state, payload: Error | Bug | RecoverableError) => {
      logger.error(payload)
      const message = payload.message
      let description: string | undefined
      if (payload instanceof Bug || payload instanceof RecoverableError) {
        description = payload.description
      }

      return produce(state, draft => {
        draft.type = "error"
        draft.message = message
        draft.description = description
        draft.notifyingError = payload
      })
    },
  },
  state: {},
})

// action creators

type M = ExtractRematchDispatchersFromModel<ModelConfig<NotificationModel>>
export const createShowSuccess = (m: M) => (
  message: string,
  description: string | undefined = undefined,
  dismissAfter: number | undefined = undefined,
) =>
  m.showSuccess({
    message,
    description,
    dismissAfter,
  })

export const createShowError = (m: M) => (error: Error) => m.showError(error)
