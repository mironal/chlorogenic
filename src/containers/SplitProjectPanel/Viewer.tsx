import { RematchDispatch, RematchRootState } from "@rematch/core"
import React from "react"
import { connect } from "react-redux"
import { Segment } from "semantic-ui-react"
import { SplitProjectPanelProps } from "."
import Project from "../../components/Project"
import { createProjectSlug } from "../../misc/project"
import { models } from "../../store"
import { Segment2 } from "../Dashboard"

type Props = ReturnType<typeof mapState> & ReturnType<typeof mapDispatch>

class View extends React.PureComponent<Props> {
  public render() {
    const { leftCondition, rightCondition } = this.props

    return (
      <>
        <Segment.Group horizontal={true}>
          <Segment2 loading={leftCondition.loading}>
            {leftCondition.project && (
              <Project project={leftCondition.project} />
            )}
          </Segment2>
          <Segment2 loading={rightCondition.loading}>
            {rightCondition.project && (
              <Project project={rightCondition.project} />
            )}
          </Segment2>
        </Segment.Group>
      </>
    )
  }
}

const mapState = (
  { projects }: RematchRootState<models>,
  { panel }: SplitProjectPanelProps,
) => {
  if (!panel.left || !panel.right) {
    throw new Error("Invalid state")
  }
  const leftCondition = projects[createProjectSlug(panel.left)] || {
    loading: false,
  }
  const rightCondition = projects[createProjectSlug(panel.right)] || {
    loading: false,
  }
  return { leftCondition, rightCondition, panel }
}
const mapDispatch = ({ projects: fetchProject }: RematchDispatch<models>) => ({
  fetchProject,
})

export default connect(
  mapState,
  mapDispatch,
)(View)
