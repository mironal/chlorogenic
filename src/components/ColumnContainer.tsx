import * as React from "react"
import styled from "../appearance/styled"
import { Icon } from "./parts"
import Button from "./parts/Button"
import Flexbox, { VFlexbox } from "./parts/Flexbox"

const ColumnContainer = styled(VFlexbox)`
  border: solid 1px ${({ theme }) => theme.baseColor};
  border-top: 0;
  border-bottom: 0;
  padding: 0.6em;
  padding-bottom: 0;
  background: ${({ theme }) => theme.backgroundColor};
  width: 16em;
  flex-shrink: 0;
  margin-left: 0.2em;
`

ColumnContainer.displayName = "ColumnContainer"

const Scroller = styled(Flexbox)`
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
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
          <Icon type="close" size={0.6} />
        </Button>
      )}
    </Header>
    {description && <Description>{description}</Description>}
    <Scroller>{children}</Scroller>
  </ColumnContainer>
)
export default Layouted
