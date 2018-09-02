import axios from "axios"
import {
  listColumnsAndCards,
  listRepoProjects,
  listRepositories,
} from "../github/graphql_query"
import {
  GitHubModel,
  GitHubProject,
  GitHubProjectColumn,
  GitHubRepository,
} from "../models/github"

const conf = (token: string) => ({
  url: "https://api.github.com/graphql",
  headers: {
    Authorization: `bearer ${token}`,
    Accept: "application/vnd.github.v4.idl",
  },
  method: "POST",
})

export const fetchProjectColumnsAndCards = async (
  token: string,
  project: GitHubProject,
) => {
  const resp = await axios({
    ...conf(token),
    data: { query: listColumnsAndCards(project) },
  })

  const columns = resp.data.data.repository.project.columns.edges as Array<{
    node: {
      id: string
      name: string
      cards: {
        edges: Array<{
          node: {
            id: string
            databaseId: number
            note?: string
            content?: {
              title: string
              number: number
              url: string
              author: { login: string }
            }
          }
        }>
      }
    }
  }>
  const cs: GitHubProjectColumn[] = columns.map(col => {
    return {
      id: col.node.id,
      name: col.node.name,
      cards: (col.node.cards.edges || []).map(c => {
        if (c.node.content) {
          return {
            id: c.node.id,
            databaseId: c.node.databaseId,
            note: c.node.note,
            issue: {
              title: c.node.content.title,
              number: c.node.content.number,
              url: c.node.content.url,
              auther: c.node.content.author.login,
            },
          }
        }
        return {
          id: c.node.id,
          content: undefined,
          databaseId: c.node.databaseId,
          note: c.node.note || "",
        }
      }),
    }
  })

  return cs
}

export const fetchProjects = async (
  token: string,
  repo: GitHubRepository,
): Promise<GitHubProject[]> => {
  const resp = await axios({
    ...conf(token),
    data: { query: listRepoProjects(repo) },
  })

  if (Array.isArray(resp.data.errors)) {
    throw new Error(resp.data.errors[0].message)
  }

  const projects = resp.data.data.repository.projects.edges as Array<{
    node: { name: string; number: number; body: string }
  }>

  return projects.map(p => ({
    name: p.node.name,
    number: p.node.number,
    body: p.node.body,
    repo,
  }))
}

export const fetchRepositories = async (
  token: string,
): Promise<GitHubModel["repositories"]> => {
  const resp = await axios({
    ...conf(token),
    data: {
      query: listRepositories,
    },
  })

  const myReposTmp = resp.data.data.viewer.repositories.edges as Array<{
    node: {
      name: string
      owner: {
        login: string
      }
    }
  }>
  const myRepos = myReposTmp.map(r => ({
    name: r.node.name,
    owner: r.node.owner.login,
  }))

  const orgs = resp.data.data.viewer.organizations.edges as Array<{
    node: {
      repositories: {
        edges: Array<{
          node: {
            name: string
            owner: {
              login: string
            }
          }
        }>
      }
    }
  }>

  const orgRepos = orgs.reduce((repos, o) => {
    const rs = o.node.repositories.edges.map(r => ({
      name: r.node.name,
      owner: r.node.owner.login,
    }))
    return [...repos, ...rs]
  }, [])
  const repositories = {}
  for (const repo of [...myRepos, ...orgRepos]) {
    repositories[`${repo.owner}/${repo.name}`] = repo
  }
  return repositories
}
