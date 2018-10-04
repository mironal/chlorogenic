import * as React from "react"
import * as ReactMarkdown from "react-markdown"
import styled from "../../appearance/styled"

const StyledMarkdown = styled(ReactMarkdown)`
  font-weight: lighter;
`

export default (
  props: ReactMarkdown.ReactMarkdownProps & { children?: React.ReactNode },
) => <StyledMarkdown linkTarget="_blank" {...props} />
