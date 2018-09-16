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
import Sidebar from "./Sidebar"

const BoardContainer = styled(Flexbox)`
  flex-flow: row nowrap;
  justify-content: center;
  width: 100vw;
  height: 100%;
`

const Scroller = styled(Flexbox)`
  overflow-x: auto;
`

const DnDBoard = DragDropContext(HTML5Backend)(BoardContainer)

type Props = ReturnType<typeof margeProps>
interface State {
  panelIndex: number
}
class Board extends React.PureComponent<Props, State> {
  public state: State = { panelIndex: 0 }
  private changePanelIndex = (panelIndex: number) =>
    this.setState({ panelIndex })
  public render() {
    const { columns, createPanel } = this.props
    const { panelIndex } = this.state
    return (
      <Flexbox style={{ height: "100%" }}>
        <Sidebar
          panelIndex={panelIndex}
          columns={columns}
          onClick={this.changePanelIndex}
          onClickAdd={createPanel}
        />
        <DnDBoard>
          <Scroller>
            {columns[panelIndex].columns.map(c => (
              <ProjectColumn key={c.id} column={c} />
            ))}
            <ProjectColumnSelector panelIndex={panelIndex} />
          </Scroller>
        </DnDBoard>
      </Flexbox>
    )
  }
}

const mapState = ({ columns }: RematchRootState<models>) => ({
  columns,
})

const mapDispatch = ({
  columns: { createPanel },
}: RematchDispatch<models>) => ({
  createPanel,
})

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
