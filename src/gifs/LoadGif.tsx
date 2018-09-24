import * as React from "react"
import styled from "../appearance/styled"

const Image = styled.img`
  width: 100%;
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
`

export type LoadGifProps = {
  gif: "add" | "move" | "sync"
} & React.DetailedHTMLProps<
  React.ImgHTMLAttributes<HTMLImageElement>,
  HTMLImageElement
>

export default class extends React.PureComponent<LoadGifProps, { file?: any }> {
  public state = { file: undefined }
  public componentDidMount() {
    import(`./${this.props.gif}.gif`)
      .then(file => this.setState({ file }))
      .catch(error => {
        // tslint:disable-next-line:no-console
        console.error(error)
      })
  }

  public render() {
    return <Image src={this.state.file} alt="Loading..." />
  }
}
