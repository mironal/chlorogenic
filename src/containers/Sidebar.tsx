import { Link } from "@reach/router"
import * as React from "react"
import styled from "../appearance/styled"
import { Button, Flexbox, Icon } from "../components/parts"
import { PanelModel } from "../models/userConfig"

interface SidebarProps {
  panelIndex: number
  panels: PanelModel[]
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

const NavLink: React.SFC<any> = props => (
  <Link
    getProps={({ isPartiallyCurrent }) => ({
      className: isPartiallyCurrent ? "nav-active" : "nav",
    })}
    {...props}
  />
)

const View = ({
  panelIndex,
  panels,
  onClickAdd,
  onClickEdit,
}: SidebarProps) => {
  return (
    <SideBar>
      <UL>
        {panels.map((p, i) => (
          <LI active={panelIndex === i} key={i}>
            <NavLink to={`/${i}`}>{p.name}</NavLink>
            <span onClick={() => onClickEdit && onClickEdit(i)}>
              {" "}
              <Icon type="circleEditOutline" size={0.6} />
            </span>
          </LI>
        ))}
      </UL>
      <Button onClick={onClickAdd}>Add new panel</Button>
      <a href="https://github.com/mironal/chlorogenic" target="_blank">
        <Icon type="githubFace" size={0.6} />
      </a>
    </SideBar>
  )
}

export default View
