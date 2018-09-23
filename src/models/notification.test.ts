import { init } from "@rematch/core"

import { Bug } from "../misc/errors"
import notification from "./notification"

describe("reducers", () => {
  it("_setSuccess should dispatch an action", () => {
    const store = init({ models: { notification } })

    store.dispatch.notification._setSuccess("(o´_`o)")

    {
      const state = store.getState().notification

      expect(state.type).toEqual("success")
      expect(state.message).toEqual("(o´_`o)")
      expect(state.description).toBeUndefined()
      expect(state.notifyingError).toBeUndefined()
    }

    store.dispatch.notification._setSuccess({
      message: "(੭•̀ᴗ•̀)",
      description: "φ(•ᴗ•๑)",
    })

    {
      const state = store.getState().notification

      expect(state.type).toEqual("success")
      expect(state.message).toEqual("(੭•̀ᴗ•̀)")
      expect(state.description).toEqual("φ(•ᴗ•๑)")
      expect(state.notifyingError).toBeUndefined()
    }
  })

  it("_setError should dispatch an action", () => {
    const store = init({ models: { notification } })

    const error = new Bug("Invalid payload", "(>︿<｡)")
    store.dispatch.notification._setError(error)

    const state = store.getState().notification

    expect(state.type).toEqual("error")
    expect(state.message).toEqual("Invalid payload")
    expect(state.description).toEqual("(>︿<｡)")
    expect(state.notifyingError).toBe(error)
  })

  it("clear should dispatch an action", () => {
    const store = init({ models: { notification } })

    const error = new Bug("Invalid payload", "(>︿<｡)")
    store.dispatch.notification.showError(error)

    store.dispatch.notification.clear()

    const state = store.getState().notification
    expect(state.type).toBeUndefined()
    expect(state.message).toBeUndefined()
    expect(state.description).toBeUndefined()
    expect(state.notifyingError).toBeUndefined()
  })
})
