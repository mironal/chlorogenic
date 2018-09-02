import { GitHubProject, GitHubRepository } from "../models/github"

export const listColumnsAndCards = (project: GitHubProject) => `query {
  repository(owner: ${project.repo.owner} name:${project.repo.name}){
    project(number:${project.number}) {
      columns(last: 100) {
        edges {
          node {
            name
            id
            cards(last: 100) {
              edges {
                node {
                  id
                  databaseId
                  note
                  content {
                    ... on Issue {
                      title
                      number
                      author {
                        login
                      }
                      url
                    }
                    ... on PullRequest {
                      title
                      number
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
}`

export const listRepoProjects = (repo: GitHubRepository) => `query {
  repository(owner: ${repo.owner} name: ${repo.name}) {
    projects(last: 100) {
      edges {
        node {
          name
          number
          body
        }
      }
    }
  }
}`

export const listRepositories = `query {
  viewer{
    repositories(last:100, orderBy:{field: CREATED_AT, direction: DESC}, isFork:false) {
      edges {
        node {
          owner {
            login
          },
          name
        }
      }
    }
    organizations(last:100) {
      edges {
        node {
          repositories(last:100) {
            edges {
              node {
                owner {
                  login
                }
                name
              }
            }
          }
        }
      }
    }
  }
}`
