import firebase from "firebase"
import React from "react"
import ReactDOM from "react-dom"
import { Provider } from "react-redux"
import App from "./App"
import "./index.css"
import registerServiceWorker from "./registerServiceWorker"
import { store } from "./store"

const config = {
  apiKey: process.env.REACT_APP_FIREBASE_apiKey,
  authDomain: process.env.REACT_APP_FIREBASE_authDomain,
  databaseURL: process.env.REACT_APP_FIREBASE_databaseURL,
  messagingSenderId: process.env.REACT_APP_FIREBASE_messagingSenderId,
  projectId: process.env.REACT_APP_FIREBASE_projectId,
  storageBucket: process.env.REACT_APP_FIREBASE_storageBucket,
}

if (process.env.NODE_ENV !== "production") {
  Object.values(config).forEach(v => {
    if (v === undefined) {
      throw new Error(
        `Invalid firebase config. please check .env file: ${JSON.stringify(
          config,
        )}`,
      )
    }
  })
}

firebase.initializeApp(config)

const Root = () => (
  <Provider store={store}>
    <App />
  </Provider>
)

ReactDOM.render(<Root />, document.getElementById("root") as HTMLElement)
registerServiceWorker()
