import { RematchDispatch, RematchRootState } from "@rematch/core"
import * as React from "react"
import { connect } from "react-redux"

import Select from "react-select"
import styled from "../appearance/styled"
import { currentTheme } from "../appearance/theme"
import { ColumnContainer, ProjectColumn } from "../components"
import { Button, Flexbox } from "../components/parts"
import { createProjectSlug } from "../misc/github"
import { parseProjectIdentifierString } from "../misc/parser"
import { pipelinePromiseAction2 } from "../misc/prelude"
import Modal from "../Modal"
import {
  GitHubProjectColumnIdentifier,
  GithubProjectIdentifier,
} from "../models/github.types"
import { createShowError, createShowSuccess } from "../models/notification"
import { createFetchRequest } from "../models/projectLoader"
import { createAddPanelColumn } from "../models/userConfig"
import { models } from "../store"

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
  input {
    flex-grow: 2;
    margin-right: 0;
    border: ${({ theme, error }) =>
      error ? `solid 1px ${theme.redColor}` : 0};
    border-radius: 0;
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
      this.props.showError(identifier)
    } else {
      this.props.fetchProject(identifier)
    }
  }

  private onClickAdd = () => {
    const { selectedColumnId } = this.state
    const { project, addColumn } = this.props
    if (!project || !selectedColumnId) {
      return
    }

    const columnIdentifer: GitHubProjectColumnIdentifier = {
      project: project.identifier,
      id: selectedColumnId,
    }
    if (columnIdentifer) {
      addColumn(columnIdentifer)
      this.setState({ selectedColumnId: undefined })
    }
  }

  public componentDidUpdate(prevProps: Props) {
    if (prevProps.panelIndex !== this.props.panelIndex) {
      this.setState({ input: "", selectedColumnId: undefined })
      this.props.reset()
    }
  }

  public render() {
    const { input, selectedColumnId } = this.state
    const { notifyingError, project, loading, columns } = this.props

    let loadingAny = false
    if (!project && loading) {
      loadingAny = true
    }
    const options = project
      ? project.columns.map((c, i) => ({
          value: c.id,
          label: `${i + 1}-${c.name}`,
        }))
      : []
    const column = project
      ? project.columns.find(c => c.id === selectedColumnId)
      : undefined

    return (
      <ColumnContainer
        header="Add"
        description={`Fetch your project &\n select project's column.`}
      >
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
              styles={{
                singleValue: styles => ({
                  ...styles,
                  color: currentTheme().textColor,
                }),
                placeholder: styles => ({
                  ...styles,
                  color: currentTheme().secondaryTextColor,
                }),
                control: (styles: {}) => ({
                  ...styles,
                  background: currentTheme().secondaryBackgroundColor,
                  minHeight: "34px",
                }),
                clearIndicator: (styles: {}) => ({
                  ...styles,
                  color: currentTheme().secondaryTextColor,
                  padding: "2px 8px",
                }),
                dropdownIndicator: (styles: {}) => ({
                  ...styles,
                  padding: "2px 8px",
                }),
                loadingIndicator: (styles: {}) => ({
                  ...styles,
                  padding: "2px 8px",
                }),
                option: (styles, { isFocused, isSelected }) => ({
                  ...styles,
                  color: currentTheme().textColor,
                  background: isFocused
                    ? currentTheme().backgroundColor
                    : currentTheme().secondaryBackgroundColor,
                }),
                menu: (styles: {}) => ({
                  ...styles,
                  background: currentTheme().secondaryBackgroundColor,
                  zIndex: 3,
                }),
              }}
              value={options.find(c => c.value === selectedColumnId) || null}
              autoFocus={true}
              options={options}
              onChange={({ value }: any) => this.onChangeColumnSelection(value)}
            />
          )}
        {column && (
          <>
            <Button
              onClick={this.onClickAdd}
              size="small"
              // disabled while selecting an already added column.
              disabled={columns.some(c => c.id === selectedColumnId)}
            >
              Add
            </Button>
            <ProjectColumn
              readOnly={true}
              identifier={{
                id: selectedColumnId!,
                project: project!.identifier,
              }}
              column={column}
            />
          </>
        )}
      </ColumnContainer>
    )
  }
}

const mapState = (
  {
    userConfig: { githubToken, panels },
    projectLoader,
    notification: { notifyingError },
    projectSelector: identifier,
    loadings: { projectLoadings },
  }: RematchRootState<models>,
  { panelIndex }: { panelIndex: number },
) => ({
  token: githubToken || "",
  panelIndex,
  notifyingError,
  panels,
  loading: identifier && projectLoadings[createProjectSlug(identifier)],
  project: identifier && projectLoader[createProjectSlug(identifier)],
})
const mapDispatch = ({
  notification,
  projectLoader,
  userConfig,
  projectSelector: { update },
}: RematchDispatch<models>) => ({
  fetchRequest: pipelinePromiseAction2(
    createFetchRequest(projectLoader),
    createShowError(notification),
  ),
  addPanelColumn: createAddPanelColumn(userConfig),
  showSuccess: createShowSuccess(notification),
  showError: createShowError(notification),
  clearNotification: notification.clear,
  updateProjectSelector: update,
})

const mergeProps = (
  { token, panelIndex, panels, ...rest }: ReturnType<typeof mapState>,
  {
    fetchRequest,
    addPanelColumn,
    updateProjectSelector,
    ...fns
  }: ReturnType<typeof mapDispatch>,
) => {
  return {
    ...rest,
    ...fns,
    panelIndex,
    columns: panels[panelIndex].columns,
    addColumn: (column: GitHubProjectColumnIdentifier) =>
      addPanelColumn(panelIndex, column),
    fetchProject: (identifier: GithubProjectIdentifier) => {
      updateProjectSelector(identifier)
      fetchRequest(token, identifier).catch(fns.showError)
    },
    reset: () => updateProjectSelector(null),
  }
}

export default connect(
  mapState,
  mapDispatch,
  mergeProps,
)(View)
