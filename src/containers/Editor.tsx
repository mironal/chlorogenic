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
  onClickAdd(input: GithubProjectIdentifier): void
}

type Props = ReturnType<typeof margeProps>

class Editor extends React.PureComponent<Props> {
  private onClickLoad = () => {
    const { error, fetchProject, setErrorNotification } = this.props
    if (error) {
      // tslint:disable-next-line:no-console
      console.error(error)
      setErrorNotification(error)
      return
    }
    fetchProject()
  }

  public render() {
    const { loading, project } = this.props

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
            Add this project to tab
          </Button>
          <h2>Preview</h2>
          <Project project={project} />
        </Segment>
      </>
    )
    return (
      <>
        <h2>タブを追加</h2>
        <Segment>
          <Dimmer active={loading}>
            <Loader />
          </Dimmer>
          <p>追加したいプロジェクトを選んでタブに追加してください.</p>
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
              "https://github.com/{owner}/{name}/projects/{number}",
              "https://github.com/orgs/{organization}/projects/{number}",
              "{owner}/{name}/{number}",
              `{organization}/{number}`,
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
    editor: { changeInput, reset },
    notification: { setError: setErrorNotification, clear: clearNotifiacation },
  }: RematchDispatch<models>,
  { onClickAdd }: IncomingEditorProps,
) => ({
  fetchProject,
  changeInput,
  reset,
  onClickAdd,
  setErrorNotification,
  clearNotifiacation,
})

const margeProps = (
  { token, identifier, ...rest }: ReturnType<typeof mapState>,
  { fetchProject, reset, onClickAdd, ...fns }: ReturnType<typeof mapDispatch>,
) => {
  return {
    ...rest,
    ...fns,
    onClickAdd: () => {
      if (identifier) {
        onClickAdd(identifier)
        reset()
      }
    },
    fetchProject: () => identifier && fetchProject({ token, identifier }),
  }
}

export default connect(
  mapState,
  mapDispatch,
  margeProps,
)(Editor)
