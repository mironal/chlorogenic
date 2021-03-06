import * as React from "react"
import styled from "../appearance/styled"
import Flexbox, { Box } from "./parts/Flexbox"

const HeaderContainer = styled(Flexbox)`
  padding: 0em 1em;
  align-items: center;
  background: ${({ theme }) => theme.backgroundColor};
  height: 3em;
  border-bottom: solid 1px ${({ theme }) => theme.baseColor};
`

const Left = styled(Box)`
  flex-grow: 1;
`
const Center = styled(Box)`
  flex-grow: 1;
`
const Right = styled(Flexbox)`
  flex-grow: 1;
  margin-left: auto;
  justify-content: flex-end;
`

export interface HeaderMenuProps {
  left?: React.ReactNode
  center?: React.ReactNode
  right?: React.ReactNode
}

export default ({ left, center, right }: HeaderMenuProps) => {
  return (
    <HeaderContainer>
      <Left>{left}</Left>
      <Center>{center}</Center>
      <Right>{right}</Right>
    </HeaderContainer>
  )
}
