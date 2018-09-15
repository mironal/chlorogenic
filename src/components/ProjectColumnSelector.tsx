import React from "react"
import { Button } from "../UX"

export interface ProjectColumnSelector {
  input?: string
  error?: Error
  onChange?(input: string): void
  onClickFetch?(): void
}

export default ({ input, onChange, onClickFetch }: ProjectColumnSelector) => {
  return (
    <>
      <input
        value={input}
        onChange={ev => onChange && onChange(ev.currentTarget.value)}
        onKeyDown={e => e.which === 13 && onClickFetch && onClickFetch()}
      />
      <Button onClick={onClickFetch} size="small">
        fetch
      </Button>
    </>
  )
}
