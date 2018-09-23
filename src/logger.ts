// tslint:disable:no-console
import { Bug, RecoverableError } from "./misc/errors"

export interface Logger {
  debug(message: string, ...args: any[]): void
  error(error: Error): void
}

export default {
  debug(message, ...args) {
    console.debug(message, args)
  },

  error(error: Error) {
    if (process.env.NODE_ENV === "test") {
      return // ignore
    }
    if (error instanceof Bug) {
      // TODO: error reporter
      console.error("This is a Bug\n", error)
    } else if (error instanceof RecoverableError) {
      if (process.env.NODE_ENV === "development") {
        console.warn("This is a RecoverableError\n", error)
      }
    } else {
      console.error(error)
    }
  },
} as Logger
