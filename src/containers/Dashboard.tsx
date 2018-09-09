import { RematchDispatch, RematchRootState } from "@rematch/core"
import React from "react"
import { connect } from "react-redux"
import { Button, Segment } from "semantic-ui-react"
import styled from "styled-components"
import Editor from "./SplitProjectPanel/Editor"

import { DashboardModel } from "../models/dashboard"
import { models } from "../store"
import Manipulater from "./SplitProjectPanel/Manipulater"
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
  & :first-child {
    margin-right: auto;
  }
`

const Board = ({ panel, boardState, canSave, changeState }: Props) => {
  if (!panel) {
    throw new Error("panel is required.")
  }

  const Content =
    boardState === "viewer" ? (
      <Viewer panel={panel} />
    ) : boardState === "editor" ? (
      <Editor panel={panel} />
    ) : (
      <Manipulater panel={panel} />
    )

  const Buttons =
    boardState === "viewer" ? (
      <>
        <Button onClick={() => changeState("editor")}>Editor</Button>
        <Button onClick={() => changeState("manipulater")}>Manipulator</Button>
      </>
    ) : boardState === "editor" ? (
      <Button onClick={() => changeState("viewer")} disabled={!canSave}>
        Save
      </Button>
    ) : (
      <Button onClick={() => changeState("viewer")}>Viewer</Button>
    )

  return (
    <Segment>
      <Top>
        <h2>{panel.name || "Untitled"}</h2>
        {Buttons}
      </Top>
      {Content}
    </Segment>
  )
}

const mapState = ({
  dashboard: { activePanelIndex, panels, boardState, canSave },
}: RematchRootState<models>) => ({
  boardState,
  canSave,
  panel: activePanelIndex >= 0 ? panels[activePanelIndex] : undefined,
})

const mapDispatch = ({
  dashboard: { changeState },
}: RematchDispatch<models>) => ({
  changeState: (boardState: DashboardModel["boardState"]) =>
    changeState({ boardState }),
})

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
