import { Plugin } from "@rematch/core"

export interface PersistConfig {
  whitelist: string[]
  version?: number
  delay?: number
  debug?: boolean
}

const persistPlugin = (config: PersistConfig): Plugin => {
  const { whitelist, debug, version, delay } = config
  let merged = {}
  const rootKey = `persist:root-${version || -1}`
  const debugLog = debug
    ? // tslint:disable-next-line:no-console
      console.debug
    : (message?: any, ...optionalParams: any[]) => {
        /*NOOP*/
      }

  let timerHandler: number | undefined
  const lazyStore = () => {
    if (timerHandler) {
      debugLog("persist:cancel:store")
      clearTimeout(timerHandler)
    }

    timerHandler = window.setTimeout(() => {
      debugLog("persist:store")
      localStorage.setItem(rootKey, JSON.stringify(merged))
    }, delay || 1000)
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
    onModel(model) {
      const { name } = model
      const obj = merged[name]
      if (obj) {
        debugLog("persist:initialize state", name, obj)
        model.state = obj
      }
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
          lazyStore()
          return nextState
        }
      }
      return next(action)
    },
  }
}

export default persistPlugin
