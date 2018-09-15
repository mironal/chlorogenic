import React from "react"
import { GitHubProjectCard, GitHubProjectColumn } from "../models/github"
import { Box } from "../UX"
import styled from "../UX/Styled"

export interface ProjectColumnProps {
  column: GitHubProjectColumn
}
const CardBox = styled(Box)`
  border-radius: 4px;
  padding: 0.2em;
  background: ${({ theme }) => theme.baseBackground};
  margin-bottom: 0.2em;
  font-size: small;
`

const EllipsisP = styled.p`
  font-size: small;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin: 2px;
`

const Card = ({ card }: { card: GitHubProjectCard }) => {
  let Content = <span>Unknown</span>
  if (card.note) {
    Content = <EllipsisP>{card.note}</EllipsisP>
  } else if (card.issue) {
    Content = (
      <a href={card.issue.url} target="_blank">
        <EllipsisP>
          #{card.issue.number} {card.issue.title}
        </EllipsisP>
      </a>
    )
  }
  return <CardBox>{Content}</CardBox>
}

export default ({ column }: ProjectColumnProps) => {
  return (
    <>
      {column.cards.map(c => (
        <Card key={c.id} card={c} />
      ))}
    </>
  )
}
