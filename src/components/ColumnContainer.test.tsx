import * as React from "react"
import { render } from "react-testing-library"
import ColumnContainer from "./ColumnContainer"
it("snapshot", () => {
  {
    const { container } = render(<ColumnContainer header="header text" />)
    expect(container.firstChild).toMatchSnapshot()
  }
})
