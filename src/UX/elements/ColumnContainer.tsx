import styled from "../Styled"
import { VFlexbox } from "./Flexbox"

export const ColumnContainer = styled(VFlexbox)`
  border: solid 1px gray;
  border-radius: 4px;
  padding: 4px;
  margin: 2px;
  min-width: 10em;
`
ColumnContainer.displayName = "ColumnContainer"
