import * as firebase from "firebase/app"
import "firebase/auth"
import { firestoreCollectionReference } from "./firestore"

export const signIn = async () => {
  const provider = new firebase.auth.GithubAuthProvider()
  provider.addScope("repo")
  const { user, credential } = await firebase.auth().signInWithPopup(provider)
  if (!user || !credential) {
    throw new Error("There are no user or credential")
  }

  const githubToken = (credential as any).accessToken!

  const userInfo: firebase.UserInfo = {
    displayName: user.displayName,
    email: user.email,
    phoneNumber: user.phoneNumber,
    photoURL: user.photoURL,
    providerId: user.providerId,
    uid: user.uid,
  }

  firestoreCollectionReference("configs")
    .doc(user.uid)
    .set(
      {
        githubToken,
        ...userInfo,
      },
      { merge: true },
    )

  return userInfo
}

export const signOut = async () => firebase.auth().signOut()
