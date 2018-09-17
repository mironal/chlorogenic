import React from "react"
import { ConnectDragSource, DragSource } from "react-dnd"
import {
  GitHubProjectCard,
  GitHubProjectColumnIdentifier,
} from "../models/github.types"
import { Box } from "../UX"
import styled from "../UX/Styled"

const CardBox = styled(Box)`
  border-radius: 4px;
  padding: 0.2em;
  border-bottom: solid 1px ${({ theme }) => theme.secondaryBackgroundColor};
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
