import CircleEditOutlineIcon from "mdi-react/CircleEditOutlineIcon"
import GithubFaceIcon from "mdi-react/GithubFaceIcon"
import * as React from "react"
import styled from "../appearance/styled"
import { Button, Flexbox } from "../components/parts"
import { PanelModel } from "../models/userConfig"

interface SidebarProps {
  panelIndex: number
  panels: PanelModel[]
  onClick?(index: number): void
  onClickAdd?(): void
  onClickEdit?(index: number): void
}
const SideBar = styled(Flexbox)`
  z-index: 1000;
  flex-direction: column;
  width: 10em;
  background: ${({ theme }) => theme.backgroundColor};
  border-right: solid 1px ${({ theme }) => theme.baseColor};
  padding: 0.6em;
  padding-bottom: 0;
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);

  & > :last-child {
    margin-top: auto;
  }
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
  panels,
  onClick,
  onClickAdd,
  onClickEdit,
}: SidebarProps) => {
  return (
    <SideBar>
      <UL>
        {panels.map((p, i) => (
          <LI active={panelIndex === i} key={i}>
            <span onClick={() => onClick && onClick(i)}>{p.name} </span>
            <span onClick={() => onClickEdit && onClickEdit(i)}>
              {" "}
              <CircleEditOutlineIcon size={16} />
            </span>
          </LI>
        ))}
      </UL>
      <Button onClick={onClickAdd}>Add new panel</Button>
      <a href="https://github.com/mironal/chlorogenic" target="_blank">
        <GithubFaceIcon />
      </a>
    </SideBar>
  )
}

export default View
