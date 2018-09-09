import React from "react"
import styled from "styled-components"
import { GitHubProjectCard } from "../models/github"

export interface CardProps {
  card: GitHubProjectCard
}

const CardContainer = styled.div`
  font-size: small;
  border: 1px #e1e4e8 solid;
  margin-bottom: 0em;
  margin: 0 0 0.2em 0.2em;
  border-radius: 3px;
  max-width: 10em;
  max-height: 5em;
  padding: 0.2em;
  overflow: hidden;
  white-space: pre-line;
`

const IssueTitle = styled.h3`
  font-size: small;
  margin: 0;
`

export default ({ card }: CardProps) => {
  if (card.issue) {
    return (
      <CardContainer>
        <IssueTitle>
          <a href={card.issue.url} target="_blank">
            {card.issue.title}
          </a>
        </IssueTitle>
      </CardContainer>
    )
  } else if (card.note) {
    return <CardContainer>{card.note}</CardContainer>
  }
  // tslint:disable-next-line:no-console
  console.error("invalid card", card)
  throw new Error("Invalid card")
}
