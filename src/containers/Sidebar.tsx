import CircleEditOutlineIcon from "mdi-react/CircleEditOutlineIcon"
import React from "react"
import { ColumnPanel } from "../models/columns"
import { Button, Flexbox } from "../UX"
import styled from "../UX/Styled"

interface SidebarProps {
  panelIndex: number
  columns: ColumnPanel[]
  onClick?(index: number): void
  onClickAdd?(): void
  onClickEdit?(index: number): void
}
const SideBar = styled(Flexbox)`
  flex-direction: column;
  width: 10em;
`
const UL = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`
const LI = styled.li<{ active: boolean }>`
  color: ${({ theme, active }) =>
    active ? theme.textColor : theme.secondaryTextColor};
  padding-left: 1em;
  text-indent: -0.7em;
  margin-top: 0.3em;
  &::before {
    content: "•";
    color: ${({ theme, active }) =>
      active ? theme.secondaryBaseColor : theme.baseColor};
    margin-right: 0.2em;
  }
  > span {
    cursor: pointer;
    margin-right: 0.2em;
  }
  svg.mdi-icon {
    vertical-align: -0.2em;
  }
`

const View = ({
  panelIndex,
  columns,
  onClick,
  onClickAdd,
  onClickEdit,
}: SidebarProps) => {
  return (
    <SideBar>
      <UL>
        {columns.map((c, i) => (
          <LI active={panelIndex === i} key={i}>
            <span onClick={() => onClick && onClick(i)}>
              {c.name || `${i}-No name`}{" "}
            </span>
            <span onClick={() => onClickEdit && onClickEdit(i)}>
              {" "}
              <CircleEditOutlineIcon size={16} />
            </span>
          </LI>
        ))}
      </UL>
      <Button onClick={onClickAdd}>Add new panel</Button>
    </SideBar>
  )
}

export default View