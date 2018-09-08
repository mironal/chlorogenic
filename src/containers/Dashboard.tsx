import { RematchDispatch, RematchRootState } from "@rematch/core"
import React from "react"
import { connect } from "react-redux"
import { Segment } from "semantic-ui-react"
import styled from "styled-components"
import Editor from "./Editor"

import { GithubProjectIdentifier } from "../models/github"
import { models } from "../store"
import Project from "./Project"

const Segment2 = styled(Segment)`
  height: 100vh;
  overflow-x: hidden;
  overflow-y: scroll;
  &&& {
    width: 100%;
  }
`

type Props = ReturnType<typeof margeProps>

const createView = (
  identiifer: GithubProjectIdentifier | undefined,
  onClickAdd: (identifer: GithubProjectIdentifier) => void,
) => {
  if (identiifer) {
    return <Project identifer={identiifer} />
  }
  return <Editor onClickAdd={onClickAdd} />
}

const Board = ({ panel, onClickAdd }: Props) => {
  if (!panel) {
    return <p>loading</p>
  }

  return (
    <Segment.Group horizontal={true}>
      <Segment2>{createView(panel.left, onClickAdd)}</Segment2>
      {panel.left && <Segment2>{createView(panel.right, onClickAdd)}</Segment2>}
    </Segment.Group>
  )
}

const mapState = ({
  dashboard: { activePanelIndex, panels },
}: RematchRootState<models>) => ({
  panel: activePanelIndex >= 0 ? panels[activePanelIndex] : undefined,
})

const mapDispatch = ({ dashboard: { replace } }: RematchDispatch<models>) => ({
  replace,
})

const margeProps = (
  { panel }: ReturnType<typeof mapState>,
  { replace }: ReturnType<typeof mapDispatch>,
) => ({
  panel,
  replace,
  onClickAdd: (identifer: GithubProjectIdentifier) => {
    if (panel) {
      let left = panel.left
      let right = panel.right
      if (!left) {
        left = identifer
      } else if (left && !right) {
        right = identifer
      }
      const next = { ...panel, left, right }
      replace({ from: panel, to: next })
    }
  },
})

export default connect(
  mapState,
  mapDispatch,
  margeProps,
)(Board)
