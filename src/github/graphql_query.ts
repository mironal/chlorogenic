import {
  GitHubOrgProjectIdentifier,
  GitHubRepoProjectIdentifier,
} from "../models/github.types"

export const organizationProjectQuery = ({
  organization,
  number: num,
}: GitHubOrgProjectIdentifier) => `query {
  organization(login: "${organization}") {
    project(number: ${num}){
      name
      url
      columns(first: 100){
        edges {
          node {
            id
            name
            cards(first: 100) {
              edges {
                node {
                  id
                  note
                  content {
                    ... on Issue {
                      id
                      number
                      title
                      author {
                        login
                      }
                      url
                    }
                    ... on PullRequest {
                      id
                      number
                      title
                      author {
                        login
                      }
                      url
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
`

export const repositoryProjectQuery = ({
  repository: { owner, name },
  number: num,
}: GitHubRepoProjectIdentifier) => `query {
  repository(owner: "${owner}", name: "${name}") {
    project(number:${num}) {
      name
      url
      columns(first: 100){
        edges {
          node {
            id
            name
            cards(first: 100) {
              edges {
                node {
                  id
                  note
                  content {
                    ... on Issue {
                      id
                      number
                      title
                      author {
                        login
                      }
                      url
                    }
                    ... on PullRequest {
                      id
                      number
                      title
                      author {
                        login
                      }
                      url
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
`

export const addProjectCardQuery = (
  projectColumnId: string,
  contentId: string,
) => `mutation {
  addProjectCard (input: {
    projectColumnId: "${projectColumnId}",
    contentId:"${contentId}"
  }) {
    projectColumn {
      name
    }
  }
}
`

export const moveProjectCardQuery = (
  cardId: string,
  columnId: string,
) => `mutation {
  moveProjectCard(input: {
    cardId: "${cardId}",
    columnId: "${columnId}",
  }) {
    cardEdge {
      node {
        column {
          name
          id
        }
      }
    }
  }
}`
