import * as React from "react"
import * as renderer from "react-test-renderer"
import ColumnContainer from "./ColumnContainer"
it("snapshot", () => {
  {
    const tree = renderer
      .create(<ColumnContainer header="header text" />)
      .toJSON()
    expect(tree).toMatchSnapshot()
  }
})
