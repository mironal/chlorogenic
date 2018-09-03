import { createModel, init, ModelConfig } from "@rematch/core"
import { createProjectSlug } from "../misc/project"
import github, { GitHubProject, GithubProjectIdentifier } from "./github"

export interface ProjectsModel {
  projects: { [slug: string]: GitHubProject | undefined }
}

const createStore = () => {
  return init({ models: { github } })
}

const githubRegistory: {
  [slug: string]: ReturnType<typeof createStore> | undefined
} = {}

export default createModel<ProjectsModel, ModelConfig<ProjectsModel>>({
  effects: dispatch => ({
    async add(payload: { token: string; identifier: GithubProjectIdentifier }) {
      const { identifier } = payload
      const slug = createProjectSlug(identifier)

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
      const slug = createProjectSlug(project.identifier)
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
