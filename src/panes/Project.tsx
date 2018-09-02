import React from "react"
import { Container } from "semantic-ui-react"
import Project from "../components/Project"
import { GitHubProject } from "../models/github"

export interface ProjectPaneProps {
  project: GitHubProject
}

export default class extends React.PureComponent<ProjectPaneProps> {
  public render() {
    return (
      <Container>
        <Project project={this.props.project} />
      </Container>
    )
  }
}
