import * as React from "react"
import * as renderer from "react-test-renderer"
import RenamePanelForm from "./RenamePanelForm"

it("snapshot", () => {
  {
    const tree = renderer.create(<RenamePanelForm />).toJSON()
    expect(tree).toMatchSnapshot()
  }

  {
    const tree = renderer
      .create(
        <RenamePanelForm
          defaultName="(◍•ᴗ•◍)"
          onClickCancel={jest.fn()}
          onClickDelete={jest.fn()}
          onClickOk={jest.fn()}
        />,
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  }
})
