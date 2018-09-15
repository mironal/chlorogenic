import React from "react"
import { Flexbox } from ".."
import styled from "../Styled"
import { VFlexbox } from "./Flexbox"

const ColumnContainer = styled(VFlexbox)`
  border: solid 1px gray;
  border-radius: 4px;
  padding: 0.4em;
  margin: 2px;
  background: ${({ theme }) => theme.secondaryBackground};
  width: 16em;
`

ColumnContainer.displayName = "ColumnContainer"

const Scroller = styled(Flexbox)`
  overflow-x: auto;
  flex-direction: column;
`

const Header = styled.h3`
  margin: 0;
  font-size: large;
  margin-bottom: 1em;
`

const Description = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.secondaryText};
  font-size: small;
  text-align: right;
`

export interface ColumnContainerProps {
  header: string
  description?: string
}

const Layouted: React.SFC<ColumnContainerProps> = ({
  header,
  description,
  children,
}) => (
  <ColumnContainer>
    <Header>
      {header}
      {description && <Description>{description}</Description>}
    </Header>
    <Scroller>{children}</Scroller>
  </ColumnContainer>
)
export default Layouted
