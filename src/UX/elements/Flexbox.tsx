import styled from "../Styled"

export const Box = styled.div`
  display: block;
`

Box.displayName = "Box"

const Flexbox = styled.div`
  display: flex;
`

Flexbox.displayName = "Flexbox"

export default Flexbox

export const VFlexbox = styled.div`
  display: flex;
  flex-direction: column;
`

VFlexbox.displayName = "VFlexbox"
