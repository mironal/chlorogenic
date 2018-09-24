import { Redirect, RouteComponentProps, Router } from "@reach/router"
import * as React from "react"
import * as Loadable from "react-loadable"
import { VFlexbox } from "../components/parts"
import Header from "../containers/Header"
import paths from "./paths"

const Loading = () => <div>Loading...</div>

const AsyncDashboard = Loadable<RouteComponentProps, {}>({
  loader: () => import("../containers/Dashboard"),
  loading: Loading,
})

const AsyncSignIn = Loadable<RouteComponentProps, {}>({
  loader: () => import("../containers/SignIn"),
  loading: Loading,
})

export const MainRouter = ({ authed }: { authed: boolean }) => (
  <VFlexbox>
    {authed && <Header />}
    <Router>
      {authed ? (
        <AsyncDashboard path={paths.Root} />
      ) : (
        <Redirect from={paths.Root} to={paths.SignIn} noThrow={true} />
      )}
      {authed ? (
        <Redirect from={paths.SignIn} to={paths.Root} noThrow={true} />
      ) : (
        <AsyncSignIn path={paths.SignIn} />
      )}
    </Router>
  </VFlexbox>
)
