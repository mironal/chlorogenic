import React from "react"
import ReactDOM from "react-dom"
import App from "./App"
import { injectGlobal } from "./appearance/styled"
import registerServiceWorker from "./registerServiceWorker"

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
