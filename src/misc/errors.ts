// tslint:disable:max-classes-per-file
import { NotificationContent } from "../models/notification"

export type BugMessage =
  | "Invalid payload"
  | "Invalid state"
  | "Invalid argument"

export class Bug extends Error implements NotificationContent {
  public name = "Bug"
  constructor(message: BugMessage, public description?: string) {
    super(message)
    Object.setPrototypeOf(this, new.target.prototype)
  }
}

export type RecoverableErrorMessage =
  | "Organization not found"
  | "Project not found"
  | "Repository not found"
  | "Invalid input"
export class RecoverableError extends Error implements NotificationContent {
  public name = "RecoverableError"
  constructor(message: RecoverableErrorMessage, public description?: string) {
    super(message)
    Object.setPrototypeOf(this, new.target.prototype)
  }
}
