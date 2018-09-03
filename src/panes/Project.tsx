import { RematchDispatch, RematchRootState } from "@rematch/core"
import React from "react"
import { connect } from "react-redux"
import Project from "../components/Project"
import { GithubProjectIdentifier } from "../models/github"
import { createSlug } from "../models/projects"
import { models } from "../store"
import PaneContainer from "./PaneContainer"

export interface ProjectIncomingProps {
  identifier: GithubProjectIdentifier
}

type PaneProps = ReturnType<typeof mergeProps>
class Pane extends React.PureComponent<PaneProps> {
  public componentDidMount() {
    this.props.fetch()
  }
  public render() {
    const { project } = this.props
    if (!project) {
      return <PaneContainer>Loading...</PaneContainer>
    }
    return (
      <PaneContainer>
        <Project project={project} />
      </PaneContainer>
    )
  }
}

const mapState = (
  state: RematchRootState<models>,
  { identifier }: ProjectIncomingProps,
) => ({
  token: state.auth.accessToken || "",
  identifier,
  project: state.projects.projects[createSlug(identifier)],
})

const mapDispatch = ({ projects: { add } }: RematchDispatch<models>) => ({
  add,
})

const mergeProps = (
  { identifier, token, ...rest }: ReturnType<typeof mapState>,
  { add }: ReturnType<typeof mapDispatch>,
) => ({
  ...rest,
  fetch: () => add({ token, identifier }),
})

export default connect(
  mapState,
  mapDispatch,
  mergeProps,
)(Pane)
