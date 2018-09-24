import { RematchDispatch, RematchRootState } from "@rematch/core"
import GithubFaceIcon from "mdi-react/GithubFaceIcon"
import React from "react"
import { connect } from "react-redux"
import styled from "../appearance/styled"
import { Button, Icon, VFlexbox } from "../components/parts"
import { signIn } from "../firebase/auth"
import LoadGif from "../gifs/LoadGif"
import { createShowError, createShowSuccess } from "../models/notification"
import { models } from "../store"

const Container = styled(VFlexbox)`
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

const PreviewSegment = styled.div`
  max-width: 80%;
  margin-bottom: 2em;
`

type Props = ReturnType<typeof mapDispatch>

const View: React.SFC<Props> = ({ showSuccess, showError }) => {
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
            .catch(showError)
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
      <p>
        <a
          href="https://github.com/mironal/chlorogenic/blob/master/firestore.rules"
          target="_blank"
        >
          You can find a firebase security rule is here.
        </a>
      </p>
      <PreviewSegment>
        <h3>Add columns of multiple projects</h3>
        <p>
          Columns of multiple projects can be put in one panel regardless of
          repository or organization.
        </p>
        <LoadGif gif="add" />
      </PreviewSegment>
      <PreviewSegment>
        <h3>Batch operation.</h3>
        <LoadGif gif="move" />
      </PreviewSegment>
      <PreviewSegment>
        <h3>Sync your panels</h3>
        <p>
          Even if you open it with a different browser, your panel settings will
          be synchronized by firebase.
        </p>
        <LoadGif gif="sync" />
      </PreviewSegment>
    </Container>
  )
}

const mapState = ({  }: RematchRootState<models>) => ({})
const mapDispatch = ({ notification }: RematchDispatch<models>) => ({
  showSuccess: createShowSuccess(notification),
  showError: createShowError(notification),
})

export default connect(
  mapState,
  mapDispatch,
)(View)

View.displayName = "SignIn"
