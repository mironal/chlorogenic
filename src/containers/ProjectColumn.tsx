import { RematchDispatch, RematchRootState } from "@rematch/core"
import React from "react"
import { connect } from "react-redux"

import ProjectColumn from "../components/ProjectColumn"
import { createProjectSlug } from "../misc/project"
import {
  GitHubProjectColumn,
  GitHubProjectColumnIdentifier,
} from "../models/github"
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
  { projects, auth: { token } }: RematchRootState<models>,
  { column }: ProjectColumnProps,
) => ({ column, projects, token: token || "" })
const mapDispatch = ({
  projects: { fetchProject },
}: RematchDispatch<models>) => ({ fetchProject })

const mergeProps = (
  { token, projects, column: columnIdentifier }: ReturnType<typeof mapState>,
  { fetchProject }: ReturnType<typeof mapDispatch>,
) => {
  const slug = createProjectSlug(columnIdentifier.project)
  const github = projects[slug] || { loading: true }
  let column: GitHubProjectColumn | undefined
  if (github.project) {
    column = github.project.columns.find(c => c.id === columnIdentifier.id)
  }
  return {
    columnIdentifier,
    project: github.project,
    column,
    ...github,
    fetchProject: () =>
      fetchProject({ token, identifier: columnIdentifier.project }),
  }
}

export default connect(
  mapState,
  mapDispatch,
  mergeProps,
)(View)
