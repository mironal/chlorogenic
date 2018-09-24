import { RematchDispatch, RematchRootState } from "@rematch/core"
import React from "react"
import { connect } from "react-redux"

import styled from "styled-components"

import { DragDropContext } from "react-dnd"
import HTML5Backend from "react-dnd-html5-backend"
import { ModalNameEditor } from "../components"
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
  createSetPanelIndex,
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
      setPanelIndex,
    } = this.props
    const { editingIndex } = this.state
    return (
      <Flexbox style={{ height: "100%" }}>
        <Sidebar
          panelIndex={panelIndex}
          panels={panels}
          onClick={setPanelIndex}
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
            <ModalNameEditor
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

const mapState = ({
  userConfig: { panelIndex, panels },
}: RematchRootState<models>) => ({
  panels,
  panelIndex,
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
    setPanelIndex: createSetPanelIndex(userConfig),
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
