import React from "react"
import styled from "styled-components"
import { GitHubProjectColumn } from "../models/github"
import Card from "./Card"

export interface ColumnProps {
  column: GitHubProjectColumn
}

const ColumnContainer = styled.div`
  border: 1px #e1e4e8 solid;
  border-radius: 4px;
`
const Content = styled.div`
  display: flex;
  flex-flow: row wrap;
`
const ColumnTitle = styled.h2`
  font-weight: normal;
`

export default ({ column }: ColumnProps) => {
  return (
    <ColumnContainer className="ColumnContainer">
      <ColumnTitle>{column.name}</ColumnTitle>
      <Content>
        {column.cards.map(c => (
          <Card key={c.id} card={c} />
        ))}
      </Content>
    </ColumnContainer>
  )
}
