import { RematchDispatch, RematchRootState } from "@rematch/core"
import React from "react"
import { connect } from "react-redux"
import { Button, Segment } from "semantic-ui-react"
import styled from "styled-components"
import Editor from "./SplitProjectPanel/Editor"

import { models } from "../store"
import Viewer from "./SplitProjectPanel/Viewer"

export const Segment2 = styled(Segment)`
  height: 100vh;
  overflow-x: hidden;
  overflow-y: scroll;
  &&& {
    width: 100%;
  }
`

type Props = ReturnType<typeof margeProps>

const Board = ({ panel, editing, canSave, startEdit, endEdit }: Props) => {
  if (!panel) {
    throw new Error("panel is required.")
  }

  if (editing) {
    return (
      <>
        <Button disabled={!canSave} onClick={endEdit}>
          Save
        </Button>
        <Editor panel={panel} />
      </>
    )
  } else {
    return (
      <>
        <Button onClick={startEdit}>Edit</Button>
        <Viewer panel={panel} />
      </>
    )
  }
}

const mapState = ({
  dashboard: { activePanelIndex, panels, editing, canSave },
}: RematchRootState<models>) => ({
  editing,
  canSave,
  panel: activePanelIndex >= 0 ? panels[activePanelIndex] : undefined,
})

const mapDispatch = ({
  dashboard: { startEdit, endEdit },
}: RematchDispatch<models>) => ({ startEdit, endEdit })

const margeProps = (
  { ...rest }: ReturnType<typeof mapState>,
  { ...fns }: ReturnType<typeof mapDispatch>,
) => ({
  ...rest,
  ...fns,
})

export default connect(
  mapState,
  mapDispatch,
  margeProps,
)(Board)
