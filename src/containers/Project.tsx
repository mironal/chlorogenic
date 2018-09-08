import React from "react"
import Project from "../components/Project"
import { GitHubProject } from "../models/github"

export interface ProjectIncomingProps {
  project: GitHubProject
}

export default class Pane extends React.PureComponent<ProjectIncomingProps> {
  public render() {
    const { project } = this.props
    return <Project project={project} />
  }
}
