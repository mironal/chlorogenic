import * as firebase from "firebase/app"
import "firebase/firestore"
import { PanelModel } from "../models/userConfig"

export const firestoreCollectionReference = (collection: "configs") =>
  firebase.firestore().collection(collection)

export const updateConfig = (
  user: firebase.UserInfo,
  githubToken: string,
  panelIndex: number,
  panels: PanelModel[],
) =>
  firestoreCollectionReference("configs")
    .doc(user.uid)
    .set({ githubToken, panelIndex, panels, user }, { merge: true })
