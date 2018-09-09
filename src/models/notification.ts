import { createModel, ModelConfig } from "@rematch/core"

export interface NotificationModel {
  type?: "error" | "success"
  message?: string
  description?: string
}

export default createModel<NotificationModel, ModelConfig<NotificationModel>>({
  reducers: {
    clear: () => {
      return {}
    },
    setSuccess: (
      state,
      {
        message,
        description,
      }: Pick<NotificationModel, "message" | "description">,
    ) => {
      if (!message) {
        // tslint:disable-next-line:no-console
        console.warn(
          "To clear the notification, 'clear' method is recommended.",
        )
        return {}
      }

      return { type: "success", message, description }
    },
    setError: (
      state,
      {
        message,
        description,
      }: Pick<NotificationModel, "message" | "description">,
    ) => {
      if (!message) {
        // tslint:disable-next-line:no-console
        console.warn(
          "To clear the notification, 'clear' method is recommended.",
        )
        return {}
      }
      return { type: "error", message, description }
    },
  },
  state: {},
})
