import CloseIcon from "mdi-react/CloseIcon"
import React from "react"
import { Flexbox } from ".."
import styled from "../Styled"
import Button from "./Button"
import { VFlexbox } from "./Flexbox"

const ColumnContainer = styled(VFlexbox)`
  border: solid 1px ${({ theme }) => theme.baseColor};
  border-top: 0;
  border-bottom: 0;
  padding: 0.6em;
  padding-bottom: 0;
  background: ${({ theme }) => theme.backgroundColor};
  width: 16em;
  margin-left: 0.2em;
`

ColumnContainer.displayName = "ColumnContainer"

const Scroller = styled(Flexbox)`
  height: 100%;
  overflow-x: auto;
  flex-direction: column;
`

const Header = styled(Flexbox)`
  margin: 0;
  font-size: large;
  align-items: flex-start;
  h3 {
    margin: 0;
  }

  button {
    margin: 0;
    padding: 0;
    margin-left: auto;
    &:hover {
      background: ${({ theme }) => theme.redColor};
    }
  }
`

const Description = styled.p`
  white-space: pre;
  margin: 0;
  color: ${({ theme }) => theme.secondaryTextColor};
  font-size: small;
  text-align: right;
`

export interface ColumnContainerProps {
  header: string
  description?: string
  onClickClose?(): void
}

const Layouted: React.SFC<ColumnContainerProps> = ({
  header,
  description,
  onClickClose,
  children,
}) => (
  <ColumnContainer>
    <Header>
      <h3>{header}</h3>
      {onClickClose && (
        <Button size="small" transparent={true} onClick={onClickClose}>
          <CloseIcon size={12} />
        </Button>
      )}
    </Header>
    {description && <Description>{description}</Description>}
    <Scroller>{children}</Scroller>
  </ColumnContainer>
)
export default Layouted
