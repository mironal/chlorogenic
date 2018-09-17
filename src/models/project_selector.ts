import { createModel, ModelConfig } from "@rematch/core"
import { ProjectLoadingConditionModel } from "./gh_project_loader"
import { GithubProjectIdentifier } from "./github.types"

export type ProjectSelectorModel = GithubProjectIdentifier | null

export default createModel<
  ProjectSelectorModel,
  ModelConfig<ProjectSelectorModel>
>({
  reducers: {
    update: (state, identifer: ProjectSelectorModel) => {
      return identifer
    },
  },
  state: null,
})
