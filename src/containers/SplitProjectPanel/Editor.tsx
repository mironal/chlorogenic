import { RematchDispatch, RematchRootState } from "@rematch/core"
import React from "react"
import { connect } from "react-redux"
import { Button, Divider, Input, Message, Segment } from "semantic-ui-react"
import Project from "../../components/Project"

import { SplitProjectPanelProps } from "."
import { parseProjectIdentiferString } from "../../misc/parser"
import {
  createProjectSlug,
  isGithubOrgProjectIdentifier,
} from "../../misc/project"
import { GitHubModel, GithubProjectIdentifier } from "../../models/github"
import { models } from "../../store"
import { Segment2 } from "../Dashboard"

type Props = ReturnType<typeof margeProps>

interface State {
  name: string
  leftIdentifier?: GithubProjectIdentifier | Error
  rightIdentifier?: GithubProjectIdentifier | Error
}

const stringifyProjectIdentifer = (
  i: GithubProjectIdentifier | undefined,
): string => {
  if (i === undefined) {
    return ""
  }
  if (isGithubOrgProjectIdentifier(i)) {
    return `${i.organization}/${i.number}`
  }
  return `${i.repository.owner}/${i.repository.name}/${i.number}`
}
const EditorSegment = ({
  identifer,
  condition,
  onChangeInput,
  onClickPreview,
}: {
  identifer?: GithubProjectIdentifier
  condition?: GitHubModel
  onChangeInput(value: string): void
  onClickPreview(): void
}) => {
  const loading = condition ? condition.loading : false
  const project = condition && condition.project
  return (
    <Segment2 loading={loading}>
      <h3>Select project</h3>
      <p>Please enter your project url and click Preview.</p>
      <Input
        defaultValue={stringifyProjectIdentifer(identifer)}
        fluid={true}
        disabled={loading}
        placeholder="Enter https://github.com/your/repo/projects/number"
        action={
          <Button primary={true} onClick={onClickPreview}>
            Preview
          </Button>
        }
        onChange={(_, { value }) => onChangeInput(value)}
        onKeyPress={(ev: { which: number }) =>
          ev.which === 13 && onClickPreview()
        }
      />
      <Message
        hidden={!!project}
        positive={true}
        header="Hint"
        list={[
          "{owner}/{name}/{number}",
          `{organization}/{number}`,
          "https://github.com/{owner}/{name}/projects/{number}",
          "https://github.com/orgs/{organization}/projects/{number}",
        ]}
      />
      {project && (
        <>
          <Divider />
          <Segment>
            <h2>Preview</h2>
            <Project project={project} />
          </Segment>
        </>
      )}
    </Segment2>
  )
}

class Editor extends React.PureComponent<Props, State> {
  public state: State = { name: "" }
  public render() {
    const {
      leftCondition,
      rightCondition,
      panel,
      replacePanelName,
    } = this.props
    const { name } = panel
    return (
      <>
        <Segment>
          <h3>Edit panel name</h3>
          <Input
            defaultValue={name}
            placeholder="Enter panel name"
            onChange={(_, { value }) => this.setState({ name: value || "" })}
            onBlur={() => this.state.name && replacePanelName(this.state.name)}
          />
        </Segment>
        <Segment.Group horizontal={true}>
          <EditorSegment
            onChangeInput={value =>
              this.setState({
                leftIdentifier: parseProjectIdentiferString(value),
              })
            }
            onClickPreview={() => {
              const identifier = this.state.leftIdentifier
              if (!identifier) {
                return
              }
              if (identifier instanceof Error) {
                this.props.setErrorNotification(identifier)
              } else {
                this.props.fetchProject(identifier)
                const next = { ...panel, left: identifier }
                this.props.replace({ from: panel, to: next })
              }
            }}
            identifer={panel.left}
            condition={leftCondition}
          />
          <EditorSegment
            onChangeInput={value =>
              this.setState({
                rightIdentifier: parseProjectIdentiferString(value),
              })
            }
            onClickPreview={() => {
              const identifier = this.state.rightIdentifier
              if (!identifier) {
                return
              }
              if (identifier instanceof Error) {
                this.props.setErrorNotification(identifier)
              } else {
                this.props.fetchProject(identifier)
                const next = { ...panel, right: identifier }
                this.props.replace({ from: panel, to: next })
              }
            }}
            condition={rightCondition}
            identifer={panel.right}
          />
        </Segment.Group>
      </>
    )
  }
}

const mapState = (
  { auth: { token }, projects }: RematchRootState<models>,
  { panel }: SplitProjectPanelProps,
) => {
  let leftCondition
  if (panel.left) {
    leftCondition = projects[createProjectSlug(panel.left)] || {
      loading: false,
    }
  }
  let rightCondition
  if (panel.right) {
    rightCondition = projects[createProjectSlug(panel.right)] || {
      loading: false,
    }
  }
  return {
    panel,
    leftCondition,
    rightCondition,
    token: token || "",
  }
}

const mapDispatch = ({
  projects: { fetchProject },
  notification: { setError: setErrorNotification, clear: clearNotifiacation },
  dashboard: { replace },
}: RematchDispatch<models>) => ({
  fetchProject,
  setErrorNotification,
  clearNotifiacation,
  replace,
})

const margeProps = (
  { token, ...rest }: ReturnType<typeof mapState>,
  { fetchProject, ...fns }: ReturnType<typeof mapDispatch>,
) => {
  return {
    ...rest,
    ...fns,
    replacePanelName: (name: string) =>
      fns.replace({ from: rest.panel, to: { ...rest.panel, name } }),
    fetchProject: (identifier: GithubProjectIdentifier) =>
      fetchProject({ token, identifier }),
  }
}

export default connect(
  mapState,
  mapDispatch,
  margeProps,
)(Editor)
