import * as React from "react"
import * as renderer from "react-test-renderer"
import LoadGif, { LoadGifProps } from "./LoadGif"

it("snapshot", async () => {
  const gifs: Array<LoadGifProps["gif"]> = ["add", "move", "sync"]
  for (const gif of gifs) {
    const Comp = renderer.create(<LoadGif gif={gif} />)
    expect(Comp.toJSON()).toMatchSnapshot()

    await (Comp.getInstance() as any) /* hack */
      .componentDidMount()
    expect(Comp.toJSON()).toMatchSnapshot()
  }
})
