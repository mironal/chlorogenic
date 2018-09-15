import styled from "../Styled"
import { VFlexbox } from "./Flexbox"

export const ColumnContainer = styled(VFlexbox)`
  border: solid 1px gray;
  border-radius: 4px;
  padding: 0.4em;
  margin: 2px;
  background: ${({ theme }) => theme.secondaryBackground};
  width: 16em;
`
ColumnContainer.displayName = "ColumnContainer"
