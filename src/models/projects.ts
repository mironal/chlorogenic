import { createModel, init, ModelConfig } from "@rematch/core"
import github, {
  GitHubProject,
  GithubProjectIdentifier,
  isGithubRepoProjectIdentifier,
} from "./github"

export interface ProjectsModel {
  projects: { [slug: string]: GitHubProject | undefined }
}

const createStore = () => {
  return init({ models: { github } })
}

const githubRegistory: {
  [slug: string]: ReturnType<typeof createStore> | undefined
} = {}

// TODO split
export const createSlug = (identifier: GithubProjectIdentifier): string => {
  if (isGithubRepoProjectIdentifier(identifier)) {
    return `${identifier.repository.owner}/${identifier.repository.owner}/${
      identifier.number
    }`
  }
  return `orgs/${identifier.organization}/${identifier.number}`
}

export default createModel<ProjectsModel, ModelConfig<ProjectsModel>>({
  effects: dispatch => ({
    async add(payload: { token: string; identifier: GithubProjectIdentifier }) {
      const { identifier } = payload
      const slug = createSlug(identifier)

      let store = githubRegistory[slug]
      if (!store) {
        store = createStore()
        githubRegistory[slug] = store
      }

      await store.dispatch.github.fetchProject(payload)
      const project = store.getState().github.project

      this.setProject(project)
    },
  }),
  reducers: {
    setProject: (state, project: GitHubProject) => {
      const slug = createSlug(project.identifier)
      const projects = { ...state.projects }
      projects[slug] = project
      return {
        ...state,
        projects,
      }
    },
  },
  state: { projects: {} },
})
