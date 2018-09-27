import { navigate } from "@reach/router"
import * as React from "react"
import * as renderer from "react-test-renderer"
import Sidebar from "./Sidebar"

it("should change active className", () => {
  const panels = [
    {
      name: "hoge",
      columns: [],
    },
    {
      name: "huga",
      columns: [],
    },
  ]

  panels.forEach((_, index) => {
    // if navigated to "/0", the "/0" link becomes .nav-active. the others are .nav.
    // if navigated to "/1", the "/1" link becomes .nav-active. the others are .nav.

    navigate(`/${index}`)
    const tree = renderer
      .create(<Sidebar panelIndex={index} panels={panels} />)
      .toJSON()

    expect(tree).toMatchSnapshot()
  })
})
