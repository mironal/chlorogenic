import * as React from "react"

import { render } from "react-testing-library"
import { SignInView } from "./SignIn"

it("snapshot", () => {
  const { container } = render(<SignInView onClickSignIn={jest.fn()} />)
  expect(container.firstChild).toMatchSnapshot()
})
