import { createModel, ModelConfig } from "@rematch/core"
import CHLOError from "../misc/CHLOError"

export interface NotificationModel {
  type?: "error" | "success"
  message?: string
  description?: string
  notifyingError?: Error
}

export type SetSuccessPayload =
  | Pick<NotificationModel, "message" | "description">
  | string

export default createModel<NotificationModel, ModelConfig<NotificationModel>>({
  reducers: {
    clear: () => {
      return {}
    },
    setSuccess: (state, payload: SetSuccessPayload) => {
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
    setError: (state, payload: CHLOError) => {
      if (process.env.NODE_ENV !== "production") {
        if (!(payload instanceof CHLOError)) {
          const error = new CHLOError(
            "Invalid payload",
            "payload must be a CHLOError instance",
            payload,
          )
          // tslint:disable:no-console
          console.error(payload, error)
        }
        console.log(JSON.parse(JSON.stringify(payload)))
      }
      return {
        type: "error",
        message: payload.message,
        description: payload.description,
        notifyingError: payload,
      }
    },
  },
  state: {},
})
