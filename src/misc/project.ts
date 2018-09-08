import {
  GitHubOrgProjectIdentifier,
  GithubProjectIdentifier,
  GitHubRepoProjectIdentifier,
} from "../models/github"

export const createProjectSlug = (
  identifier: GithubProjectIdentifier,
): string => {
  if (!identifier) {
    throw new Error("Invalid argument: identifier is required.")
  }
  if (isGithubRepoProjectIdentifier(identifier)) {
    return `${identifier.repository.owner}/${identifier.repository.owner}/${
      identifier.number
    }`
  }
  return `orgs/${identifier.organization}/${identifier.number}`
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
