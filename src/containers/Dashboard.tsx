import { RematchDispatch, RematchRootState } from "@rematch/core"
import React from "react"
import { connect } from "react-redux"
import { Container, Segment } from "semantic-ui-react"
import Editor from "./Editor"

import { GithubProjectIdentifier } from "../models/github"
import { models } from "../store"

type Props = ReturnType<typeof mapState> & ReturnType<typeof mapDispatch>

const createView = (identiifer: GithubProjectIdentifier | undefined) => {
  if (identiifer) {
    return <div>TODO: project view</div>
  }
  return <Editor />
}
const Board = ({ panel }: Props) => {
  if (!panel) {
    return <p>loading</p>
  }

  return (
    <Container>
      <Segment.Group horizontal={true}>
        <Segment>{createView(panel.left)}</Segment>
        {panel.left && <Segment>{createView(panel.right)}</Segment>}
      </Segment.Group>
    </Container>
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

export default connect(
  mapState,
  mapDispatch,
)(Board)
