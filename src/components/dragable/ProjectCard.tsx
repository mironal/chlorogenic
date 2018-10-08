import * as React from "react"
import { ConnectDragSource, DragSource } from "react-dnd"
import styled from "../../appearance/styled"
import {
  GitHubProjectCard,
  GitHubProjectColumnIdentifier,
} from "../../models/github.types"
import { Box } from "../parts/Flexbox"
import Markdown from "../parts/Markdown"

const CardBox = styled(Box)`
  border-radius: 4px;
  padding: 0.2em;
  border-bottom: solid 1px ${({ theme }) => theme.secondaryBackgroundColor};
  margin-bottom: 0.2em;
  font-size: small;
`

export interface CardProps {
  identifier: GitHubProjectColumnIdentifier
  card: GitHubProjectCard
}
interface DnDTargetProps {
  connectDragSource: ConnectDragSource
  isDragging: boolean
}

export default DragSource<CardProps, DnDTargetProps>(
  "Card",
  {
    beginDrag(props) {
      return props
    },
  },
  (connect, monitor) => {
    return {
      connectDragSource: connect.dragSource(),
      isDragging: monitor.isDragging(),
    }
  },
)(props => {
  const { card, connectDragSource } = props as DnDTargetProps & CardProps
  let Content = <span>Unknown</span>
  if (card.note) {
    Content = <Markdown>{card.note}</Markdown>
  } else if (card.issue) {
    Content = (
      <Markdown
        source={`[${card.issue.title} #${card.issue.number}](${
          card.issue.url
        })`}
      />
    )
  }

  return (
    <CardBox innerRef={instance => connectDragSource(instance)}>
      {Content}
    </CardBox>
  )
})
