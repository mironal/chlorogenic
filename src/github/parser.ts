import { GitHubProjectCard, GitHubProjectColumn } from "../models/github.types"

export const parseProjectColumns = (project: any): GitHubProjectColumn[] => {
  if (!project) {
    return []
  }
  const rawColumns = project.columns.edges as Array<{
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
              id: string
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
  const columns: GitHubProjectColumn[] = rawColumns.map(col => {
    const cards: GitHubProjectCard[] = (col.node.cards.edges || []).map(c => {
      if (c.node.content) {
        return {
          id: c.node.id,
          note: c.node.note,
          issue: {
            id: c.node.content.id,
            title: c.node.content.title,
            number: c.node.content.number,
            url: c.node.content.url,
            author: c.node.content.author.login,
          },
        }
      }
      return {
        id: c.node.id,
        content: undefined,
        note: c.node.note || "",
      }
    })
    return {
      id: col.node.id,
      name: col.node.name,
      cards,
    }
  })

  return columns
}
