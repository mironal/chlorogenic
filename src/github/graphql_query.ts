import {
  GitHubOrgProjectIdentifier,
  GitHubRepoProjectIdentifier,
} from "../models/github"

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
                      number
                      title
                      author {
                        login
                      }
                      url
                    }
                    ... on PullRequest {
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
                      number
                      title
                      author {
                        login
                      }
                      url
                    }
                    ... on PullRequest {
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
