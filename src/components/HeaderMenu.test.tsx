import * as React from "react"
import * as renderer from "react-test-renderer"
import HeaderMenu from "./HeaderMenu"

it("snapshot", () => {
  {
    const tree = renderer.create(<HeaderMenu />).toJSON()
    expect(tree).toMatchSnapshot()
  }
  {
    const tree = renderer
      .create(
        <HeaderMenu
          left={<p>left</p>}
          right={<p>right</p>}
          center={<p>center</p>}
        />,
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  }
})
