import * as React from "react"
import styled from "../appearance/styled"
import Button from "./parts/Button"
import Flexbox, { VFlexbox } from "./parts/Flexbox"

const Title = styled.h3`
  margin: 0;
  margin-bottom: 0.4em;
  padding: 0;
`

export interface RenamePanelFormProps {
  defaultName?: string
  onClickOk?(name: string): void
  onClickCancel?(): void
  onClickDelete?(): void
}

class RenamePanelForm extends React.PureComponent<RenamePanelFormProps> {
  private inputRef = React.createRef<HTMLInputElement>()
  public render() {
    const { defaultName, onClickCancel, onClickOk, onClickDelete } = this.props
    return (
      <VFlexbox>
        <Title>Edit name</Title>
        <input
          autoFocus={true}
          defaultValue={defaultName}
          ref={this.inputRef}
        />
        <Flexbox>
          <Button onClick={onClickDelete} negative={true}>
            Delete
          </Button>
          <Button onClick={onClickCancel}>Cancel</Button>
          <Button
            onClick={() =>
              this.inputRef &&
              onClickOk &&
              onClickOk(this.inputRef.current!.value)
            }
            positive={true}
          >
            Change name
          </Button>
        </Flexbox>
      </VFlexbox>
    )
  }
}

export default RenamePanelForm

const ModalStyle = styled(Flexbox)`
  margin: 1em;
`

export const RenamePanelFormDialog = (props: RenamePanelFormProps) => (
  <ModalStyle>
    <RenamePanelForm {...props} />
  </ModalStyle>
)
