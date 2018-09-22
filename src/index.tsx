import firebase from "firebase"
import React from "react"
import ReactDOM from "react-dom"
import App from "./App"
import { injectGlobal } from "./appearance/styled"
import registerServiceWorker from "./registerServiceWorker"

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

// tslint:disable-next-line:no-unused-expression
injectGlobal`
  html {
    height: 100%;
  }
  body {
    height: 100%;
    margin: 0;
    font-family: "Noto Sans", "Noto Sans CJK JP", "Roboto" ,sans-serif;
  }
  input {
    font-family: inherit;
    outline: 0;
    line-height: 1.2em;
    border: 1px solid rgba(34, 36, 38, 0.15);
    border-radius: 0.3em;
    box-shadow: none;
    padding: 0.2em;
    font-size: 1em;
  }

`

ReactDOM.render(<App />, document.getElementById("root") as HTMLElement)
registerServiceWorker()
