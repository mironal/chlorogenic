import * as React from "react"

import { render } from "react-testing-library"
import HeaderMenu from "./HeaderMenu"

it("snapshot", () => {
  {
    const { container } = render(<HeaderMenu />)
    expect(container.firstChild).toMatchSnapshot()
  }
  {
    const { container } = render(
      <HeaderMenu
        left={<p>left</p>}
        right={<p>right</p>}
        center={<p>center</p>}
      />,
    )
    expect(container.firstChild).toMatchSnapshot()
  }
})
