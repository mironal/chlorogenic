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
  props: Pick<Props, "onClickAdd" | "saveName" | "defaultPanelName">,
) => {
  if (identiifer) {
    return <Project identifer={identiifer} />
  }
  return <Editor {...props} />
}

const Board = ({ panel, ...rest }: Props) => {
  if (!panel) {
    throw new Error("panel is required.")
  }
  return (
    <Segment.Group horizontal={true}>
      <Segment2>{createView(panel.left, rest)}</Segment2>
      {panel.left && <Segment2>{createView(panel.right, rest)}</Segment2>}
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
  defaultPanelName: panel ? panel.name : undefined,
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
  saveName: (name: string) => {
    if (panel) {
      const next = { ...panel, name }
      replace({ from: panel, to: next })
    }
  },
})

export default connect(
  mapState,
  mapDispatch,
  margeProps,
)(Board)
