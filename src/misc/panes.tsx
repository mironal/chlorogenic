import React from "react"
import { TabModel } from "../models/tab"
import { Add, Auth, Project } from "../panes"
import { createProjectSlug } from "./project"

export const mapPanes = (tabs: TabModel["tabs"]) =>
  tabs.map(t => {
    if (t === "AddPane") {
      return { menuItem: "Add", render: () => <Add /> }
    } else if (t === "AuthPane") {
      return { menuItem: "Auth", render: () => <Auth /> }
    }
    return {
      menuItem: `${createProjectSlug(t)}`,
      render: () => <Project identifier={t} />,
    }
  })
