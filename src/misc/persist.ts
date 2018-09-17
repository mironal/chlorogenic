import { Plugin } from "@rematch/core"

export interface PersistConfig {
  whitelist: string[]
  version?: number
  delay?: number
  debug?: boolean
}

export let persister: { purge(): void }

const persistPlugin = (config: PersistConfig): Plugin => {
  if (persister) {
    throw new Error(
      "Currently only one instance of persistPlugin can be created.",
    )
  }
  const { whitelist, debug, version, delay } = config
  let merged = {}
  const rootKey = `persist:root-${version || -1}`
  const debugLog =
    debug && process.env.NODE_ENV !== "production"
      ? // tslint:disable-next-line:no-console
        console.debug
      : (message?: any, ...optionalParams: any[]) => {
          /*NOOP*/
        }

  let timerHandler: number | undefined
  const storeLazy = () => {
    if (timerHandler) {
      debugLog("persist:cancel:store")
      clearTimeout(timerHandler)
      timerHandler = undefined
    }

    timerHandler = window.setTimeout(() => {
      storeImmediate()
    }, delay || 1000)
  }
  const storeImmediate = () => {
    if (timerHandler) {
      debugLog("persist:cancel:store")
      clearTimeout(timerHandler)
      timerHandler = undefined
    }
    debugLog("persist:store")
    localStorage.setItem(rootKey, JSON.stringify(merged))
  }

  persister = {
    purge: () => {
      localStorage.removeItem(rootKey)
      merged = {}
    },
  }

  return {
    onInit() {
      const str = localStorage.getItem(rootKey)
      if (str) {
        try {
          const obj = JSON.parse(str)
          debugLog("persist:restore", obj)
          merged = obj
        } catch (e) {
          // tslint:disable-next-line:no-console
          console.error("persist:restore", e)
          localStorage.removeItem(rootKey)
        }
      }
    },
    onStoreCreated(store) {
      store.dispatch({ type: "@@RESTORE", payload: merged })
    },
    middleware: store => next => action => {
      const { type } = action
      if (typeof type === "string") {
        const key = whitelist.find(w => type.startsWith(w))
        if (key) {
          const nextState = next(action)
          const after = store.getState()
          merged = { ...merged, [key]: after[key] || {} }
          debugLog("persist:schedule:store", key, after[key])
          storeLazy()
          return nextState
        }
      }
      return next(action)
    },
  }
}

export default persistPlugin
