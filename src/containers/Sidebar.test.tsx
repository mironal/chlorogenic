import { navigate } from "@reach/router"
import * as React from "react"
import { cleanup, fireEvent, render } from "react-testing-library"
import Sidebar from "./Sidebar"

afterEach(() => {
  navigate("/")
  cleanup()
})

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

    const { container } = render(<Sidebar panelIndex={index} panels={panels} />)

    navigate(`/${index}`)

    expect(container.firstChild).toMatchSnapshot()
  })
})

it("should change location when link clicked", () => {
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

  const { getByText } = render(<Sidebar panelIndex={0} panels={panels} />)

  expect(window.location.pathname).toEqual("/")
  fireEvent.click(getByText("hoge"))
  expect(window.location.pathname).toEqual("/0")
  fireEvent.click(getByText("huga"))
  expect(window.location.pathname).toEqual("/1")
  fireEvent.click(getByText("hoge"))
  expect(window.location.pathname).toEqual("/0")
})

it("should handle click", () => {
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

  const handleOnClickAdd = jest.fn()
  const handleOnClickEdit = jest.fn()

  const { getByText } = render(
    <Sidebar
      panelIndex={0}
      panels={panels}
      onClickAdd={handleOnClickAdd}
      onClickEdit={handleOnClickEdit}
    />,
  )

  fireEvent.click(getByText("Add new panel"))

  expect(handleOnClickAdd).toHaveBeenCalledTimes(1)

  fireEvent.click(getByText("hoge").nextElementSibling as HTMLElement)
  fireEvent.click(getByText("huga").nextElementSibling as HTMLElement)

  expect(handleOnClickEdit).toHaveBeenCalledTimes(2)
})
