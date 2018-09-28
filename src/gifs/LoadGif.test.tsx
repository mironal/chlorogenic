import * as React from "react"
import { render, wait } from "react-testing-library"
import LoadGif, { LoadGifProps } from "./LoadGif"

it("snapshot", async () => {
  const gifs: Array<LoadGifProps["gif"]> = ["add", "move", "sync"]
  for (const gif of gifs) {
    const { container, queryByAltText } = render(<LoadGif gif={gif} />)

    expect(container.firstChild).toMatchSnapshot()

    await wait(() => {
      const img: HTMLImageElement = queryByAltText(
        "Loading...",
      ) as HTMLImageElement
      return expect(img.src).not.toBeFalsy()
    })

    expect(container.firstChild).toMatchSnapshot()
  }
})
