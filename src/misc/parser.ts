import { GithubProjectIdentifier } from "../models/github.types"
import { RecoverableError } from "./errors"

const parseUrlString = (input: string): GithubProjectIdentifier | undefined => {
  const { pathname } = new URL(input)
  // Remove the zero length string to ignore the leading or traling "/"
  const tokens = pathname
    .split("/")
    .filter(t => t.length > 0 && t !== "orgs" && t !== "projects")
  return parseShorthandString(tokens.join("/"))
}

const parseShorthandString = (
  input: string,
): GithubProjectIdentifier | undefined => {
  const tokens = input.split("/").filter(t => t.length > 0)
  if (tokens.length === 2) {
    // maybe org project shorthand e.g. org/num
    const [organization, num] = tokens
    if (/^\d+$/.test(num)) {
      return { organization, number: parseInt(num, 10) }
    }
  } else if (tokens.length === 3) {
    // maybe repo project
    const [owner, name, num] = tokens
    if (/^\d+$/.test(num)) {
      return { repository: { owner, name }, number: parseInt(num, 10) }
    }
  }
  return undefined
}

export const parseProjectIdentifierString = (
  input: string,
): GithubProjectIdentifier | Error => {
  if (input === undefined || input.length === 0) {
    return new RecoverableError("Invalid input", "Can not input empty string.")
  }
  try {
    const identifier = parseShorthandString(input) || parseUrlString(input)
    if (identifier) {
      return identifier
    }
  } catch (e) {
    // ignore
  }
  return new RecoverableError(
    "Invalid input",
    `Can not parse input string: ${input}`,
  )
}
