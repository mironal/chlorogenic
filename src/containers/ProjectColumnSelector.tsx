import { RematchDispatch, RematchRootState } from "@rematch/core"
import React from "react"
import { connect } from "react-redux"

import Select from "react-select"

import ProjectColumn from "../components/ProjectColumn"
import { parseProjectIdentifierString } from "../misc/parser"
import { createProjectSlug } from "../misc/project"
import {
  GitHubProjectColumnIdentifier,
  GithubProjectIdentifier,
} from "../models/github"
import { models } from "../store"
import { Button } from "../UX"
import { ColumnContainer } from "../UX/elements/ColumnContainer"

type Props = ReturnType<typeof mergeProps>

interface State {
  input: string
  error?: Error
  identifier?: GithubProjectIdentifier
  selectedColumnId?: string
}

class View extends React.PureComponent<Props, State> {
  public state: State = { input: "" }
  private onChangeInput = (input: string) => this.setState({ input })

  private onChangeColumnSelection = (value: string) =>
    this.setState({ selectedColumnId: value })

  private onClickFetch = () => {
    const { input } = this.state
    if (!input) {
      return
    }

    const identifier = parseProjectIdentifierString(input)
    if (identifier instanceof Error) {
      this.setState({ error: identifier, identifier: undefined })
    } else {
      this.setState({ error: undefined, identifier })
      this.props.fetchProject(identifier)
    }
  }

  private onClickAdd = () => {
    const { selectedColumnId, identifier } = this.state
    const { getProjectModel, addColumn } = this.props

    const model = getProjectModel(identifier) || { loading: false }
    const { project } = model
    if (!project || !selectedColumnId) {
      return
    }

    const columnIdentifer: GitHubProjectColumnIdentifier = {
      project: project.identifier,
      id: selectedColumnId,
    }
    if (columnIdentifer) {
      addColumn(columnIdentifer)
      this.setState({ identifier: undefined })
    }
  }

  public render() {
    const { input, error, identifier, selectedColumnId } = this.state
    const { getProjectModel } = this.props

    let loadingAny = false
    const model = getProjectModel(identifier) || { loading: false }

    const { project, loading } = model

    if (!project && loading) {
      loadingAny = true
    }
    const columns = project
      ? project.columns.map((c, i) => ({
          value: c.id,
          label: `${i + 1}-${c.name}`,
        }))
      : []
    const column = project
      ? project.columns.find(c => c.id === selectedColumnId)
      : undefined
    return (
      <ColumnContainer>
        <h3>Add</h3>
        <>
          <input
            value={input}
            onChange={ev => this.onChangeInput(ev.currentTarget.value)}
            onKeyDown={e => e.which === 13 && this.onClickFetch()}
          />
          <Button onClick={this.onClickFetch} size="small">
            fetch
          </Button>
        </>
        {loadingAny && <p>Loading...</p>}
        {!loadingAny &&
          project && (
            <Select
              value={columns.find(c => c.value === selectedColumnId)}
              autoFocus={true}
              options={columns}
              onChange={({ value }: any) => this.onChangeColumnSelection(value)}
            />
          )}
        {column && (
          <>
            <Button onClick={this.onClickAdd} size="small">
              Add
            </Button>
            <ProjectColumn column={column} />
          </>
        )}
      </ColumnContainer>
    )
  }
}

const mapState = ({ auth: { token }, projects }: RematchRootState<models>) => ({
  token: token || "",
  projects,
})
const mapDispatch = ({
  projects: { fetchProject },
  columns: { addColumn },
}: RematchDispatch<models>) => ({ fetchProject, addColumn })

const mergeProps = (
  { token, projects, ...rest }: ReturnType<typeof mapState>,
  { fetchProject, addColumn, ...fns }: ReturnType<typeof mapDispatch>,
) => {
  return {
    ...rest,
    ...fns,
    addColumn: (column: GitHubProjectColumnIdentifier) => addColumn(column),
    getProjectModel: (identifier?: GithubProjectIdentifier) =>
      identifier ? projects[createProjectSlug(identifier)] : undefined,
    fetchProject: (identifier: GithubProjectIdentifier) =>
      fetchProject({ identifier, token }),
  }
}

export default connect(
  mapState,
  mapDispatch,
  mergeProps,
)(View)
