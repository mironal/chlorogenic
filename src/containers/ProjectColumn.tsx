import { RematchDispatch, RematchRootState } from "@rematch/core"
import React from "react"
import { connect } from "react-redux"

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
  private onDropCard = (
    column: GitHubProjectColumnIdentifier,
    card: GitHubProjectCard,
  ) => {
    const {
      columnIdentifier,
      moveProjectCard,
      createProjectContentCard,
      fetchProject,
      setSuccess,
      setError,
      clearNotification,
    } = this.props

    if (isSameProject(column.project, columnIdentifier.project)) {
      // move
      moveProjectCard([
        {
          columnId: columnIdentifier.id,
          cardId: card.id,
        },
      ])
        .then(() => {
          setSuccess({ message: "φ(•ᴗ•๑)" })
          return fetchProject()
        })
        .then(() => clearNotification())
        .catch(setError)
    } else {
      // copy
      const { issue } = card
      if (!issue) {
        return
      }
      createProjectContentCard([
        {
          columnId: columnIdentifier.id,
          contentId: issue.id,
        },
      ])
        .then(() => {
          setSuccess({ message: "φ(•ᴗ•๑)" })
          return fetchProject()
        })
        .then(() => clearNotification())
        .catch(setError)
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
        <ProjectColumn
          loading={running}
          onDropCard={this.onDropCard}
          column={column}
          identifier={columnIdentifier}
        />
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
      Promise.resolve(moveProjectCard({ token, opts })),
    createProjectContentCard: (opts: CreateProjectContentCardOpt[]) =>
      Promise.resolve(createProjectContentCard({ token, opts })),
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
