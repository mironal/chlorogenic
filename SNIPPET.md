```tsx
import { RematchDispatch, RematchRootState } from "@rematch/core"

import React from "react"
import { connect } from "react-redux"
import { models } from "../store"


type Props = ReturnType<typeof mapState> & ReturnType<typeof mapDispatch>
// Or
type Props = ReturnType<typeof mergeProps>

const View = ({}: Props) => ()

const mapState = ({}: RematchRootState<models>) => ({ })
const mapDispatch = ({  }: RematchDispatch<models>) => ({})

// delete this, if unnecessary
const mergeProps = ({  }: ReturnType<typeof mapState>, { }: ReturnType<typeof mapDispatch>) => ({})

export default connect(
  mapState,
  mapDispatch,
  mergeProps
)(View)
```