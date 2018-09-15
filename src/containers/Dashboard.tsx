import { RematchDispatch, RematchRootState } from "@rematch/core"
import React from "react"
import { connect } from "react-redux"

import styled from "styled-components"

import { DragDropContext } from "react-dnd"
import HTML5Backend from "react-dnd-html5-backend"
import { models } from "../store"
import { Flexbox } from "../UX"
import ProjectColumn from "./ProjectColumn"
import ProjectColumnSelector from "./ProjectColumnSelector"

type Props = ReturnType<typeof margeProps>

const BoardContainer = styled(Flexbox)`
  flex-flow: row nowrap;
  margin-top: 1em;
  justify-content: center;
  width: 100vw;
  height: 100%;
`

const Scroller = styled(Flexbox)`
  overflow-x: auto;
`

const DnDBoard = DragDropContext(HTML5Backend)(BoardContainer)

const Board = ({ columns }: Props) => {
  return (
    <DnDBoard>
      <Scroller>
        {columns.map(c => (
          <ProjectColumn key={c.id} column={c} />
        ))}
        <ProjectColumnSelector />
      </Scroller>
    </DnDBoard>
  )
}

const mapState = ({ columns }: RematchRootState<models>) => ({
  columns,
})

const mapDispatch = ({  }: RematchDispatch<models>) => ({})

const margeProps = (
  { ...rest }: ReturnType<typeof mapState>,
  { ...fns }: ReturnType<typeof mapDispatch>,
) => ({
  ...rest,
  ...fns,
})

export default connect(
  mapState,
  mapDispatch,
  margeProps,
)(Board)
