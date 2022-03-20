// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('createUser', ({ username, password, name }) => {
  const user = {
    username,
    password,
    name,
  }
  cy.request('POST', 'http://localhost:3003/api/users', user)
})

Cypress.Commands.add(
  'login',
  ({
    username,
    password,
    localStorageInfoUserKey = 'loggedInBloglistUserApp',
  }) => {
    cy.request('POST', 'http://localhost:3003/api/login', {
      username,
      password,
    }).then(({ body }) => {
      localStorage.setItem(localStorageInfoUserKey, JSON.stringify(body))
      cy.visit('http://localhost:3000')
    })
  }
)

Cypress.Commands.add(
  'createBlog',
  ({
    title,
    author,
    url,
    localStorageInfoUserKey = 'loggedInBloglistUserApp',
  }) => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:3003/api/blogs',
      body: {
        title,
        author,
        url,
      },
      auth: {
        bearer: JSON.parse(localStorage.getItem(localStorageInfoUserKey)).token,
      },
    }).then(() => {
      cy.visit('http://localhost:3000')
    })
  }
)

Cypress.Commands.add('like', (title, numberOfLikes) => {
  cy.intercept('PUT', '/api/blogs/*').as(`updateLikes${numberOfLikes}`)
  cy.contains(title).contains('view').click()
  for (let i = 0; i < numberOfLikes; i++) {
    cy.contains(title).find('button').contains('like').click()
    cy.wait(`@updateLikes${numberOfLikes}`)
  }
})
