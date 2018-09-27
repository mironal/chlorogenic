import * as React from "react"
import * as renderer from "react-test-renderer"
import { SignInView } from "./SignIn"

it("snapshot", () => {
  const tree = renderer
    .create(<SignInView onClickSignIn={jest.fn()} />)
    .toJSON()
  expect(tree).toMatchSnapshot()
})
