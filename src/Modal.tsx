import React from "react"
import ReactDOM from "react-dom"
import styled from "./appearance/styled"

const ModalContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  z-index: 100;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background: #bfc7b64d;
`

const ModalContent = styled.div`
  background: #ffffffc2;
  border-radius: 4px;
`

export interface ModalProps {
  onClickOutside?(): void
}
class Modal extends React.PureComponent<ModalProps> {
  private el: Element
  private modalRoot = document.getElementById("modal")!
  constructor(props: {}) {
    super(props)
    this.el = document.createElement("div")
  }

  public componentDidMount() {
    this.modalRoot.appendChild(this.el)
  }
  public componentWillUnmount() {
    this.modalRoot.removeChild(this.el)
  }
  public render() {
    return ReactDOM.createPortal(
      this.props.children ? (
        <ModalContainer onClick={this.props.onClickOutside}>
          <ModalContent
            onClick={ev => {
              if (this.props.onClickOutside) {
                ev.stopPropagation()
                ev.nativeEvent.stopImmediatePropagation()
              }
            }}
          >
            {this.props.children}
          </ModalContent>
        </ModalContainer>
      ) : (
        undefined
      ),
      this.el,
    )
  }
}

export default Modal
