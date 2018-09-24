import axios from "axios"
import {
  addProjectCardQuery,
  moveProjectCardQuery,
  organizationProjectQuery,
  repositoryProjectQuery,
} from "../github/graphql_query"

import { RecoverableError } from "../misc/errors"
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
) => {
  const query = addProjectCardQuery(projectColumnId, contentId)

  await axios({ ...conf(token), data: { query } })
  return Promise.resolve({ projectColumnId, contentId })
}

export const moveProjectCard = async (
  token: string,
  cardId: string,
  columnId: string,
) => {
  const query = moveProjectCardQuery(cardId, columnId)
  await axios({ ...conf(token), data: { query } })
  return Promise.resolve({ cardId, columnId })
}

export const fetchRepositoryProject = async (
  token: string,
  identifier: GitHubRepoProjectIdentifier,
): Promise<GitHubProject> => {
  const query = repositoryProjectQuery(identifier)
  const resp = await axios({ ...conf(token), data: { query } })

  if (!resp.data.data.repository) {
    throw new RecoverableError(
      "Repository not found",
      createProjectSlug(identifier),
    )
  }

  if (!resp.data.data.repository.project) {
    throw new RecoverableError(
      "Project not found",
      createProjectSlug(identifier),
    )
  }
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
    throw new RecoverableError(
      "Organization not found",
      createProjectSlug(identifier),
    )
  }

  if (!resp.data.data.organization.project) {
    throw new RecoverableError(
      "Project not found",
      createProjectSlug(identifier),
    )
  }

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
}
