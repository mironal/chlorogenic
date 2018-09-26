import { Redirect, RouteComponentProps, Router } from "@reach/router"
import * as React from "react"
import * as Loadable from "react-loadable"
import { VFlexbox } from "../components/parts"
import Header from "../containers/Header"
import paths from "./paths"

const Loading = () => <div>Loading...</div>

const AsyncDashboard = Loadable<
  RouteComponentProps<{ panelIndex: number }>,
  {}
>({
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
      <Redirect
        from="/"
        to={authed ? paths.Dashboard(0) : paths.SignIn}
        noThrow={true}
      />
      {authed ? (
        <Redirect from={paths.SignIn} to={paths.Dashboard(0)} noThrow={true} />
      ) : (
        <AsyncSignIn path={paths.SignIn} />
      )}
      {authed ? (
        <AsyncDashboard path={paths.Dashboard()} />
      ) : (
        <Redirect from="/*" to={paths.SignIn} noThrow={true} />
      )}
    </Router>
  </VFlexbox>
)
