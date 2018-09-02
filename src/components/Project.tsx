import React from "react"
import Column from "../components/Column"
import { GitHubProject } from "../models/github"

export default ({ project }: { project: GitHubProject }) => (
  <>
    <h2>{project.name}</h2>
    {(project.columns || []).map(col => (
      <Column key={col.id} column={col} />
    ))}
  </>
)
