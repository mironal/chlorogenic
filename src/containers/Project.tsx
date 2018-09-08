import { RematchDispatch, RematchRootState } from "@rematch/core"
import React from "react"
import { connect } from "react-redux"
import Project from "../components/Project"
import { createProjectSlug } from "../misc/project"
import { GitHubProject, GithubProjectIdentifier } from "../models/github"
import { models } from "../store"

export interface ProjectIncomingProps {
  identifer: GithubProjectIdentifier
}

type Props = ReturnType<typeof mapState> & ReturnType<typeof mapDispatch>

class View extends React.PureComponent<Props> {
  public render() {
    const { project } = this.props
    if (!project) {
      return <div>Loading...</div>
    }

    return <Project project={project} />
  }
}

const mapState = (
  { projects }: RematchRootState<models>,
  { identifer }: ProjectIncomingProps,
) => {
  const condition = projects[createProjectSlug(identifer)] || { loading: false }
  return { ...condition }
}
const mapDispatch = ({ projects: fetchProject }: RematchDispatch<models>) => ({
  fetchProject,
})

export default connect(
  mapState,
  mapDispatch,
)(View)
