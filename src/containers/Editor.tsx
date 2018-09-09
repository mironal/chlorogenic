import { RematchDispatch, RematchRootState } from "@rematch/core"
import React from "react"
import { connect } from "react-redux"
import {
  Button,
  Dimmer,
  Divider,
  Icon,
  Input,
  Loader,
  Message,
  Segment,
} from "semantic-ui-react"
import Project from "../components/Project"

import { GithubProjectIdentifier } from "../models/github"

import { createProjectSlug } from "../misc/project"
import { models } from "../store"

export interface IncomingEditorProps {
  defaultPanelName?: string
  onClickAdd(input: GithubProjectIdentifier): void
  saveName(name: string): void
}

type Props = ReturnType<typeof margeProps>

class Editor extends React.PureComponent<Props> {
  private onClickLoad = () => {
    const { error, fetchProject, setErrorNotification } = this.props
    if (error) {
      setErrorNotification(error)
      return
    }
    fetchProject()
  }

  public componentDidMount() {
    const { reset, defaultPanelName, changeName } = this.props
    reset()
    if (defaultPanelName) {
      changeName(defaultPanelName)
    }
  }

  public render() {
    const { loading, project, changeName, saveName, name } = this.props

    const Preview = project && (
      <>
        <Divider />
        <Segment>
          <Button
            primary={true}
            disabled={!project}
            onClick={this.props.onClickAdd}
            icon={true}
            labelPosition="left"
          >
            <Icon name="plus" />
            Select this project
          </Button>
          <h2>Preview</h2>
          <Project project={project} />
        </Segment>
      </>
    )
    return (
      <>
        <Segment>
          <Input
            defaultValue={name}
            placeholder="Enter panel name"
            onChange={(_, { value }) => changeName(value)}
            onBlur={() => name && saveName(name)}
          />
        </Segment>
        <Segment>
          <h3>Select project</h3>
          <Dimmer active={loading}>
            <Loader />
          </Dimmer>
          <p>Please enter your project url and click Preview.</p>
          <Input
            fluid={true}
            disabled={loading}
            error={!!this.props.error}
            placeholder="Enter https://github.com/your/repo/projects/number"
            action={
              <Button primary={true} onClick={this.onClickLoad}>
                Preview
              </Button>
            }
            onChange={(_, { value }) => this.props.changeInput(value)}
            onKeyPress={(ev: { which: number }) =>
              ev.which === 13 && this.onClickLoad()
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
        </Segment>
        {Preview}
      </>
    )
  }
}

const mapState = ({ auth, projects, editor }: RematchRootState<models>) => {
  const condition = (editor.identifier &&
    projects[createProjectSlug(editor.identifier)]) || { loading: false }
  return {
    ...editor,
    project: condition.project,
    loading: condition.loading,
    token: auth.accessToken || "",
    error: editor.error || condition.error,
  }
}

const mapDispatch = (
  {
    projects: { fetchProject },
    editor: { changeInput, changeName, reset },
    notification: { setError: setErrorNotification, clear: clearNotifiacation },
  }: RematchDispatch<models>,
  ownProps: IncomingEditorProps,
) => ({
  fetchProject,
  changeInput,
  changeName,
  reset,
  setErrorNotification,
  clearNotifiacation,
  ...ownProps,
})

const margeProps = (
  { token, identifier, ...rest }: ReturnType<typeof mapState>,
  { fetchProject, reset, onClickAdd, ...fns }: ReturnType<typeof mapDispatch>,
) => {
  return {
    ...rest,
    ...fns,
    reset,
    onClickAdd: () => identifier && onClickAdd(identifier),
    fetchProject: () => identifier && fetchProject({ token, identifier }),
  }
}

export default connect(
  mapState,
  mapDispatch,
  margeProps,
)(Editor)
