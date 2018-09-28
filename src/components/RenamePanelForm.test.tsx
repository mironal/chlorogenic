import * as React from "react"

import { render } from "react-testing-library"
import RenamePanelForm from "./RenamePanelForm"

it("snapshot", () => {
  {
    const { container } = render(<RenamePanelForm />)
    expect(container.firstChild).toMatchSnapshot()
  }

  {
    const { container } = render(
      <RenamePanelForm
        defaultName="(◍•ᴗ•◍)"
        onClickCancel={jest.fn()}
        onClickDelete={jest.fn()}
        onClickOk={jest.fn()}
      />,
    )
    expect(container.firstChild).toMatchSnapshot()
  }
})
