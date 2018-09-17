import { RematchDispatch, RematchRootState } from "@rematch/core"
import React from "react"
import { connect } from "react-redux"

import DragAllCardHandle from "../components/DragAllCardHandle"
import ProjectColumn from "../components/ProjectColumn"
import { createProjectSlug, isSameProject } from "../misc/github"
import { getLoadingConditionForIdentifer } from "../models/gh_project_store"
import {
  GitHubProjectCard,
  GitHubProjectColumn,
  GitHubProjectColumnIdentifier,
} from "../models/github.types"
import { CreateProjectContentCardOpt, MoveProjectCardOpt } from "../models/ops"
import { models } from "../store"
import ColumnContainer from "../UX/elements/ColumnContainer"

export interface ProjectColumnProps {
  column: GitHubProjectColumnIdentifier
  panelIndex: number
}
type Props = ReturnType<typeof mergeProps>

class View extends React.PureComponent<Props> {
  private onDropCards = (
    column: GitHubProjectColumnIdentifier,
    cards: GitHubProjectCard[],
  ) => {
    const {
      columnIdentifier,
      moveProjectCard,
      createProjectContentCard,
    } = this.props
    if (isSameProject(column.project, columnIdentifier.project)) {
      const opts = cards.map(c => ({
        columnId: columnIdentifier.id,
        cardId: c.id,
      }))
      // move
      moveProjectCard(opts)
    } else {
      // copy
      const opts = cards.map(c => ({
        columnId: columnIdentifier.id,
        contentId: c.issue ? c.issue.id : "",
      }))
      createProjectContentCard(opts)
    }
  }

  public componentDidUpdate(prevProps: Props) {
    if (prevProps.ops.running && !this.props.ops.running) {
      const error = this.props.ops.error
      if (error) {
        this.props.setError(error)
      } else {
        this.props.setSuccess({ message: "Success φ(•ᴗ•๑)" })
        window.setTimeout(() => this.props.clearNotification(), 2000)
      }
      this.props.fetchProject(true)
    }
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
      ops: { running },
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
        {column && (
          <DragAllCardHandle identifier={columnIdentifier} cards={column.cards}>
            <ProjectColumn
              loading={running}
              onDropCards={this.onDropCards}
              column={column}
              identifier={columnIdentifier}
            />
          </DragAllCardHandle>
        )}
      </ColumnContainer>
    )
  }
}

const mapState = (
  { projectStore, auth: { token }, ops }: RematchRootState<models>,
  ownProps: ProjectColumnProps,
) => ({
  ...ownProps,
  projectStore,
  token: token || "",
  ops,
})
const mapDispatch = ({
  projectStore: { fetchProject },
  columns: { removeColumn },
  notification: { clear, setError, setSuccess },
  ops: { createProjectContentCard, moveProjectCard },
}: RematchDispatch<models>) => ({
  fetchProject,
  removeColumn,
  createProjectContentCard,
  moveProjectCard,
  clearNotification: clear,
  setError,
  setSuccess,
})

const mergeProps = (
  {
    token,
    projectStore,
    column: columnIdentifier,
    panelIndex,
    ...rest
  }: ReturnType<typeof mapState>,
  {
    fetchProject,
    removeColumn,
    createProjectContentCard,
    moveProjectCard,
    ...fns
  }: ReturnType<typeof mapDispatch>,
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
    ...rest,
    ...fns,
    columnIdentifier,
    ...condition,
    column,
    moveProjectCard: (opts: MoveProjectCardOpt[]) =>
      moveProjectCard({ token, opts }),
    createProjectContentCard: (opts: CreateProjectContentCardOpt[]) =>
      createProjectContentCard({ token, opts }),
    removeColumn: () =>
      removeColumn({ index: panelIndex, column: columnIdentifier }),
    fetchProject: (purge: boolean = false) =>
      fetchProject({ token, identifier: columnIdentifier.project, purge }),
  }
}

export default connect(
  mapState,
  mapDispatch,
  mergeProps,
)(View)
