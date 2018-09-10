import { createModel, ModelConfig } from "@rematch/core"
import firebase from "firebase/app"
import "firebase/auth"
import { resetOnSignout } from "../store"

export interface AuthModel {
  token?: string
  loading: boolean
  user?: firebase.UserInfo
}

export default createModel<AuthModel, ModelConfig<AuthModel>>({
  effects: dispatch => ({
    async signIn() {
      this.setLoading(true)

      const provider = new firebase.auth.GithubAuthProvider()
      provider.addScope("repo")
      const auth = await firebase.auth().signInWithPopup(provider)

      this.setLoading(false)

      this.setAuth({
        token: (auth.credential as any).accessToken!,
        user: {
          displayName: auth.user!.displayName,
          email: auth.user!.email,
          phoneNumber: auth.user!.phoneNumber,
          photoURL: auth.user!.photoURL,
          providerId: auth.user!.providerId,
          uid: auth.user!.uid,
        },
      })
    },
    async signOut() {
      this.setLoading(true)
      await firebase.auth().signOut()
      resetOnSignout()

      this.setAuth({ token: undefined, user: undefined })

      this.setLoading(false)
    },
  }),
  reducers: {
    setAuth: (state, { user, token }: Pick<AuthModel, "user" | "token">) => {
      return {
        ...state,
        token,
        loading: false,
        user,
      }
    },
    setGitHubToken: (state, token) => {
      return {
        ...state,
        token,
      }
    },
    setLoading: (state, loading) => {
      return {
        ...state,
        loading,
      }
    },
  },
  state: { loading: false },
})
