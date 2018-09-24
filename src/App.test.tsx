import * as React from "react"
import * as ReactDOM from "react-dom"
import App from "./App"

it("renders without crashing", () => {
  const div = document.createElement("div")

  // Modal が使用する element
  const modal = document.createElement("div")
  modal.setAttribute("id", "modal")
  document.body.appendChild(modal)

  ReactDOM.render(<App />, div)
  ReactDOM.unmountComponentAtNode(div)
})
