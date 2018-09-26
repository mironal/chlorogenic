import { RematchDispatch, RematchRootState } from "@rematch/core"
import * as React from "react"
import { connect } from "react-redux"

import styled from "styled-components"

import { DragDropContext } from "react-dnd"
import HTML5Backend from "react-dnd-html5-backend"
import { RenamePanelFormDialog } from "../components"
import { Flexbox } from "../components/parts"
import {
  pipelinePromiseAction,
  pipelinePromiseAction1,
  pipelinePromiseAction2,
} from "../misc/prelude"
import Modal from "../Modal"
import { createShowError, createShowSuccess } from "../models/notification"
import {
  createCreatePanel,
  createRemovePanel,
  createRenamePanel,
} from "../models/userConfig"
import { models } from "../store"
import ProjectColumn from "./ProjectColumn"
import ProjectColumnSelector from "./ProjectColumnSelector"
import Sidebar from "./Sidebar"

const BoardContainer = styled(Flexbox)`
  flex-flow: row nowrap;
  justify-content: center;
  width: calc(100vw - 12em);
  min-height: calc(100vh - 3em);
`

const Stroller = styled(Flexbox)`
  overflow-x: auto;
`

const DnDBoard = DragDropContext(HTML5Backend)(BoardContainer)

type Props = ReturnType<typeof margeProps>
interface State {
  editingIndex?: number
}

class Board extends React.PureComponent<Props, State> {
  public state: State = {}

  private startEdit = (editingIndex: number) => this.setState({ editingIndex })
  private endEdit = () => this.setState({ editingIndex: undefined })

  public render() {
    const {
      panels,
      createPanel,
      renamePanel,
      removePanel,
      panelIndex,
    } = this.props
    const { editingIndex } = this.state

    if (panelIndex >= panels.length) {
      return <h1>404</h1>
    }
    return (
      <Flexbox style={{ height: "100%" }}>
        <Sidebar
          panelIndex={panelIndex}
          panels={panels}
          onClickAdd={createPanel}
          onClickEdit={this.startEdit}
        />
        <DnDBoard>
          <Stroller>
            {panels[panelIndex].columns.map(c => (
              <ProjectColumn
                key={c.id}
                panelIndex={panelIndex}
                identifier={c}
              />
            ))}
            <ProjectColumnSelector panelIndex={panelIndex} />
          </Stroller>
        </DnDBoard>
        {editingIndex !== undefined && (
          <Modal onClickOutside={this.endEdit}>
            <RenamePanelFormDialog
              defaultName={panels[editingIndex].name}
              onClickCancel={this.endEdit}
              onClickDelete={() => {
                this.endEdit()
                removePanel(editingIndex)
              }}
              onClickOk={name => {
                this.endEdit()
                renamePanel(editingIndex, name)
              }}
            />
          </Modal>
        )}
      </Flexbox>
    )
  }
}

const mapState = (
  { userConfig: { panels } }: RematchRootState<models>,
  { panelIndex }: { panelIndex: number | string },
) => ({
  panels,
  panelIndex: parseInt(`${panelIndex}`, 10),
})

const mapDispatch = ({ userConfig, notification }: RematchDispatch<models>) => {
  const showSuccess = createShowSuccess(notification)
  const showError = createShowError(notification)
  return {
    createPanel: pipelinePromiseAction(
      createCreatePanel(userConfig),
      showError,
      () => showSuccess("New panel created"),
    ),
    renamePanel: pipelinePromiseAction2(
      createRenamePanel(userConfig),
      showError,
      () => showSuccess("A panel renamed"),
    ),

    removePanel: pipelinePromiseAction1(
      createRemovePanel(userConfig),
      showError,
      () => showSuccess("A panel removed"),
    ),
  }
}

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
