import * as React from "react"
import { ConnectDropTarget, DropTarget } from "react-dnd"
import {
  GitHubProjectCard,
  GitHubProjectColumn,
  GitHubProjectColumnIdentifier,
} from "../../models/github.types"

import styled from "../../appearance/styled"
import { isSameProject } from "../../misc/github"
import { DragAllCardHandleProps } from "./DragAllCardHandle"
import ProjectCard, { CardProps } from "./ProjectCard"

const ErrorSpan = styled.span`
  color: ${({ theme }) => theme.redColor};
`

const CopySpan = styled.span`
  color: ${({ theme }) => theme.blueColor};
  > span {
    font-size: xx-large;
  }
`

const MoveSpan = styled.span`
  color: ${({ theme }) => theme.yellowColor};
  > span {
    font-size: xx-large;
  }
`

export interface ProjectColumnProps {
  readOnly?: boolean
  loading?: boolean
  identifier: GitHubProjectColumnIdentifier
  column?: GitHubProjectColumn
  onDropCards?(
    column: GitHubProjectColumnIdentifier,
    cards: GitHubProjectCard[],
  ): void
}

interface DnDTargetProps {
  canDrop?: boolean
  isOver?: boolean
  connectDropTarget?: ConnectDropTarget
  item?: { identifier: GitHubProjectColumnIdentifier }
  itemType?: string
}

export default DropTarget<ProjectColumnProps & DnDTargetProps>(
  ["Card", "All-Card"],
  {
    drop(props, monitor) {
      const { identifier, onDropCards } = props
      if (monitor.getItemType() === "Card") {
        const card = monitor.getItem() as CardProps
        if (onDropCards && identifier) {
          onDropCards(identifier, [card.card])
        }
      } else if (monitor.getItemType() === "All-Card") {
        const { cards } = monitor.getItem() as DragAllCardHandleProps
        if (onDropCards && identifier) {
          onDropCards(identifier, cards)
        }
      }
      return props
    },
    canDrop(props, monitor) {
      if (props.readOnly === true) {
        return false
      }
      if (monitor.getItemType() === "Card") {
        const cardProp = monitor.getItem() as CardProps
        if (!props.column || props.column.id === cardProp.identifier.id) {
          return false
        }

        if (!cardProp.card.issue && cardProp.card.note) {
          return isSameProject(
            props.identifier.project,
            cardProp.identifier.project,
          )
        }

        return !!cardProp.card.issue
      }
      return (
        monitor.getItemType() === "All-Card" &&
        monitor.getItem().identifier.id !== props.identifier.id
      )
    },
  },
  (connect, monitor) => {
    return {
      connectDropTarget: connect.dropTarget(),
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
      item: monitor.getItem(),
      itemType: monitor.getItemType(),
    }
  },
)(props => {
  const {
    loading,
    column,
    identifier,
    connectDropTarget,
    isOver,
    canDrop,
    item,
    itemType,
  } = props
  if (!connectDropTarget) {
    return null
  }

  const myColumn = () => column && item && column.id === item.identifier.id
  const cards = loading || !column ? [] : column.cards
  let msg = <span />

  if (item && isOver && canDrop) {
    if (itemType === "Card") {
      if (isSameProject(identifier.project, item.identifier.project)) {
        msg = (
          <MoveSpan>
            The card will be <span>moved</span> to this column
          </MoveSpan>
        )
      } else {
        msg = (
          <CopySpan>
            The card will be <span>copied</span> to this column
          </CopySpan>
        )
      }
    } else if (itemType === "All-Card") {
      if (isSameProject(identifier.project, item.identifier.project)) {
        msg = (
          <MoveSpan>
            All cards will be <span>moved</span> to this column
          </MoveSpan>
        )
      } else {
        msg = (
          <CopySpan>
            All cards will be <span>copied</span> to this column
          </CopySpan>
        )
      }
    }
  } else if (isOver && !canDrop && !myColumn()) {
    msg = <ErrorSpan>The card Can not copy or move.</ErrorSpan>
  }
  return connectDropTarget(
    <div className="DragProjectColumn">
      {loading && <p>Loading...</p>}
      {msg}
      {cards.map(c => (
        <ProjectCard key={c.id} card={c} identifier={identifier} />
      ))}
      {cards.length === 0 && <p>There are no cards.</p>}
    </div>,
  )
})
