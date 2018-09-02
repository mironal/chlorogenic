import { RematchDispatch, RematchRootState } from "@rematch/core"
import React from "react"
import { connect } from "react-redux"
import { Button, Container, Icon } from "semantic-ui-react"
import { models } from "../store"

type AuthProps = Partial<ReturnType<typeof mapState>> &
  Partial<ReturnType<typeof mapDispatch>>

class Pane extends React.PureComponent<AuthProps> {
  public render() {
    const Content = this.props.authed ? (
      <>
        <h2>Sign out</h2>
        <Button onClick={this.props.signOut}>Sign out</Button>
      </>
    ) : (
      <>
        <h2>Please Auth</h2>
        <Button onClick={this.props.signIn} icon={true} labelPosition="left">
          <Icon name="github" />
          Login with GitHub
        </Button>
      </>
    )

    return <Container textAlign="center">{Content}</Container>
  }
}
const mapState = (state: RematchRootState<models>) => ({
  authed: typeof state.auth.accessToken === "string",
})

const mapDispatch = ({
  auth: { signIn, signOut },
}: RematchDispatch<models>) => ({
  signIn: () => signIn(),
  signOut: () => signOut(),
})

export default connect(
  mapState,
  mapDispatch,
)(Pane)
