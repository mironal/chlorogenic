import { createModel, ModelConfig } from "@rematch/core"
import firebase from "firebase/app"
import "firebase/auth"

export interface AuthModel {
  accessToken?: string
  loading: boolean
  user?: firebase.UserInfo
}

const restore = () => {
  const str = localStorage.getItem("chlorogenic.auth")
  if (typeof str === "string") {
    try {
      const { user, accessToken } = JSON.parse(str)
      if (typeof user === "object" && typeof accessToken === "string") {
        return { user, accessToken }
      }
    } catch (e) {
      // tslint:disable-next-line:no-console
      console.error(e)
      localStorage.removeItem("chlorogenic.auth")
    }
  }
  return null
}

let initialState: AuthModel = {
  accessToken: undefined,
  loading: false,
  user: undefined,
}

const restored = restore()

if (restored) {
  initialState = { ...initialState, ...restored }
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
        accessToken: (auth.credential as any).accessToken!,
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

      this.setAuth({ accessToken: undefined, user: undefined })
      localStorage.removeItem("chlorogenic.auth")
      this.setLoading(false)
    },
  }),
  reducers: {
    setAuth: (
      state,
      { user, accessToken }: Pick<AuthModel, "user" | "accessToken">,
    ) => {
      const store = { user, accessToken }
      localStorage.setItem("chlorogenic.auth", JSON.stringify(store))

      return {
        ...state,
        accessToken,
        loading: false,
        user,
      }
    },
    setGitHubToken: (state, token) => {
      return {
        ...state,
        githubToken: token,
      }
    },
    setLoading: (state, loading) => {
      return {
        ...state,
        loading,
      }
    },
  },
  state: initialState,
})
