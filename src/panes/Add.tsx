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
import { GitHubProject, GithubProjectIdentifier } from "../models/github"
import { models } from "../store"
import PaneContainer from "./PaneContainer"

type AddProps = ReturnType<typeof mergeProps>
interface State {
  input: string
  inputError?: Error
}

const parseUrlString = (input: string): GithubProjectIdentifier | undefined => {
  const { pathname } = new URL(input)
  // Remove the zero length string to ignore the leading or traling "/"
  const tokens = pathname
    .split("/")
    .filter(t => t.length > 0 && t !== "orgs" && t !== "projects")
  return parseShorthandString(tokens.join("/"))
}

const parseShorthandString = (
  input: string,
): GithubProjectIdentifier | undefined => {
  const tokens = input.split("/").filter(t => t.length > 0)
  if (tokens.length === 2) {
    // maybe org project shorthand e.g. org/num
    const [organization, num] = tokens
    if (/^\d+$/.test(num)) {
      return { organization, number: parseInt(num, 10) }
    }
  } else if (tokens.length === 3) {
    // maybe repo project
    const [owner, name, num] = tokens
    if (/^\d+$/.test(num)) {
      return { repository: { owner, name }, number: parseInt(num, 10) }
    }
  }
  return undefined
}

class Pane extends React.PureComponent<AddProps, State> {
  public state: State = { input: "" }

  private onChangeInput = (input: string) =>
    this.setState({ input, inputError: undefined })

  private onClickPreview = () => {
    this.setState({ inputError: undefined })
    const { input } = this.state
    if (input.length === 0) {
      return
    }

    try {
      const identifier = parseShorthandString(input) || parseUrlString(input)
      if (identifier) {
        this.props.fetchProject(identifier)
      }
    } catch (inputError) {
      this.setState({ inputError })
    }
  }
  private onClickAddTab = () => {
    const { displayProject } = this.props
    if (displayProject) {
      this.props.addProjectTab(displayProject)
      this.props.clear()
    }
  }

  public render() {
    const { loading, displayProject } = this.props

    const Preview = displayProject && (
      <>
        <Divider />
        <Segment>
          <Button
            primary={true}
            disabled={!displayProject}
            onClick={this.onClickAddTab}
            icon={true}
            labelPosition="left"
          >
            <Icon name="plus" />
            Add this project to tab
          </Button>
          <h2>Preview</h2>
          <Project project={displayProject} />
        </Segment>
      </>
    )
    return (
      <PaneContainer>
        <h2>タブを追加</h2>
        <Segment>
          <Dimmer active={loading}>
            <Loader />
          </Dimmer>
          <p>追加したいプロジェクトを選んでタブに追加してください.</p>
          <Input
            fluid={true}
            disabled={loading}
            error={!!this.state.inputError}
            placeholder="Enter https://github.com/your/repo/projects/number"
            action={
              <Button primary={true} onClick={this.onClickPreview}>
                Preview
              </Button>
            }
            onChange={(_, { value }) => this.onChangeInput(value)}
            onKeyPress={(ev: { which: number }) =>
              ev.which === 13 && this.onClickPreview()
            }
          />
          <Message
            hidden={!!displayProject}
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
      </PaneContainer>
    )
  }
}

const mapState = (state: RematchRootState<models>) => ({
  token: state.auth.accessToken || "",
  loading: state.github.loading,
  displayProject: state.github.project,
})

const mapDispatch = ({
  tab: { add },
  github: { fetchProject, clear },
}: RematchDispatch<models>) => ({
  add,
  clear,
  fetchProject,
})

const mergeProps = (
  { token, ...rest }: ReturnType<typeof mapState>,
  { fetchProject, add, clear }: ReturnType<typeof mapDispatch>,
) => ({
  ...rest,
  clear,
  addProjectTab: (project: GitHubProject) =>
    add({ tab: project, pos: 0, select: true }),
  fetchProject: (identifier: GithubProjectIdentifier) =>
    fetchProject({ token, identifier }),
})

export default connect(
  mapState,
  mapDispatch,
  mergeProps,
)(Pane)
