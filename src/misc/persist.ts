import { Plugin } from "@rematch/core"

export interface PersistConfig {
  whitelist: string[]
  version?: number
  throttle?: number
  debug?: boolean
}

const persistPlugin = (config: PersistConfig): Plugin => {
  const { whitelist, debug, version } = config
  let merged = {}
  const rootKey = `persist:root-${version || -1}`
  const debugLog = debug
    ? // tslint:disable-next-line:no-console
      console.debug
    : (message?: any, ...optionalParams: any[]) => {
        /*NOOP*/
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
          console.error("persist:onStoreCreated", e)
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
          localStorage.setItem(rootKey, JSON.stringify(merged))
          debugLog("persist:store", key, after[key])
          return nextState
        }
      }
      return next(action)
    },
  }
}

export default persistPlugin
