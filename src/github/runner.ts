import axios from "axios"
import {
  addProjectCardQuery,
  organizationProjectQuery,
  repositoryProjectQuery,
} from "../github/graphql_query"
import CHLOError from "../misc/CHLOError"
import { createProjectSlug } from "../misc/github"
import {
  GitHubOrgProjectIdentifier,
  GitHubProject,
  GitHubRepoProjectIdentifier,
} from "../models/github.types"
import { parseProjectColumns } from "./parser"

const conf = (token: string) => ({
  url: "https://api.github.com/graphql",
  headers: {
    Authorization: `bearer ${token}`,
    Accept: "application/vnd.github.v4.idl",
  },
  method: "POST",
})

export const addProjectCard = async (
  token: string,
  projectColumnId: string,
  contentId: string,
): Promise<void> => {
  const query = addProjectCardQuery(projectColumnId, contentId)

  const resp = await axios({ ...conf(token), data: { query } })
  return Promise.resolve()
}

export const fetchRepositoryProject = async (
  token: string,
  identifier: GitHubRepoProjectIdentifier,
): Promise<GitHubProject> => {
  const query = repositoryProjectQuery(identifier)
  const resp = await axios({ ...conf(token), data: { query } })
  const { name, url } = resp.data.data.repository.project as {
    name: string
    url: string
  }
  const columns = parseProjectColumns(resp.data.data.repository.project)

  const project: GitHubProject = {
    name,
    url,
    slug: `${identifier.repository.owner}/${identifier.repository.name}/${
      identifier.number
    }`,
    identifier,
    columns,
  }
  return project
}

export const fetchOrganizationProject = async (
  token: string,
  identifier: GitHubOrgProjectIdentifier,
): Promise<GitHubProject> => {
  const query = organizationProjectQuery(identifier)
  const resp = await axios({ ...conf(token), data: { query } })

  if (!resp.data.data.organization) {
    throw new CHLOError(
      "Organization not found",
      `for ${createProjectSlug(identifier)}`,
    )
  }

  if (!resp.data.data.organization.project) {
    throw new CHLOError(
      "Project not found",
      `for ${createProjectSlug(identifier)}`,
    )
  }

  try {
    const { name, url } = resp.data.data.organization.project as {
      name: string
      url: string
    }
    const columns = parseProjectColumns(resp.data.data.organization.project)
    const project: GitHubProject = {
      name,
      url,
      slug: `org/${identifier.organization}/${identifier.number}`,
      identifier,
      columns,
    }
    return project
  } catch (error) {
    throw new CHLOError("Invalid response format")
  }
}
