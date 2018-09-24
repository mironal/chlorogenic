import * as firebase from "firebase/app"
import "firebase/firestore"

export default () => {
  const config = {
    apiKey: process.env.REACT_APP_FIREBASE_apiKey,
    authDomain: process.env.REACT_APP_FIREBASE_authDomain,
    databaseURL: process.env.REACT_APP_FIREBASE_databaseURL,
    messagingSenderId: process.env.REACT_APP_FIREBASE_messagingSenderId,
    projectId: process.env.REACT_APP_FIREBASE_projectId,
    storageBucket: process.env.REACT_APP_FIREBASE_storageBucket,
  }

  if (process.env.NODE_ENV !== "production") {
    Object.values(config).forEach(v => {
      if (v === undefined) {
        throw new Error(
          `Invalid firebase config. please check .env file: ${JSON.stringify(
            config,
          )}`,
        )
      }
    })
  }
  if (firebase.apps.length === 0) {
    firebase.initializeApp(config)
    firebase.firestore().settings({
      timestampsInSnapshots: true,
    })
  }
}
