import { RematchDispatch, RematchRootState } from "@rematch/core"
import React from "react"
import { connect } from "react-redux"
import { Button, Dropdown, Icon, Segment } from "semantic-ui-react"
import { SplitProjectPanelProps } from "."
import Column from "../../components/Column"
import { createProjectSlug } from "../../misc/project"
import {
  GitHubProject,
  GitHubProjectColumn,
  GithubProjectIdentifier,
} from "../../models/github"
import { models } from "../../store"
import { Segment2 } from "../Dashboard"

type Props = ReturnType<typeof mergeProps>

interface ColumnSelectorProps {
  project?: GitHubProject
  onSelect(columnId: GitHubProjectColumn["id"]): void
}

const ColumnSelector: React.SFC<ColumnSelectorProps> = ({
  project,
  onSelect,
}) => {
  if (!project) {
    return null
  }
  return (
    <>
      <Dropdown
        fluid={true}
        selection={true}
        selectOnNavigation={false}
        search={true}
        onChange={(e, { value }) => onSelect(value as string)}
        options={project.columns.map(c => ({
          value: c.id,
          text: c.name,
        }))}
      />
    </>
  )
}

interface State {
  leftColumnId?: GitHubProjectColumn["id"]
  rightColumnId?: GitHubProjectColumn["id"]
}

class View extends React.PureComponent<Props, State> {
  public state: State = {}
  public componentDidMount() {
    const { fetchProject, panel } = this.props
    if (panel.left && panel.right) {
      fetchProject(panel.left)
      fetchProject(panel.right)
    }
  }
  public render() {
    const { leftProject, rightProject } = this.props
    const { leftColumnId, rightColumnId } = this.state
    return (
      <Segment.Group horizontal={true}>
        <Segment2 loading={leftProject.loading}>
          <ColumnSelector
            project={leftProject.project}
            onSelect={id => this.setState({ leftColumnId: id })}
          />
          {leftColumnId &&
            rightColumnId && (
              <Button icon={true} labelPosition="right">
                <Icon name="angle double right" />
                Copy all projects to right project column
              </Button>
            )}
          {leftColumnId &&
            leftProject.project && (
              <Column
                column={
                  leftProject.project.columns.find(c => c.id === leftColumnId)!
                }
              />
            )}
        </Segment2>
        <Segment2 loading={rightProject.loading}>
          <ColumnSelector
            project={rightProject.project}
            onSelect={id => this.setState({ rightColumnId: id })}
          />
          {leftColumnId &&
            rightColumnId && (
              <Button icon={true} labelPosition="left">
                <Icon name="angle double left" />
                Copy all projects to left project column
              </Button>
            )}
          {rightColumnId &&
            rightProject.project && (
              <Column
                column={
                  rightProject.project.columns.find(
                    c => c.id === rightColumnId,
                  )!
                }
              />
            )}
        </Segment2>
      </Segment.Group>
    )
  }
}

const mapState = (
  { auth: { token }, projects }: RematchRootState<models>,
  ownProps: SplitProjectPanelProps,
) => ({ ...ownProps, projects, token: token || "" })

const mapDispatch = ({ projects }: RematchDispatch<models>) => ({
  ...projects,
})

const mergeProps = (
  { token, projects, ...rest }: ReturnType<typeof mapState>,
  { fetchProject, ...fns }: ReturnType<typeof mapDispatch>,
) => {
  const leftProject = (rest.panel.left &&
    projects[createProjectSlug(rest.panel.left)]) || { loading: true }
  const rightProject = (rest.panel.right &&
    projects[createProjectSlug(rest.panel.right)]) || { loading: true }

  return {
    ...rest,
    ...fns,
    leftProject,
    rightProject,
    fetchProject: (identifier: GithubProjectIdentifier) => {
      fetchProject({ token, identifier })
    },
  }
}

export default connect(
  mapState,
  mapDispatch,
  mergeProps,
)(View)
