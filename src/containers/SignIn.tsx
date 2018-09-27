import { RematchDispatch, RematchRootState } from "@rematch/core"
import * as React from "react"
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
  font-size: 3em;
  margin-top: 4em;
  ::after {
    content: "";
    border-bottom: solid 2px;
    margin-bottom: 0.6em;
    display: block;
  }
`

const SubTitle = styled.h2`
  padding-top: 3em;
  margin: 0;
  min-height: 2em;
  > .mdi-icon {
    margin-right: 0.3em;
    position: relative;
    top: 6px;
  }
`

Title.displayName = "Title"

const FeatureTitle = styled.h3`
  margin-bottom: 0;
  display: inline-flex;
  min-height: 2em;
  > .mdi-icon {
    margin-right: 0.1em;
  }
`

const PreviewSegment = styled.div`
  max-width: 80%;
  margin-bottom: 2em;
`

type Props = ReturnType<typeof mapDispatch>

const View: React.SFC<Props> = ({ showSuccess, showError }) => {
  return (
    <Container>
      <a href="https://github.com/mironal/chlorogenic" target="_blank">
        <img
          style={{ position: "absolute", top: 0, right: 0, border: 0 }}
          src="https://s3.amazonaws.com/github/ribbons/forkme_right_white_ffffff.png"
          alt="Fork me on GitHub"
        />
      </a>
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
        <Icon type="githubFace" size={0.6} />
        Sign in with GitHub
      </Button>
      <SubTitle>
        <Icon type="securityLock" size={0.6} />
        Privacy Policy & Security
      </SubTitle>
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
      <SubTitle>
        <Icon type="coffee" size={0.6} />
        Features
      </SubTitle>
      <PreviewSegment>
        <FeatureTitle>
          <Icon type="monitorDashboard" size={0.6} />
          Add columns of multiple projects
        </FeatureTitle>
        <p>
          Columns of multiple projects can be put in one panel regardless of
          repository or organization.
        </p>
        <LoadGif gif="add" />
      </PreviewSegment>
      <PreviewSegment>
        <FeatureTitle>
          <Icon type="cubeSend" size={0.6} />
          Batch operation.
        </FeatureTitle>
        <LoadGif gif="move" />
      </PreviewSegment>
      <PreviewSegment>
        <FeatureTitle>
          <Icon type="sync" size={0.6} />
          Sync your panels
        </FeatureTitle>
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
