import { NotificationModel } from "../models/notification"

export type CHLOErrorMessage =
  | "Invalid string format"
  | "Invalid payload"
  | "project fetch error"
  | "Invalid response format"
  | "Project not found"
  | "Organization not found"

export default class CHLOError extends Error implements NotificationModel {
  constructor(
    message: CHLOErrorMessage,
    public description: string = "",
    public srcError?: Error,
  ) {
    super(message)
    Object.setPrototypeOf(this, new.target.prototype)
  }
}
