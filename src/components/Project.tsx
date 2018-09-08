import React from "react"
import { GitHubProject } from "../models/github"
import Column from "./Column"

export default ({ project }: { project: GitHubProject }) => (
  <>
    <h2>{project.name}</h2>
    {(project.columns || []).map(col => (
      <Column key={col.id} column={col} />
    ))}
  </>
)
