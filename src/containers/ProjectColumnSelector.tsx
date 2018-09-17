import { RematchDispatch, RematchRootState } from "@rematch/core"
import React from "react"
import { connect } from "react-redux"

import Select from "react-select"
import ProjectColumn from "../components/ProjectColumn"
import { parseProjectIdentifierString } from "../misc/parser"
import Modal from "../Modal"
import { getLoadingConditionForIdentifer } from "../models/gh_project_store"
import {
  GitHubProjectColumnIdentifier,
  GithubProjectIdentifier,
} from "../models/github.types"
import { models } from "../store"
import { Button, Flexbox } from "../UX"
import ColumnContainer from "../UX/elements/ColumnContainer"
import styled from "../UX/Styled"

type Props = ReturnType<typeof mergeProps>
interface State {
  showHint?: boolean
  input: string
  selectedColumnId?: string
}

const hintText = `- {org name}/{project number}
- {owner}/{repo name}/{project number}
- https:github.com/orgs/{org name}/projects/{project number}
- https:github.com/{owner}/{repo name}/projects/{project number}
`

const Hint = styled.pre`
  padding: 1em;
`

const Input = styled(Flexbox)<{ error?: Error }>`
  > input {
    flex-grow: 2;
    margin-right: 0;
    border-radius: 0;
    border: ${({ theme, error }) =>
      error ? `solid 1px ${theme.redColor}` : 0};
    border-top-left-radius: 0.3em;
    border-bottom-left-radius: 0.3em;
  }
  > button {
    border: 0;
    margin: 0;
    border-radius: 0;
    border-top-right-radius: 0.3em;
    border-bottom-right-radius: 0.3em;
  }
`

class View extends React.PureComponent<Props, State> {
  public state: State = { input: "" }
  private onChangeInput = (input: string) => {
    this.props.clearNotification()
    this.setState({ input })
  }

  private onChangeColumnSelection = (value: string) =>
    this.setState({ selectedColumnId: value })

  private onClickFetch = () => {
    this.props.clearNotification()
    const { input } = this.state
    if (!input) {
      return
    }

    const identifier = parseProjectIdentifierString(input)
    if (identifier instanceof Error) {
      this.props.setError(identifier)
    } else {
      this.props.fetchProject(identifier).catch(this.props.setError)
    }
  }

  private onClickAdd = () => {
    const { selectedColumnId } = this.state
    const { project, addColumn, reset } = this.props
    if (!project || !selectedColumnId) {
      return
    }

    const columnIdentifer: GitHubProjectColumnIdentifier = {
      project: project.identifier,
      id: selectedColumnId,
    }
    if (columnIdentifer) {
      addColumn(columnIdentifer)
      reset()
    }
  }

  public render() {
    const { input, selectedColumnId } = this.state
    const { notifyingError, project, loading } = this.props

    let loadingAny = false
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
      <ColumnContainer header="Add new project column">
        <>
          <Input error={notifyingError}>
            <input
              placeholder="Enter project URL"
              value={input}
              onChange={ev => this.onChangeInput(ev.currentTarget.value)}
              onKeyDown={e => e.which === 13 && this.onClickFetch()}
            />
            <Button onClick={() => this.setState({ showHint: true })}>?</Button>
          </Input>
          <Button
            disabled={input.length === 0}
            onClick={this.onClickFetch}
            size="small"
          >
            fetch
          </Button>
          {this.state.showHint && (
            <Modal onClickOutside={() => this.setState({ showHint: false })}>
              <Hint>{hintText}</Hint>
            </Modal>
          )}
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

const mapState = (
  {
    auth: { token },
    projectStore,
    notification: { notifyingError },
    projectSelector: identifier,
  }: RematchRootState<models>,
  { panelIndex }: { panelIndex: number },
) => ({
  token: token || "",
  panelIndex,
  notifyingError,
  ...getLoadingConditionForIdentifer(projectStore, identifier),
})
const mapDispatch = ({
  notification: { setSuccess, setError, clear },
  projectStore: { fetchProject },
  columns: { addColumn },
  projectSelector: { update },
}: RematchDispatch<models>) => ({
  fetchProject,
  addColumn,
  setSuccess,
  setError,
  clearNotification: clear,
  updateProjectSelector: update,
})

const mergeProps = (
  { token, panelIndex, ...rest }: ReturnType<typeof mapState>,
  {
    fetchProject,
    addColumn,
    updateProjectSelector,
    ...fns
  }: ReturnType<typeof mapDispatch>,
) => {
  return {
    ...rest,
    ...fns,
    addColumn: (column: GitHubProjectColumnIdentifier) =>
      addColumn({ column, index: panelIndex }),
    fetchProject: (identifier: GithubProjectIdentifier) => {
      updateProjectSelector(identifier)
      return Promise.resolve(fetchProject({ identifier, token }))
    },
    reset: () => updateProjectSelector(null),
  }
}

export default connect(
  mapState,
  mapDispatch,
  mergeProps,
)(View)
