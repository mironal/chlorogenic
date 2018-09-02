import { RematchDispatch, RematchRootState } from "@rematch/core"
import React from "react"
import { connect } from "react-redux"
import { Button, Container, Divider, Dropdown } from "semantic-ui-react"
import Project from "../components/Project"
import { GitHubProject, GitHubRepository } from "../models/github"
import { models } from "../store"

type AddProps = ReturnType<typeof mergeProps>
interface State {
  repo?: GitHubRepository
}
// select owner -> select repo -> select project
class Pane extends React.PureComponent<AddProps, State> {
  public state: State = {}
  public componentDidMount() {
    this.props.fetchRepos()
  }

  private onSelecrRepo = (slug: string) => {
    const repo = this.props.repositories[slug]
    this.setState({ repo })
    this.props.fetchProjects(repo)
  }

  private onSelectProject = (num: number) => {
    const { repo } = this.state
    if (!repo) {
      return
    }
    const project = (
      this.props.projects[`${repo.owner}/${repo.name}`] || []
    ).find(p => p.number === num)

    if (project) {
      this.props.displayProject(project)
    }
  }

  private onClickAdd = () => {
    const { displayingProject } = this.props
    if (!displayingProject) {
      return
    }
  }

  public render() {
    const { repo } = this.state
    const { displayingProject, projects, repositories } = this.props
    const options = Object.keys(repositories).map(slug => ({
      key: slug,
      value: slug,
      text: slug,
    }))

    const projectOptions = (
      (repo && projects[`${repo.owner}/${repo.name}`]) ||
      []
    ).map(p => ({
      key: p.number,
      value: p.number,
      text: p.name,
    }))

    return (
      <Container>
        <h2>タブを追加</h2>
        <p>追加したいプロジェクトを選んでタブに追加してください.</p>
        <Dropdown
          placeholder="Select repository"
          options={options}
          search={true}
          fluid={true}
          selection={true}
          onChange={(_, data) => this.onSelecrRepo(data.value as string)}
        />
        <Divider />
        {projectOptions.length > 0 && (
          <Dropdown
            placeholder="Select project"
            options={projectOptions}
            fluid={true}
            selection={true}
            onChange={(_, data) => this.onSelectProject(data.value as number)}
          />
        )}
        <Button
          disabled={displayingProject === undefined}
          onClick={this.onClickAdd}
        >
          追加する
        </Button>
        <Divider />
        <h2>Preview</h2>
        {displayingProject && <Project project={displayingProject} />}
      </Container>
    )
  }
}

const mapState = (state: RematchRootState<models>) => ({
  token: state.auth.accessToken || "",
  repositories: state.github.repositories,
  projects: state.github.projects,
  displayingProject: state.github.displayProject,
})

const mapDispatch = ({
  github: { fetchRepos, fetchProjects, displayProject },
}: RematchDispatch<models>) => ({
  fetchRepos,
  fetchProjects,
  displayProject,
})

const mergeProps = (
  props: ReturnType<typeof mapState>,
  { fetchRepos, fetchProjects, displayProject }: ReturnType<typeof mapDispatch>,
) => ({
  ...props,
  fetchRepos: () => fetchRepos(props.token),
  fetchProjects: (repo: GitHubRepository) =>
    fetchProjects({ token: props.token, repo }),
  displayProject: (project: GitHubProject) =>
    displayProject({ token: props.token, project }),
})

export default connect(
  mapState,
  mapDispatch,
  mergeProps,
)(Pane)
