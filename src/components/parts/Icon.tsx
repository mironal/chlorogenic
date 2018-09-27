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
import { withTheme } from "../../appearance/styled"
import { Theme } from "../../appearance/theme"
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
  size: number
  theme?: Theme
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

export default withTheme<IconProps>(({ type, size }) => {
  const path = mapTypeToIconPath[type]
  if (!path) {
    throw new Bug("Invalid argument")
  }
  return <Icon path={path} size={size} color="currentColor" />
})
