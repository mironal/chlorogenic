import { RematchDispatch, RematchRootState } from "@rematch/core"
import React from "react"
import { connect } from "react-redux"

import ProjectColumn from "../components/ProjectColumn"
import { getLoadingConditionForIdentifer } from "../models/gh_project_store"
import {
  GitHubProjectColumn,
  GitHubProjectColumnIdentifier,
} from "../models/github.types"
import { models } from "../store"
import ColumnContainer from "../UX/elements/ColumnContainer"

export interface ProjectColumnProps {
  column: GitHubProjectColumnIdentifier
}
type Props = ReturnType<typeof mergeProps>

class View extends React.PureComponent<Props> {
  public componentDidMount() {
    this.props.fetchProject()
  }
  public render() {
    const { loading, column, project, columnIdentifier } = this.props
    if (loading || !column || !project) {
      return <ColumnContainer header="loading..." />
    }
    return (
      <ColumnContainer header={column.name} description={project.name}>
        <ProjectColumn column={column} identifier={columnIdentifier} />
      </ColumnContainer>
    )
  }
}

const mapState = (
  { projectStore, auth: { token } }: RematchRootState<models>,
  { column }: ProjectColumnProps,
) => ({
  column,
  projectStore,
  token: token || "",
})
const mapDispatch = ({
  projectStore: { fetchProject },
}: RematchDispatch<models>) => ({ fetchProject })

const mergeProps = (
  {
    token,
    projectStore,
    column: columnIdentifier,
  }: ReturnType<typeof mapState>,
  { fetchProject }: ReturnType<typeof mapDispatch>,
) => {
  let column: GitHubProjectColumn | undefined
  const condition = getLoadingConditionForIdentifer(
    projectStore,
    columnIdentifier.project,
  )
  if (condition.project) {
    column = condition.project.columns.find(c => c.id === columnIdentifier.id)
  }

  return {
    columnIdentifier,
    ...condition,
    column,
    fetchProject: () =>
      fetchProject({ token, identifier: columnIdentifier.project }),
  }
}

export default connect(
  mapState,
  mapDispatch,
  mergeProps,
)(View)
