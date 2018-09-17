import { createModel, ModelConfig } from "@rematch/core"
import { addProjectCard, moveProjectCard } from "../github/runner"
import CHLOError from "../misc/CHLOError"

export interface OpsModel {
  running: boolean
  error: Error | null
}

interface Ops<R = any> {
  exec(): Promise<R>
  onSuccess(remain: number): void
  onError(error: Error): void
}

const queue: Ops[] = []
let running = false

const run = async () => {
  if (running === true) {
    return
  }
  const task = queue.shift()
  if (task) {
    running = true
    await task
      .exec()
      .then(() => task.onSuccess(queue.length))
      .catch(task.onError)
    running = false
    run()
  }
}

const enqueue = (task: Ops | Ops[]) => {
  if (Array.isArray(task)) {
    task.forEach(t => queue.push(t))
  } else {
    queue.push(task)
  }
  run()
}

export interface CreateProjectContentCardOpt {
  columnId: string
  contentId: string
}
export interface MoveProjectCardOpt {
  cardId: string
  columnId: string
}

export default createModel<OpsModel, ModelConfig<OpsModel>>({
  effects: dispatcher => ({
    async createProjectContentCard({
      token,
      opts,
    }: {
      token: string
      opts: CreateProjectContentCardOpt[]
    }) {
      if (typeof token !== "string") {
        throw new CHLOError("Invalid payload")
      }
      opts.forEach(({ columnId, contentId }) => {
        if (
          typeof token !== "string" ||
          typeof columnId !== "string" ||
          typeof contentId !== "string"
        ) {
          throw new CHLOError("Invalid payload")
        }
      })

      const tasks: Ops[] = opts.map(
        ({ columnId, contentId }) =>
          ({
            exec: () => addProjectCard(token, columnId, contentId),
            onSuccess: remain => this.update({ running: remain !== 0 }),
            onError: error => this.update({ error }),
          } as Ops),
      )

      if (tasks.length > 0) {
        this.update({ running: true })
      }
      enqueue(tasks)
    },

    async moveProjectCard({
      token,
      opts,
    }: {
      token: string
      opts: MoveProjectCardOpt[]
    }) {
      if (typeof token !== "string") {
        throw new CHLOError("Invalid payload")
      }
      opts.forEach(({ cardId, columnId }) => {
        if (typeof cardId !== "string" || typeof columnId !== "string") {
          throw new CHLOError("Invalid payload")
        }
      })

      const tasks: Ops[] = opts.map(
        ({ cardId, columnId }) =>
          ({
            exec: () => moveProjectCard(token, cardId, columnId),
            onSuccess: remain => this.update({ running: remain !== 0 }),
            onError: error => this.update({ error }),
          } as Ops),
      )
      if (tasks.length > 0) {
        this.update({ running: true })
      }
      enqueue(tasks)
    },
  }),
  reducers: {
    update: (state, payload) => {
      return { ...state, ...payload }
    },
  },

  state: {
    running: false,
    error: null,
  },
})
