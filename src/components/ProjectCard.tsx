import React from "react"
import { DragSource } from "react-dnd"
import {
  GitHubProjectCard,
  GitHubProjectColumnIdentifier,
} from "../models/github.types"
import { Box } from "../UX"
import styled from "../UX/Styled"

const CardBox = styled(Box)`
  border-radius: 4px;
  padding: 0.2em;
  background: ${({ theme }) => theme.baseBackground};
  margin-bottom: 0.2em;
  font-size: small;
`

const EllipsisP = styled.p`
  font-size: small;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin: 2px;
`

export interface CardProps {
  identifier?: GitHubProjectColumnIdentifier
  card: GitHubProjectCard
}

export default DragSource<CardProps>(
  "Card",
  {
    beginDrag(props) {
      return props
    },
    canDrag(props) {
      return !!props.identifier && !!props.card.issue
    },
  },
  (connect, monitor) => {
    return {
      connectDragSource: connect.dragSource(),
      isDragging: monitor.isDragging(),
    }
  },
)(props => {
  const { card, connectDragSource } = props as any
  let Content = <span>Unknown</span>
  if (card.note) {
    Content = <EllipsisP>{card.note}</EllipsisP>
  } else if (card.issue) {
    Content = (
      <a href={card.issue.url} target="_blank">
        <EllipsisP>
          #{card.issue.number} {card.issue.title}
        </EllipsisP>
      </a>
    )
  }

  return (
    <CardBox innerRef={instance => connectDragSource(instance)}>
      {Content}
    </CardBox>
  )
})
