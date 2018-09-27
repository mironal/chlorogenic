import * as React from "react"
import { ConnectDragSource, DragSource } from "react-dnd"
import {
  GitHubProjectCard,
  GitHubProjectColumnIdentifier,
} from "../../models/github.types"
import { Icon } from "../parts"

export interface DragAllCardHandleProps {
  identifier: GitHubProjectColumnIdentifier
  cards: GitHubProjectCard[]
}

interface DnDTargetProps {
  connectDragSource: ConnectDragSource
  isDragging: boolean
}

export default DragSource<DragAllCardHandleProps, DnDTargetProps>(
  "All-Card",
  {
    beginDrag(props) {
      return props
    },
  },
  (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  }),
)(props => {
  const { connectDragSource } = props as DnDTargetProps & DragAllCardHandleProps
  return (
    connectDragSource &&
    connectDragSource(
      <div style={{ height: "100%" }}>
        <Icon type="dragHorizontal" size={0.6} />
        {props.children}
      </div>,
    )
  )
})
