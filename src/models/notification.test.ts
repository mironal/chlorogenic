import { init } from "@rematch/core"
import CHLOError from "../misc/CHLOError"
import notification from "./notification"

describe("reducers", () => {
  it("setSuccess should dispatch an action", () => {
    const store = init({ models: { notification } })

    store.dispatch.notification.setSuccess("(o´_`o)")

    {
      const state = store.getState().notification

      expect(state.type).toEqual("success")
      expect(state.message).toEqual("(o´_`o)")
      expect(state.description).toBeUndefined()
      expect(state.notifyingError).toBeUndefined()
    }

    store.dispatch.notification.setSuccess({
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

  it("setError should dispatch an action", () => {
    const store = init({ models: { notification } })

    const error = new CHLOError("Invalid payload", "(>︿<｡)")
    store.dispatch.notification.setError(error)

    const state = store.getState().notification

    expect(state.type).toEqual("error")
    expect(state.message).toEqual("Invalid payload")
    expect(state.description).toEqual("(>︿<｡)")
    expect(state.notifyingError).toBe(error)
  })

  it("clear should dispatch an action", () => {
    const store = init({ models: { notification } })

    const error = new CHLOError("Invalid payload", "(>︿<｡)")
    store.dispatch.notification.setError(error)

    store.dispatch.notification.clear()

    const state = store.getState().notification
    expect(state.type).toBeUndefined()
    expect(state.message).toBeUndefined()
    expect(state.description).toBeUndefined()
    expect(state.notifyingError).toBeUndefined()
  })
})
