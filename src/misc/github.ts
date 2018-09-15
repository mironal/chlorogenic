import {
  GitHubOrgProjectIdentifier,
  GitHubProjectColumnIdentifier,
  GithubProjectIdentifier,
  GitHubRepoProjectIdentifier,
} from "../models/github.types"

export const createProjectSlug = (
  identifier: GithubProjectIdentifier,
): string => {
  if (!identifier) {
    throw new Error("Invalid argument: identifier is required.")
  }
  if (isGithubRepoProjectIdentifier(identifier)) {
    return `${identifier.repository.owner}/${identifier.repository.name}/${
      identifier.number
    }`
  }
  return `orgs/${identifier.organization}/${identifier.number}`
}

export const isSameProject = (
  a: GithubProjectIdentifier,
  b: GithubProjectIdentifier,
): boolean => {
  if (isGithubRepoProjectIdentifier(a) && isGithubRepoProjectIdentifier(b)) {
    return (
      a.repository.owner === b.repository.owner &&
      a.repository.name === b.repository.name &&
      a.number === b.number
    )
  } else if (
    isGithubOrgProjectIdentifier(a) &&
    isGithubOrgProjectIdentifier(b)
  ) {
    return a.organization === b.organization && a.number === b.number
  }
  return false
}

export const isGithubRepoProjectIdentifier = (
  input: any,
): input is GitHubRepoProjectIdentifier =>
  typeof input === "object" &&
  typeof input.number === "number" &&
  typeof input.repository === "object" &&
  typeof input.repository.owner === "string" &&
  typeof input.repository.name === "string"

export const isGithubOrgProjectIdentifier = (
  input: any,
): input is GitHubOrgProjectIdentifier =>
  typeof input === "object" &&
  typeof input.number === "number" &&
  typeof input.organization === "string"

export const isGitHubProjectColumnIdentifier = (
  obj: any,
): obj is GitHubProjectColumnIdentifier =>
  typeof obj === "object" &&
  typeof obj.id === "string" &&
  typeof obj.project === "object" &&
  (isGithubOrgProjectIdentifier(obj.project) ||
    isGithubRepoProjectIdentifier(obj.project))
