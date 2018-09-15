import React from "react"
import { GitHubProjectCard, GitHubProjectColumn } from "../models/github"
import { Box } from "../UX"

export interface ProjectColumnProps {
  column: GitHubProjectColumn
}

const Card = ({ card }: { card: GitHubProjectCard }) => {
  let Content = <span>Unknown</span>
  if (card.note) {
    Content = <p>{card.note}</p>
  } else if (card.issue) {
    Content = <p>{card.issue.title}</p>
  }
  return <Box>{Content}</Box>
}

export default ({ column }: ProjectColumnProps) => {
  return (
    <>
      <h3>{column.name}</h3>
      {column.cards.map(c => (
        <Card key={c.id} card={c} />
      ))}
    </>
  )
}
