import React from "react"
import Project from "../components/Project"
import { GitHubProject } from "../models/github"
import PaneContainer from "./PaneContainer"

export interface ProjectPaneProps {
  project: GitHubProject
}

export default class extends React.PureComponent<ProjectPaneProps> {
  public render() {
    return (
      <PaneContainer>
        <Project project={this.props.project} />
      </PaneContainer>
    )
  }
}
