import { RematchDispatch, RematchRootState } from "@rematch/core"
import GithubFaceIcon from "mdi-react/GithubFaceIcon"
import React from "react"
import { connect } from "react-redux"
import styled from "../appearance/styled"
import { Button, Icon, VFlexbox } from "../components/parts"
import { signIn } from "../firebase/auth"
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

const View: React.SFC<Props> = ({}) => {
  return (
    <Container>
      <Title>chlorogenic</Title>
      <Button onClick={signIn} size="big">
        <Icon>
          <GithubFaceIcon />
        </Icon>
        Sign in with GitHub
      </Button>
    </Container>
  )
}

const mapState = ({  }: RematchRootState<models>) => ({})
const mapDispatch = ({  }: RematchDispatch<models>) => ({})

export default connect(
  mapState,
  mapDispatch,
)(View)

View.displayName = "SignIn"
