import DragHorizontalIcon from "mdi-react/DragHorizontalIcon"
import React from "react"
import { ConnectDropTarget, DropTarget } from "react-dnd"
import { isSameProject } from "../misc/github"
import {
  GitHubProjectCard,
  GitHubProjectColumn,
  GitHubProjectColumnIdentifier,
} from "../models/github.types"
import styled from "../UX/Styled"
import ProjectCard, { CardProps } from "./ProjectCard"

const SPAN = styled.span`
  color: ${({ theme }) => theme.redColor};
`

export interface ProjectColumnProps {
  identifier?: GitHubProjectColumnIdentifier
  column: GitHubProjectColumn
  onDropCard?(card: GitHubProjectCard, column: GitHubProjectColumn): void
}

interface DnDTargetProps {
  canDrop?: boolean
  isOver?: boolean
  connectDropTarget?: ConnectDropTarget
  item?: CardProps
}

export default DropTarget<ProjectColumnProps & DnDTargetProps>(
  "Card",
  {
    drop(props, monitor) {
      const { column, onDropCard } = props
      const card = monitor.getItem() as CardProps
      if (onDropCard) {
        onDropCard(card.card, column)
      }
      return props
    },
    canDrop(props, monitor) {
      const cardProp = monitor.getItem()
      if (props.column.id === cardProp.identifier.id) {
        return false
      }
      return !!props.identifier
    },
  },
  (connect, monitor) => {
    return {
      connectDropTarget: connect.dropTarget(),
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
      item: monitor.getItem(),
    }
  },
)(props => {
  const { column, item, identifier, connectDropTarget, isOver, canDrop } = props

  let msg
  if (item && item.identifier && isOver && canDrop && identifier) {
    if (isSameProject(identifier.project, item.identifier.project)) {
      msg = (
        <p>
          The card will be <SPAN>moved</SPAN> to this column
        </p>
      )
    } else {
      msg = (
        <p>
          The card will be <SPAN>copied</SPAN> to this column
        </p>
      )
    }
  }
  return connectDropTarget
    ? connectDropTarget(
        <div>
          {msg}
          <DragHorizontalIcon />
          {column.cards.map(c => (
            <ProjectCard key={c.id} card={c} identifier={identifier} />
          ))}
        </div>,
      )
    : null
})
