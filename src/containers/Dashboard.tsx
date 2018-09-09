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

const Top = styled.div`
  display: flex;
  flex-grow: 1;
  margin-top: 1em;
  padding-left: 2px;
  padding-right: 2px;
  & :last-child {
    margin-left: auto;
  }
`

const Board = ({ panel, editing, canSave, startEdit, endEdit }: Props) => {
  if (!panel) {
    throw new Error("panel is required.")
  }

  const Content = editing ? <Editor panel={panel} /> : <Viewer panel={panel} />
  return (
    <Segment>
      <Top>
        <h2>{panel.name || "Untitled"}</h2>
        {editing ? (
          <Button disabled={!canSave} onClick={endEdit}>
            Save
          </Button>
        ) : (
          <Button onClick={startEdit}>Edit</Button>
        )}
      </Top>
      {Content}
    </Segment>
  )
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
