import { RematchDispatch, RematchRootState } from "@rematch/core"
import React from "react"
import { connect } from "react-redux"

import ProjectColumn from "../components/ProjectColumn"
import { createProjectSlug } from "../misc/github"
import { getLoadingConditionForIdentifer } from "../models/gh_project_store"
import {
  GitHubProjectCard,
  GitHubProjectColumn,
  GitHubProjectColumnIdentifier,
} from "../models/github.types"
import { models } from "../store"
import ColumnContainer from "../UX/elements/ColumnContainer"

export interface ProjectColumnProps {
  column: GitHubProjectColumnIdentifier
  panelIndex: number
}
type Props = ReturnType<typeof mergeProps>

class View extends React.PureComponent<Props> {
  private onDropCard = (
    card: GitHubProjectCard,
    column: GitHubProjectColumn,
  ) => {
    // tslint:disable-next-line:no-console
    console.log(card, column)
  }

  public componentDidMount() {
    this.props.fetchProject()
  }
  public render() {
    const {
      loading,
      column,
      project,
      columnIdentifier,
      removeColumn,
    } = this.props
    if (loading || !column || !project) {
      return <ColumnContainer header="loading..." />
    }
    return (
      <ColumnContainer
        header={column.name}
        description={`${createProjectSlug(columnIdentifier.project)}\n${
          project.name
        }`}
        onClickClose={removeColumn}
      >
        <ProjectColumn
          onDropCard={this.onDropCard}
          column={column}
          identifier={columnIdentifier}
        />
      </ColumnContainer>
    )
  }
}

const mapState = (
  { projectStore, auth: { token } }: RematchRootState<models>,
  ownProps: ProjectColumnProps,
) => ({
  ...ownProps,
  projectStore,
  token: token || "",
})
const mapDispatch = ({
  projectStore: { fetchProject },
  columns: { removeColumn },
}: RematchDispatch<models>) => ({ fetchProject, removeColumn })

const mergeProps = (
  {
    token,
    projectStore,
    column: columnIdentifier,
    panelIndex,
  }: ReturnType<typeof mapState>,
  { fetchProject, removeColumn }: ReturnType<typeof mapDispatch>,
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
    removeColumn: () =>
      removeColumn({ index: panelIndex, column: columnIdentifier }),
    fetchProject: () =>
      fetchProject({ token, identifier: columnIdentifier.project }),
  }
}

export default connect(
  mapState,
  mapDispatch,
  mergeProps,
)(View)
