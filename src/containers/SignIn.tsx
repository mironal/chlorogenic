import { RematchDispatch, RematchRootState } from "@rematch/core"
import GithubFaceIcon from "mdi-react/GithubFaceIcon"
import React from "react"
import { connect } from "react-redux"
import styled from "../appearance/styled"
import { Button, Icon, VFlexbox } from "../components/parts"
import { signIn } from "../firebase/auth"
import { createSetError, createShowSuccess } from "../models/notification"
import { models } from "../store"

const Container = styled(VFlexbox)`
  justify-content: center;
  align-items: center;
`

Container.displayName = "SignInContainer"

const Title = styled.h1`
  ::after {
    content: "";
    border-bottom: solid 2px;
    margin-bottom: 0.6em;
    display: block;
  }
`

Title.displayName = "Title"

type Props = ReturnType<typeof mapDispatch>

const View: React.SFC<Props> = ({ showSuccess, setError }) => {
  return (
    <Container>
      <Title>chlorogenic</Title>
      <Button
        onClick={() =>
          signIn()
            .then(user =>
              showSuccess(
                "Successful Signing",
                `Welcome ${user.displayName} (◍•ᴗ•◍)`,
              ),
            )
            .catch(error => {
              setError(error)
            })
        }
        size="big"
      >
        <Icon>
          <GithubFaceIcon />
        </Icon>
        Sign in with GitHub
      </Button>
      <p>What is stored in firebase?</p>
      <ul>
        <li>Your GitHub access token to access GitHub API.</li>
        <li>Your GitHub profile information for displaying icon etc.</li>
        <li>An application config for chlorogenic.</li>
      </ul>
      <p>
        Your personal data is kept secure so that it is invisible to other
        users.
      </p>
    </Container>
  )
}

const mapState = ({  }: RematchRootState<models>) => ({})
const mapDispatch = ({ notification }: RematchDispatch<models>) => ({
  showSuccess: createShowSuccess(notification),
  setError: createSetError(notification),
})

export default connect(
  mapState,
  mapDispatch,
)(View)

View.displayName = "SignIn"
