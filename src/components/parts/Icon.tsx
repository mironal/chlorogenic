import {
  mdiCircleEditOutline,
  mdiClose,
  mdiCloseCircle,
  mdiCoffee,
  mdiCubeSend,
  mdiDragHorizontal,
  mdiGithubFace,
  mdiMonitorDashboard,
  mdiSecurityLock,
  mdiSync,
} from "@mdi/js"
import Icon from "@mdi/react"

import * as React from "react"
import { Bug } from "../../misc/errors"

export type IconType =
  | "githubFace"
  | "closeCircle"
  | "close"
  | "dragHorizontal"
  | "circleEditOutline"
  | "coffee"
  | "cubeSend"
  | "monitorDashboard"
  | "securityLock"
  | "sync"

export interface IconProps {
  type: IconType
  // can not import Icon.IconProps ...
  className?: string
  size?: number | string | null
  color?: string | null
  horizontal?: boolean
  vertical?: boolean
  rotate?: number
  spin?: boolean | number
  style?: React.CSSProperties
  inStack?: boolean
}

const mapTypeToIconPath: { [type: string]: string } = {
  githubFace: mdiGithubFace,
  closeCircle: mdiCloseCircle,
  close: mdiClose,
  dragHorizontal: mdiDragHorizontal,
  circleEditOutline: mdiCircleEditOutline,
  coffee: mdiCoffee,
  cubeSend: mdiCubeSend,
  monitorDashboard: mdiMonitorDashboard,
  securityLock: mdiSecurityLock,
  sync: mdiSync,
}

export default ({ type, ...rest }: IconProps) => {
  const path = mapTypeToIconPath[type]
  if (!path) {
    throw new Bug("Invalid argument")
  }
  return <Icon className="Icon" {...rest} path={path} color="currentColor" />
}
