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
  loading?: boolean
  identifier?: GitHubProjectColumnIdentifier
  column?: GitHubProjectColumn
  onDropCard?(
    column: GitHubProjectColumnIdentifier,
    card: GitHubProjectCard,
  ): void
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
      const { identifier, onDropCard } = props
      const card = monitor.getItem() as CardProps
      if (onDropCard && identifier) {
        onDropCard(identifier, card.card)
      }
      return props
    },
    canDrop(props, monitor) {
      const cardProp = monitor.getItem()
      if (!props.column) {
        return false
      }
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
  const {
    loading,
    column,
    item,
    identifier,
    connectDropTarget,
    isOver,
    canDrop,
  } = props

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

  const cards = loading || !column ? [] : column.cards
  return connectDropTarget
    ? connectDropTarget(
        <div style={{ height: "100%" }}>
          {loading && <p>Loading...</p>}
          {msg}
          <DragHorizontalIcon />
          {cards.map(c => (
            <ProjectCard key={c.id} card={c} identifier={identifier} />
          ))}
        </div>,
      )
    : null
})
