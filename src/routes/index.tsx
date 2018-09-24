import { Redirect, RouteComponentProps, Router } from "@reach/router"
import * as React from "react"
import * as Loadable from "react-loadable"
import { VFlexbox } from "../components/parts"
import Header from "../containers/Header"

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
        <AsyncDashboard path="/" />
      ) : (
        <Redirect from="/" to="/signin" noThrow={true} />
      )}
      {authed ? (
        <Redirect from="/signin" to="/" noThrow={true} />
      ) : (
        <AsyncSignIn path="signin" />
      )}
    </Router>
  </VFlexbox>
)
